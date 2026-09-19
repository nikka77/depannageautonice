// =============================================
// DEPANNAGERAUTONICE.FR — demande.js
// Wizard 5 étapes : Position → Panne → Détails → Contact → Confirmation
// =============================================

const TOTAL_STEPS = 5;

// ── État de la demande ──────────────────────
const state = {
  currentStep: 0,
  lat: null,
  lng: null,
  address: '',
  panneType: '',
  panneLabel: '',
  description: '',
  plaque: '',
  vehicule: null,
  photoDataUrl: null,
  firstName: '',
  phone: '',
  hasGps: false,  // false = lat/lng sont le repli « centre de Nice », pas la position réelle
  delivery: null, // 'sent' = reçue par le garage | 'manual' = au client de l'envoyer
};

const CONFIG = window.SITE_CONFIG || {};

// ── Maps Leaflet ────────────────────────────
let miniMap      = null;
let miniMarker   = null;
let confirmMap   = null;
let confirmMarker = null;
let routeLayer   = null; // polyline du trajet

const GARAGE = [43.7102, 7.2620]; // Siège Nice — point de départ technicien

// ── Éléments DOM ───────────────────────────
const stepDots  = document.querySelectorAll('.step-dot');
const stepLines = document.querySelectorAll('.step-line');

// ── Helpers ─────────────────────────────────
function goToStep(n) {
  document.querySelectorAll('.step-panel').forEach((p, i) => {
    p.classList.toggle('active', i === n);
  });
  stepDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === n);
    dot.classList.toggle('done', i < n);
  });
  stepLines.forEach((line, i) => {
    line.classList.toggle('done', i < n);
  });
  state.currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initLeafletMap(containerId, lat, lng, onMapReady) {
  if (typeof L === 'undefined') return null;
  const el = document.getElementById(containerId);
  if (!el) return null;

  const map = L.map(containerId, {
    center: [lat, lng], zoom: 14,
    scrollWheelZoom: false, zoomControl: false, attributionControl: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 18,
  }).addTo(map);

  const pulseIcon = L.divIcon({
    className: '',
    html: '<div class="leaflet-marker-pulse"></div>',
    iconSize: [18, 18], iconAnchor: [9, 9],
  });

  const marker = L.marker([lat, lng], { icon: pulseIcon }).addTo(map);

  if (onMapReady) onMapReady(map, marker);
  return { map, marker };
}

function updateMapPosition(mapObj, lat, lng) {
  if (!mapObj) return;
  mapObj.map.setView([lat, lng], 14);
  mapObj.marker.setLatLng([lat, lng]);
}

// ── Reverse geocoding (Nominatim OSM) ───────
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`,
      { headers: { 'Accept-Language': 'fr' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address || {};
    const parts = [
      a.road || a.pedestrian || a.footway,
      a.house_number,
      a.town || a.city || a.village || a.municipality,
    ].filter(Boolean);
    return parts.length ? parts.join(' ') : (data.display_name ? data.display_name.split(',').slice(0, 2).join(',') : null);
  } catch {
    return null;
  }
}

// ── ÉTAPE 0 — Géolocalisation ───────────────
const btnGeo         = document.getElementById('btnGeo');
const btnGeoText     = document.getElementById('btnGeoText');
const geoLoading     = document.getElementById('geoLoading');
const geoFound       = document.getElementById('geoFound');
const geoAddressText = document.getElementById('geoAddressText');
const manualAddress  = document.getElementById('manualAddress');
const btn0Next       = document.getElementById('btn0Next');

let geoMiniMapObj = null;

// Détection préventive de l'état de permission (avant tout clic)
// Si denied → on affiche les instructions sans attendre le clic raté
function updateGeoUiForPermission(state) {
  if (!btnGeo || !btnGeoText) return;
  if (state === 'denied') {
    btnGeo.classList.add('error-state');
    btnGeoText.textContent = 'GPS bloqué — touchez l\'icône AA/cadenas dans la barre d\'adresse → Réglages du site → Position → Autoriser';
  } else if (state === 'granted') {
    btnGeoText.textContent = 'Activer ma position GPS (autorisé)';
  } else {
    btnGeoText.textContent = 'Activer ma position GPS';
    btnGeo.classList.remove('error-state');
  }
}

if (navigator.permissions && navigator.permissions.query) {
  navigator.permissions.query({ name: 'geolocation' }).then(result => {
    updateGeoUiForPermission(result.state);
    // Écoute les changements (l'utilisateur peut autoriser pendant qu'il est sur la page)
    result.addEventListener && result.addEventListener('change', () => updateGeoUiForPermission(result.state));
    result.onchange = () => updateGeoUiForPermission(result.state);
  }).catch(() => { /* API non supportée → on laisse le bouton tel quel */ });
}

btnGeo.addEventListener('click', () => {
  if (!navigator.geolocation) {
    btnGeo.classList.add('error-state');
    btnGeoText.textContent = 'Géolocalisation non disponible';
    return;
  }

  geoLoading.classList.remove('hidden');
  btnGeo.disabled = true;
  btnGeoText.textContent = 'Localisation…';

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      state.lat = pos.coords.latitude;
      state.lng = pos.coords.longitude;
      state.hasGps = true;

      geoLoading.classList.add('hidden');
      geoFound.classList.remove('hidden');
      btnGeo.classList.add('success');
      btnGeoText.textContent = 'Position activée ✓';
      btnGeo.disabled = false;

      // Mini-carte
      if (!geoMiniMapObj) {
        geoMiniMapObj = initLeafletMap('geoMiniMap', state.lat, state.lng);
      } else {
        updateMapPosition(geoMiniMapObj, state.lat, state.lng);
      }

      // Adresse
      const addr = await reverseGeocode(state.lat, state.lng);
      state.address = addr || `${state.lat.toFixed(5)}, ${state.lng.toFixed(5)}`;
      geoAddressText.textContent = state.address;
    },
    (err) => {
      geoLoading.classList.add('hidden');
      btnGeo.disabled = false;
      btnGeo.classList.add('error-state');
      let msg;
      if (err.code === 1) {
        msg = 'GPS bloqué — touchez l\'icône cadenas/AA dans la barre d\'adresse pour autoriser la position, ou saisissez l\'adresse manuellement';
      } else if (err.code === 2) {
        msg = 'Position indisponible — vérifiez que la localisation est activée dans les réglages, ou saisissez manuellement';
      } else if (err.code === 3) {
        msg = 'Délai dépassé — réessayez ou saisissez manuellement';
      } else {
        msg = 'Erreur GPS — saisissez manuellement';
      }
      btnGeoText.textContent = msg;
      // Focus automatique sur la saisie manuelle pour faciliter le repli
      if (manualAddress) manualAddress.focus();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
});

btn0Next.addEventListener('click', () => {
  const manual = manualAddress.value.trim();
  if (!state.lat && !manual) {
    manualAddress.style.borderColor = 'var(--danger)';
    manualAddress.focus();
    return;
  }
  manualAddress.style.borderColor = '';
  if (!state.lat) {
    // Saisie manuelle — pas de coordonnées précises
    state.address = manual;
    state.lat = 43.7102; // Nice centre (fallback pour Leaflet)
    state.lng = 7.2620;
  }
  goToStep(1);
});

manualAddress.addEventListener('input', () => {
  manualAddress.style.borderColor = '';
});

// ── ÉTAPE 1 — Type de panne ─────────────────
const panneCards = document.querySelectorAll('.panne-card');
const btn1Next   = document.getElementById('btn1Next');
const btn1Back   = document.getElementById('btn1Back');

const panneLabels = {
  pneu:      'Pneu crevé',
  batterie:  'Batterie / Démarrage',
  carburant: 'Panne carburant',
  remorquage:'Remorquage',
  moteur:    'Surchauffe moteur',
  autre:     'Autre panne',
};

panneCards.forEach(card => {
  card.addEventListener('click', () => {
    panneCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.panneType  = card.dataset.type;
    state.panneLabel = panneLabels[state.panneType] || state.panneType;
    btn1Next.disabled = false;
  });
});

btn1Next.addEventListener('click', () => { if (state.panneType) goToStep(2); });
btn1Back.addEventListener('click', () => goToStep(0));

// Pré-sélection depuis l'URL ?type=
(function applyUrlType() {
  const params = new URLSearchParams(window.location.search);
  const t = params.get('type');
  if (t === 'pneu' || t === 'batterie' || t === 'carburant' || t === 'remorquage') {
    const match = document.querySelector(`.panne-card[data-type="${t}"]`);
    if (match) match.click();
  }
})();

// ── ÉTAPE 2 — Description & Photo ───────────
const photoInput      = document.getElementById('photoInput');
const photoPreview    = document.getElementById('photoPreview');
const photoRemove     = document.getElementById('photoRemove');
const photoUploadArea = document.getElementById('photoUploadArea');
const photoUploadContent = document.getElementById('photoUploadContent');
const btn2Next        = document.getElementById('btn2Next');
const btn2Back        = document.getElementById('btn2Back');
const btn2Skip        = document.getElementById('btn2Skip');

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    state.photoDataUrl = e.target.result;
    photoPreview.src = state.photoDataUrl;
    photoPreview.classList.remove('hidden');
    photoRemove.classList.remove('hidden');
    photoUploadContent.classList.add('hidden');
    photoUploadArea.classList.add('has-photo');
    // Disable file input to avoid re-trigger
    photoInput.style.pointerEvents = 'none';
  };
  reader.readAsDataURL(file);
});

photoRemove.addEventListener('click', (e) => {
  e.stopPropagation();
  state.photoDataUrl = null;
  photoInput.value = '';
  photoPreview.classList.add('hidden');
  photoRemove.classList.add('hidden');
  photoUploadContent.classList.remove('hidden');
  photoUploadArea.classList.remove('has-photo');
  photoInput.style.pointerEvents = '';
});

// ── Recherche par plaque (étape 2) ──────────
// Part toute seule dès que la plaque est complète : le client n'a rien
// à cliquer. Savoir à l'avance que c'est un fourgon ou un électrique
// change le matériel que le dépanneur emporte.
if (window.Plaque) {
  Plaque.brancher({
    champ:  document.getElementById('plaqueInput'),
    carte:  document.getElementById('plaqueCarte'),
    statut: document.getElementById('plaqueStatut'),
    onTrouve: (v) => { state.vehicule = v; },
    onEfface: () => { state.vehicule = null; },
  });
}

// Relève la plaque saisie, que le client valide l'étape ou la passe.
function releverPlaque() {
  const champ = document.getElementById('plaqueInput');
  if (champ) state.plaque = champ.value.trim();
}

btn2Next.addEventListener('click', () => {
  releverPlaque();
  state.description = document.getElementById('descriptionText').value.trim();
  goToStep(3);
});
btn2Back.addEventListener('click', () => goToStep(1));
btn2Skip.addEventListener('click', () => {
  // « Passer » ne concerne que la description : une plaque déjà saisie
  // reste acquise, sinon le véhicule identifié serait perdu en silence.
  releverPlaque();
  state.description = '';
  goToStep(3);
});

// ── ÉTAPE 3 — Coordonnées ───────────────────
const phoneInput = document.getElementById('phoneNumber');
const firstNameInput = document.getElementById('firstName');
const btn3Next   = document.getElementById('btn3Next');
const btn3Back   = document.getElementById('btn3Back');

function formatPhone(val) {
  const digits = val.replace(/\D/g, '').slice(0, 10);
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

phoneInput.addEventListener('input', () => {
  phoneInput.value = formatPhone(phoneInput.value);
  phoneInput.style.borderColor = '';
});

btn3Next.addEventListener('click', async () => {
  const phone = phoneInput.value.replace(/\s/g, '');
  if (phone.length < 10) {
    phoneInput.style.borderColor = 'var(--danger)';
    phoneInput.focus();
    return;
  }
  phoneInput.style.borderColor = '';
  state.phone     = phoneInput.value.trim();
  state.firstName = firstNameInput.value.trim();

  const btnLabel = btn3Next.innerHTML;
  btn3Next.disabled = true;
  btn3Next.classList.add('is-sending');
  btn3Next.textContent = 'Envoi en cours…';

  state.delivery = await deliverRequest();

  btn3Next.disabled = false;
  btn3Next.classList.remove('is-sending');
  btn3Next.innerHTML = btnLabel;

  buildConfirmation();
  goToStep(4);
  // Init carte APRÈS affichage du panel (évite le bug Leaflet sur container caché)
  setTimeout(initConfirmMap, 150);
});

btn3Back.addEventListener('click', () => goToStep(2));

// ── Transmission de la demande ──────────────
// Le site est statique : sans relais configuré, rien ne peut partir
// automatiquement. On le dit au client plutôt que de le laisser croire
// que sa demande est arrivée.
function libelleVehicule() {
  const v = state.vehicule;
  // Auto Ways renvoie tout en capitales : on adoucit, le message au
  // garage comme le récapitulatif client se lisent mieux ainsi.
  const j = (t) => (window.Plaque ? Plaque.joli(t) : t);
  const nom = v ? [j(v.marque), j(v.modele), v.version].filter(Boolean).join(' ') : '';
  const details = v ? [v.annee, j(v.energie), j(v.carrosserie)].filter(Boolean).join(', ') : '';
  if (state.plaque && nom) return `${state.plaque} — ${nom}${details ? ' (' + details + ')' : ''}`;
  if (state.plaque) return state.plaque;
  return null;
}

function requestSummary() {
  return [
    `Panne : ${state.panneLabel || '—'}`,
    libelleVehicule() ? `Véhicule : ${libelleVehicule()}` : null,
    `Adresse : ${state.address || '—'}`,
    state.hasGps
      ? `Position GPS : https://www.google.com/maps?q=${state.lat},${state.lng}`
      : 'Position GPS : non communiquée (adresse saisie à la main)',
    state.description ? `Description : ${state.description}` : null,
    `Prénom : ${state.firstName || '—'}`,
    `Téléphone : ${state.phone}`,
  ].filter(Boolean).join('\n');
}

function saveRequestLocally() {
  try {
    localStorage.setItem('dan_last_request', JSON.stringify({
      date: new Date().toISOString(),
      panne: state.panneLabel,
      adresse: state.address,
      phone: state.phone,
    }));
  } catch { /* stockage indisponible (navigation privée) → sans conséquence */ }
}

async function deliverRequest() {
  saveRequestLocally();

  if (!CONFIG.formAccessKey) return 'manual';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONFIG.formTimeoutMs || 8000);

  try {
    const res = await fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: CONFIG.formAccessKey,
        subject: `🚨 Dépannage — ${state.panneLabel || 'demande'} — ${state.phone}`,
        from_name: 'depannageautonice.fr',
        message: requestSummary(),
      }),
    });
    return res.ok ? 'sent' : 'manual';
  } catch {
    return 'manual';
  } finally {
    clearTimeout(timer);
  }
}

// ── ÉTAPE 4 — Confirmation ──────────────────
function buildConfirmation() {
  // Adresse label sur la carte
  const addrLabel = document.getElementById('confirmAddrLabel');
  if (addrLabel) addrLabel.textContent = state.address || 'Votre position';

  // Recap panne
  const recapTypeVal = document.getElementById('recapTypeVal');
  if (recapTypeVal) recapTypeVal.textContent = state.panneLabel || '—';

  // Distance depuis l'atelier, calculée d'après les coordonnées saisies
  // Sans GPS, lat/lng valent le centre de Nice : afficher une distance serait faux.
  const techDistance = document.getElementById('techDistance');
  const techExp = document.querySelector('.tech-exp');
  if (techDistance) {
    if (state.hasGps) {
      const dLat = state.lat - GARAGE[0];
      const dLng = state.lng - GARAGE[1];
      const km = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
      techDistance.textContent = `~${km.toFixed(1)} km`;
      if (techExp) techExp.textContent = 'de vous';
    } else {
      techDistance.textContent = 'Nice';
      if (techExp) techExp.textContent = 'centre-ville';
    }
  }

  // Rappelle au client ce que le garage a reçu sur son véhicule.
  const recapVeh = document.getElementById('recapVehicule');
  if (recapVeh) {
    const libelle = libelleVehicule();
    recapVeh.textContent = libelle ? `Véhicule transmis : ${libelle}` : '';
    recapVeh.hidden = !libelle;
  }

  applyDeliveryState();

  // Lien WhatsApp
  buildWhatsApp();
  // La carte sera initialisée après affichage du panel (setTimeout dans btn3Next)
}

// Adapte l'écran final à ce qui s'est réellement passé.
function applyDeliveryState() {
  const sent    = state.delivery === 'sent';
  const banner  = document.getElementById('confirmBanner');
  const title   = document.getElementById('confirmTitle');
  const sub     = document.getElementById('confirmSub');
  const notice  = document.getElementById('confirmNotice');

  if (banner) banner.classList.toggle('is-pending', !sent);

  if (title) title.textContent = sent ? 'Demande transmise' : 'Dernière étape';
  if (sub) {
    sub.textContent = sent
      ? `Nous vous rappelons au ${state.phone}`
      : 'Confirmez par WhatsApp ou appelez-nous';
  }

  if (notice) {
    notice.hidden = sent;
    if (!sent) {
      notice.querySelector('.confirm-notice-text').textContent =
        'Votre demande n\'est pas encore arrivée chez nous. Touchez « Envoyer via WhatsApp » ci-dessous — le message est déjà rédigé — ou appelez-nous directement.';
    }
  }

  // Le bouton WhatsApp devient l'action principale quand rien n'est parti.
  const waBtn = document.getElementById('btnWhatsapp');
  if (waBtn) {
    const label = waBtn.querySelector('.wa-label');
    if (label) label.textContent = sent ? 'Ajouter une précision par WhatsApp' : 'Envoyer via WhatsApp';
  }
}

// ── Carte confirmation avec trajet ──────────
function initConfirmMap() {
  const CLIENT = [state.lat, state.lng];
  const mapEl = document.getElementById('confirmMap');
  if (!mapEl || typeof L === 'undefined') return;

  if (!confirmMap) {
    // Première initialisation — panel maintenant visible, taille correcte
    confirmMap = L.map('confirmMap', {
      scrollWheelZoom: false, zoomControl: false, attributionControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 18,
    }).addTo(confirmMap);

    // Marqueur client (pulse orange)
    const clientIcon = L.divIcon({
      className: '',
      html: '<div class="leaflet-marker-pulse"></div>',
      iconSize: [18, 18], iconAnchor: [9, 9],
    });
    confirmMarker = L.marker(CLIENT, { icon: clientIcon })
      .addTo(confirmMap)
      .bindPopup('📍 Votre position');

    // Marqueur technicien (camion)
    const techIcon = L.divIcon({
      className: '',
      html: '<div class="leaflet-marker-tech"></div>',
      iconSize: [22, 22], iconAnchor: [11, 11],
    });
    L.marker(GARAGE, { icon: techIcon })
      .addTo(confirmMap)
      .bindPopup('🚐 Technicien en route');

    // Fit bounds pour voir les deux marqueurs
    confirmMap.fitBounds([GARAGE, CLIENT], { padding: [32, 32] });

    // Tracé du trajet via OSRM (gratuit, sans clé API)
    drawRoute(confirmMap, GARAGE, CLIENT);

  } else {
    // Re-affichage : recalculer la taille et recentrer
    confirmMap.invalidateSize();
    if (confirmMarker) confirmMarker.setLatLng(CLIENT);
    if (routeLayer) { confirmMap.removeLayer(routeLayer); routeLayer = null; }
    confirmMap.fitBounds([GARAGE, CLIENT], { padding: [32, 32] });
    drawRoute(confirmMap, GARAGE, CLIENT);
  }
}

async function drawRoute(map, from, to) {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from[1]},${from[0]};${to[1]},${to[0]}` +
      `?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM');
    const data = await res.json();
    if (!data.routes?.[0]) throw new Error('no route');
    const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    routeLayer = L.polyline(coords, {
      color: '#ff6b00', weight: 3, opacity: 0.85, dashArray: '8, 5',
    }).addTo(map);
  } catch {
    // Fallback : ligne droite si OSRM indisponible
    routeLayer = L.polyline([from, to], {
      color: '#ff6b00', weight: 2, opacity: 0.5, dashArray: '6, 6',
    }).addTo(map);
  }
}

function buildWhatsApp() {
  const prenom = state.firstName || 'Client';
  const lines  = [
    `🚨 DEMANDE DE DÉPANNAGE`,
    ``,
    `📍 Position : ${state.address}`,
    state.hasGps ? `🗺 https://www.google.com/maps?q=${state.lat},${state.lng}` : null,
    `🔧 Panne : ${state.panneLabel}`,
    libelleVehicule() ? `🚗 Véhicule : ${libelleVehicule()}` : null,
    state.description ? `📝 Description : ${state.description}` : null,
    ``,
    `👤 Prénom : ${prenom}`,
    `📞 Tél : ${state.phone}`,
    ``,
    `⏱ Demande envoyée via depannageautonice.fr`,
  ].filter(l => l !== null).join('\n');

  const encoded = encodeURIComponent(lines);
  const link = document.getElementById('btnWhatsapp');
  const number = CONFIG.whatsappNumber || '33617684270';
  if (link) link.href = `https://wa.me/${number}?text=${encoded}`;
}

// ── Init ────────────────────────────────────
goToStep(0);
