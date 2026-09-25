// =============================================
// DÉPANNAGE AUTO NICE — js/demande-rapide.js
// Demande de dépannage en 4 étapes, dans une fenêtre présente sur toutes
// les pages (balisage : demandeRapide() dans tools/build-pages.js).
//
//   1. Lieu     GPS ou adresse, carte avec repère déplaçable, accès
//   2. Panne    type + questions propres à la panne, véhicule, plaque, photo
//   3. Quand    maintenant ou rendez-vous, destination, passagers, assistance
//   4. Contact  coordonnées, récapitulatif, estimation du prix et du délai
//
// Tout lien vers demande.html ouvre la fenêtre (Ctrl/Cmd-clic : nouvel
// onglet, qui arrive sur l'accueil fenêtre ouverte). La carte (Leaflet) et
// la recherche par plaque ne se chargent qu'à l'ouverture.
// Envoi : Web3Forms si la clé est dans config.js, sinon message WhatsApp
// déjà rédigé. Le message au garage est toujours en français.
// =============================================

(function () {
  'use strict';

  const qr = document.getElementById('qr');
  if (!qr || typeof qr.showModal !== 'function') return;

  const RACINE = new URL('..', document.currentScript ? document.currentScript.src : location.href);
  const LANG = qr.dataset.lang || 'fr';
  const Q = JSON.parse(document.getElementById('qrTxt').textContent);
  const D = JSON.parse(document.getElementById('qrData').textContent);
  const CFG = window.SITE_CONFIG || {};
  const $ = id => document.getElementById(id);
  const f = $('qrForm');
  const el = f.elements;
  const steps = [...f.querySelectorAll('.qr-step')];
  const err = $('qrErr');
  const nextBtn = $('qrNext');
  const backBtn = $('qrBack');
  const mesurer = n => { if (window.mesurer) window.mesurer('demande/' + n); };

  const etat = { etape: 1, gps: null, photo: null, vehicule: null, carte: null, repere: null, declencheur: null };

  // ── Chargement paresseux (Leaflet, plaque) ─
  const charges = {};
  function charger(src, css) {
    if (charges[src]) return charges[src];
    if (css) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = new URL(css, RACINE).href; document.head.append(l); }
    charges[src] = new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = new URL(src, RACINE).href; s.onload = ok; s.onerror = ko;
      document.head.append(s);
    });
    return charges[src];
  }
  const leaflet = () => (window.L ? Promise.resolve() : charger('js/leaflet.js', 'vendor/css/leaflet.css'));

  // ── Distances, délais, prix ────────────────
  const rad = x => x * Math.PI / 180;
  function kmVol(a, b) {
    const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  }
  // Route ≈ vol d'oiseau × 1,3 sur la Côte d'Azur (relief, corniches).
  const kmRoute = pos => Math.round(kmVol(D.atelier, pos) * 1.3);
  function delai(km) {
    if (km <= 12) return D.delais[0].d;
    return D.delais.slice(1).reduce((m, v) => (Math.abs(v.km - km) < Math.abs(m.km - km) ? v : m)).d;
  }
  const eur = n => (LANG === 'en' ? '€' + n : n + ' €');

  function nuitPrevue() {
    if (el.quand.value === 'plus-tard') {
      const d = el.date.value ? new Date(el.date.value + 'T12:00:00') : null;
      return el.creneau.value === '4' || (d && d.getDay() === 0);
    }
    const n = new Date();
    return n.getHours() >= 20 || n.getHours() < 8 || n.getDay() === 0;
  }

  // Estimation : même grille que la page Tarifs (tools/tarifs.js).
  function estimer() {
    const c = D.calcul, p = D.presta;
    const type = el.type.value;
    const lignes = [];
    let base = null, des = false, libelle = D.loc.types[type] || '';
    const km = etat.gps ? kmRoute([etat.gps.lat, etat.gps.lng]) : null;
    if (type === 'batterie') base = p.batterie;
    else if (type === 'pneu') base = p.roue;
    else if (type === 'carburant') { base = el.carbu.value === 'erreur' ? p.carburant : p['panne-seche']; if (el.carbu.value) libelle = D.loc.carbuOpts[el.carbu.value]; }
    else if (type === 'cles') { base = el.cles.value === 'enfermees' ? p.ouverture : p.neiman; des = el.cles.value !== 'enfermees'; if (el.cles.value) libelle = D.loc.clesOpts[el.cles.value]; }
    else if (type === 'moteur') { base = p.diagnostic; des = true; }
    else if (type === 'remorquage' || type === 'accident') {
      // Distance de remorquage connue seulement si le véhicule va à l'atelier.
      const kmRem = el.dest.value === 'atelier' && km != null ? Math.max(1, km) : null;
      if (kmRem != null) {
        const b = c.bandes.find(([max]) => kmRem <= max);
        const der = c.bandes[c.bandes.length - 1];
        base = b ? b[1] : Math.round(der[1] + (kmRem - der[0]) * c.kmSupp);
        libelle += ` · ${kmRem} km`;
      } else { base = c.bandes[0][1]; des = true; }
    }
    if (base == null) return null;
    lignes.push([libelle, base]);
    let total = base;
    if (km != null && km > c.baseKm && !(el.dest.value === 'atelier' && (type === 'remorquage' || type === 'accident'))) {
      const x = Math.round((km - c.baseKm) * c.deplacementKm); total += x; lignes.push([`+ ${km - c.baseKm} km`, x]);
    }
    if (nuitPrevue()) { total += c.nuit; lignes.push([LANG === 'fr' ? 'Nuit, dimanche ou férié' : LANG === 'it' ? 'Notte, domenica o festivo' : 'Night, Sunday or holiday', c.nuit]); }
    if (el.sousSol.checked) { total += c.sousSol; lignes.push([f.querySelector('input[name="sousSol"] + span').textContent, c.sousSol]); }
    if (['utilitaire', 'campingcar'].includes(el.categorie.value)) { total += c.utilitaire; lignes.push([D.loc.categories[el.categorie.value], c.utilitaire]); }
    return { total, des: des || km == null, lignes, km };
  }

  // ── Ouverture / fermeture ──────────────────
  function jour(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  function prerempli(params) {
    const type = params.get('type');
    const r = type && f.querySelector(`input[name="type"][value="${CSS.escape(type)}"]`);
    if (r) { r.checked = true; majConditions(); }
    if (params.get('quand') === 'plus-tard') { el.quand.value = 'plus-tard'; majConditions(); }
  }
  function ouvrir(params, declencheur) {
    if (params) prerempli(params);
    etat.declencheur = declencheur || null;
    if (!qr.open) qr.showModal();
    aller(etat.etape, true);
    leaflet().catch(() => {});       // la carte sera prête à l'étape 1
    if (CFG.plaqueEndpoint) charger('js/plaque.js').then(brancherPlaque).catch(() => {});
    mesurer('ouverture');
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.hasAttribute('data-qr-skip')) return;
    const href = a.getAttribute('href');
    if (!/(^|\/)demande\.html(\?|#|$)/.test(href) && href !== '#demande') return;
    e.preventDefault();
    ouvrir(new URL(a.href, location.href).searchParams, a);
  });
  qr.addEventListener('click', e => { if (e.target === qr || e.target.closest('[data-qr-close]')) qr.close(); });
  qr.addEventListener('close', () => { if (etat.declencheur) etat.declencheur.focus(); });
  // demande.html (ancienne page) redirige ici avec #demande.
  if (location.hash === '#demande') {
    ouvrir(new URLSearchParams(location.search));
    history.replaceState(null, '', location.pathname + location.search);
  }

  // ── Navigation entre étapes ────────────────
  function aller(n, sansFocus) {
    etat.etape = n;
    steps.forEach(s => { s.hidden = +s.dataset.step !== n; });
    qr.querySelectorAll('.qr-prog li').forEach(li => {
      li.classList.toggle('is-on', +li.dataset.n === n);
      li.classList.toggle('is-fait', +li.dataset.n < n);
    });
    $('qrEtape').textContent = `${n} / 4 — ${steps[n - 1].getAttribute('aria-label')}`;
    backBtn.hidden = n === 1;
    const derniere = n === 4;
    nextBtn.innerHTML = '';
    nextBtn.append(derniere ? nextBtn.dataset.envoyer : nextBtn.dataset.suivant);
    nextBtn.classList.toggle('is-envoyer', derniere);
    err.hidden = true;
    f.scrollTop = 0;
    if (n === 1 && etat.gps) montrerCarte();
    if (n === 4) recap();
    if (!sansFocus) steps[n - 1].focus();
    else if (n === 1 && !etat.gps && !el.adresse.value) $('qrGps').focus();
    mesurer('etape-' + n);
  }
  function montrer(msg, champ) { err.textContent = msg; err.hidden = false; if (champ) champ.focus({ preventScroll: false }); }
  function valider(n) {
    if (n === 1 && !etat.gps && !el.adresse.value.trim()) return montrer(Q.errLieu, el.adresse), false;
    if (n === 2 && !el.type.value) return montrer(Q.errType, f.querySelector('input[name="type"]')), false;
    if (n === 4 && el.tel.value.replace(/\D/g, '').length < 9) return montrer(Q.errTel, el.tel), false;
    return true;
  }
  backBtn.addEventListener('click', () => aller(etat.etape - 1));
  f.addEventListener('submit', e => {
    e.preventDefault();
    if (!valider(etat.etape)) return;
    if (etat.etape < 4) aller(etat.etape + 1);
    else envoyer();
  });

  // ── Affichages conditionnels ───────────────
  function majConditions() {
    const type = el.type.value;
    f.querySelectorAll('[data-si]').forEach(b => { b.hidden = b.dataset.si !== type; });
    f.querySelectorAll('[data-si-carbu]').forEach(b => { b.hidden = el.carbu.value !== b.dataset.siCarbu; });
    $('qrBlessesMsg').hidden = el.blesses.value !== 'oui';
    f.querySelectorAll('input[data-montre]').forEach(c => { $(c.dataset.montre).hidden = !c.checked; });
    const tard = el.quand.value === 'plus-tard';
    $('qrRdv').hidden = !tard;
    if (tard && !el.date.value) { const d = new Date(); el.date.min = jour(d); d.setDate(d.getDate() + 1); el.date.value = jour(d); }
    $('qrDestBloc').hidden = !['garage', 'domicile'].includes(el.dest.value);
    $('qrAssistanceMsg').hidden = el.assistance.value === 'non';
  }
  f.addEventListener('change', () => { majConditions(); err.hidden = true; });
  el.quand.value = 'maintenant';
  el.dest.value = 'decider';
  majConditions();

  // ── Étape 1 : position ─────────────────────
  const gpsBtn = $('qrGps'), gpsSt = $('qrGpsSt');
  function statut(t) { gpsSt.hidden = !t; gpsSt.textContent = t || ''; }
  function afficherDistance() {
    const d = $('qrDist');
    if (!etat.gps) { d.hidden = true; return; }
    const km = kmRoute([etat.gps.lat, etat.gps.lng]);
    d.hidden = false;
    d.textContent = `${Q.dist.replace('{km}', km)} · ${Q.delai.replace('{d}', delai(km))}`;
  }
  async function adresseDe(lat, lng) {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&accept-language=fr&lat=${lat}&lon=${lng}`, { headers: { Accept: 'application/json' } });
      const a = (await r.json()).address || {};
      const rue = [a.house_number, a.road || a.pedestrian].filter(Boolean).join(' ');
      const ville = a.city || a.town || a.village || a.municipality || '';
      return [rue, ville].filter(Boolean).join(', ') || null;
    } catch { return null; }
  }
  function poser(lat, lng, prec, source) {
    etat.gps = { lat, lng, prec, source };
    gpsBtn.classList.add('is-ok');
    afficherDistance();
    montrerCarte();
  }
  async function montrerCarte() {
    if (!etat.gps) return;
    const zone = $('qrMap');
    zone.hidden = false; $('qrMapAide').hidden = false;
    try { await leaflet(); } catch { zone.hidden = true; return; }
    const pos = [etat.gps.lat, etat.gps.lng];
    if (!etat.carte) {
      etat.carte = L.map(zone, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      }).addTo(etat.carte);
      const icone = L.divIcon({ className: '', html: '<span class="qr-pin"></span>', iconSize: [26, 26], iconAnchor: [13, 13] });
      etat.repere = L.marker(pos, { draggable: true, icon: icone, keyboard: true, title: Q.position }).addTo(etat.carte);
      etat.repere.on('dragend', async () => {
        const p = etat.repere.getLatLng();
        etat.gps = { lat: p.lat, lng: p.lng, prec: 10, source: 'repère' };
        afficherDistance();
        const a = await adresseDe(p.lat, p.lng);
        if (a) el.adresse.value = a;
      });
    } else etat.repere.setLatLng(pos);
    etat.carte.setView(pos, 16);
    setTimeout(() => etat.carte.invalidateSize(), 60);
  }
  gpsBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return statut(Q.gpsKo);
    statut(Q.gpsEnCours);
    navigator.geolocation.getCurrentPosition(async p => {
      poser(p.coords.latitude, p.coords.longitude, Math.round(p.coords.accuracy), 'GPS');
      const prec = Math.round(p.coords.accuracy);
      statut(prec ? `${Q.gpsOk} (± ${prec} m)` : Q.gpsOk);
      mesurer('gps');
      const a = await adresseDe(p.coords.latitude, p.coords.longitude);
      if (a && !el.adresse.value) el.adresse.value = a;
    }, () => { statut(Q.gpsKo); el.adresse.focus(); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  });
  // Adresse saisie → position sur la carte (géocodage OpenStreetMap).
  async function placer() {
    const txt = el.adresse.value.trim();
    if (!txt) return;
    statut(Q.geoEnCours);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=fr,mc&viewbox=6.6,44.4,7.75,43.4&bounded=0&q=${encodeURIComponent(txt)}`, { headers: { Accept: 'application/json' } });
      const j = await r.json();
      if (!j[0]) return statut(Q.geoKo);
      poser(+j[0].lat, +j[0].lon, 50, 'adresse');
      statut('');
    } catch { statut(Q.geoKo); }
  }
  $('qrPlacer').addEventListener('click', placer);
  el.adresse.addEventListener('change', () => { if (!etat.gps || etat.gps.source !== 'GPS') placer(); });

  // ── Étape 2 : plaque et photo ──────────────
  const TXT_PLAQUE = {
    en: { recherche: 'Looking up the vehicle…', pasLeBon: 'Not my vehicle', pasMonVehicule: 'This is not my vehicle', format: 'French format: AA-123-AA', introuvable: 'Vehicle not found — just describe it in the details', indisponible: 'Lookup unavailable — just describe the vehicle in the details', delai: 'Lookup took too long', 'trop-de-requetes': 'Too many lookups, wait a minute' },
    it: { recherche: 'Ricerca del veicolo…', pasLeBon: 'Non è il mio', pasMonVehicule: 'Non è il mio veicolo', format: 'Formato francese: AA-123-AA', introuvable: 'Veicolo non trovato — descrivetelo nei dettagli', indisponible: 'Ricerca non disponibile — descrivete il veicolo nei dettagli', delai: 'La ricerca ha richiesto troppo tempo', 'trop-de-requetes': 'Troppe ricerche, attendete un minuto' },
  };
  let plaqueBranchee = false;
  function brancherPlaque() {
    if (plaqueBranchee || !window.Plaque) return;
    plaqueBranchee = true;
    Plaque.brancher({
      champ: $('qrPlaque'), carte: $('qrPlaqueCarte'), statut: $('qrPlaqueSt'), textes: TXT_PLAQUE[LANG],
      onTrouve: v => {
        etat.vehicule = v;
        // Énergie et carrosserie trouvées : on pré-remplit ce que l'on peut.
        const en = String(v.energie || '').toLowerCase();
        const map = { essence: 'essence', gazole: 'diesel', diesel: 'diesel', electri: 'electrique', hybride: 'hybride', gpl: 'gpl' };
        const k = Object.keys(map).find(x => en.includes(x));
        if (k) el.energie.value = map[k];
      },
      onEfface: () => { etat.vehicule = null; },
    });
  }
  const photoIn = $('qrPhoto'), apercu = $('qrPhotoApercu'), retirer = $('qrPhotoRetirer'), ajout = $('qrPhotoAdd');
  photoIn.addEventListener('change', () => {
    const fichier = photoIn.files && photoIn.files[0];
    if (!fichier) return;
    etat.photo = fichier;
    apercu.src = URL.createObjectURL(fichier);
    apercu.alt = Q.photoBtn;
    apercu.hidden = false; retirer.hidden = false; ajout.hidden = true;
    mesurer('photo');
  });
  retirer.addEventListener('click', () => {
    etat.photo = null; photoIn.value = ''; apercu.hidden = true; retirer.hidden = true; ajout.hidden = false; ajout.focus();
  });

  // ── Étape 4 : récapitulatif ────────────────
  const val = (obj, k) => (obj && obj[k]) || '';
  function recap() {
    const dl = $('qrRecap');
    dl.textContent = '';
    const lignes = [
      [Q.lieu, el.adresse.value.trim() || (etat.gps ? `${etat.gps.lat.toFixed(4)}, ${etat.gps.lng.toFixed(4)}` : '—')],
      [Q.panne, [val(D.loc.types, el.type.value), val(D.loc.carbuOpts, el.carbu.value), val(D.loc.clesOpts, el.cles.value)].filter(Boolean).join(' · ')],
      [Q.vehicule, [val(D.loc.categories, el.categorie.value), el.energie.value ? D.loc.energies[el.energie.value] : '', el.plaque.value.trim()].filter(Boolean).join(' · ')],
      [Q.quand, el.quand.value === 'plus-tard' ? `${Q.rdv} ${el.date.value ? new Date(el.date.value + 'T12:00:00').toLocaleDateString(LANG, { weekday: 'long', day: 'numeric', month: 'long' }) : ''}, ${D.loc.creneaux[+el.creneau.value]}` : Q.urgence],
      [Q.destination, [D.loc.dests[el.dest.value], el.destAdresse.value.trim()].filter(Boolean).join(' · ')],
    ];
    lignes.forEach(([k, v]) => { const dt = document.createElement('dt'); dt.textContent = k; const dd = document.createElement('dd'); dd.textContent = v || '—'; dl.append(dt, dd); });
    const e = estimer();
    const bloc = $('qrEstim');
    bloc.hidden = false;
    const ul = $('qrEstimDetail'); ul.textContent = '';
    if (!e) { $('qrEstimV').textContent = Q.surDevis; return; }
    $('qrEstimV').textContent = `${e.des ? Q.des + ' ' : '≈ '}${eur(e.total)}`;
    e.lignes.forEach(([n, v]) => { const li = document.createElement('li'); li.append(n); const b = document.createElement('b'); b.textContent = eur(v); li.append(b); ul.append(li); });
    if (e.km != null) { const li = document.createElement('li'); li.className = 'qr-estim-delai'; li.textContent = `${Q.dist.replace('{km}', e.km)} · ${Q.delai.replace('{d}', delai(e.km))}`; ul.append(li); }
  }

  // ── Envoi ──────────────────────────────────
  const FR = D.fr;
  function message() {
    const tard = el.quand.value === 'plus-tard';
    const e = estimer();
    const oui = v => (v === 'oui' ? 'oui' : v === 'non' ? 'non' : v === 'nsp' ? 'ne sait pas' : '');
    const v = etat.vehicule;
    const j = t => (window.Plaque ? Plaque.joli(t) : t);
    return [
      tard ? '📅 DEMANDE DE RENDEZ-VOUS' : '🚨 DEMANDE DE DÉPANNAGE',
      `Quand : ${tard ? `rendez-vous ${el.date.value ? new Date(el.date.value + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'à convenir'}, ${FR.creneaux[+el.creneau.value]}` : 'maintenant (urgence)'}`,
      '',
      `📍 Lieu : ${el.adresse.value.trim() || '—'}`,
      etat.gps ? `🗺 https://www.google.com/maps?q=${etat.gps.lat.toFixed(5)},${etat.gps.lng.toFixed(5)} (${etat.gps.source}${etat.gps.prec ? ', ± ' + etat.gps.prec + ' m' : ''})` : '🗺 Position GPS : non communiquée',
      etat.gps ? `   ≈ ${kmRoute([etat.gps.lat, etat.gps.lng])} km de l'atelier` : null,
      el.sousSol.checked ? `   Parking souterrain${el.hauteur.value ? ', hauteur max ' + el.hauteur.value + ' m' : ''}` : null,
      el.autoroute.checked ? '   ⚠ Sur autoroute / voie rapide (dépanneur agréé)' : null,
      el.danger.checked ? '   ⚠ Véhicule gênant ou en position dangereuse' : null,
      '',
      `🔧 Panne : ${FR.types[el.type.value] || '—'}`,
      el.type.value === 'carburant' && el.carbu.value ? `   ${FR.carbuOpts[el.carbu.value]}${el.carbu.value === 'erreur' && el.demarre.value ? ' — moteur démarré : ' + oui(el.demarre.value) : ''}` : null,
      el.type.value === 'pneu' && el.roue.value ? `   Roue de secours : ${oui(el.roue.value)}` : null,
      el.type.value === 'cles' && el.cles.value ? `   ${FR.clesOpts[el.cles.value]}` : null,
      el.type.value === 'accident' && el.blesses.value ? `   Blessés : ${oui(el.blesses.value)}` : null,
      el.type.value === 'accident' && el.roule.value ? `   Peut rouler : ${oui(el.roule.value)}` : null,
      `🚗 Véhicule : ${[FR.categories[el.categorie.value], el.energie.value ? FR.energies[el.energie.value] : '', el.boite.checked ? 'boîte auto' : ''].filter(Boolean).join(', ')}`,
      el.plaque.value.trim() ? `   Plaque : ${el.plaque.value.trim()}${v ? ' — ' + [j(v.marque), j(v.modele), v.version].filter(Boolean).join(' ') + (v.annee ? ' (' + v.annee + ')' : '') : ''}` : null,
      el.details.value.trim() ? `📝 Précisions : ${el.details.value.trim()}` : null,
      etat.photo ? '📷 Photo : le client en a une, elle suit sur WhatsApp' : null,
      '',
      `➡ Destination : ${FR.dests[el.dest.value]}${el.destAdresse.value.trim() ? ' — ' + el.destAdresse.value.trim() : ''}`,
      +el.passagers.value ? `👥 Passagers dans la dépanneuse : ${FR.passagersOpts[+el.passagers.value]}` : null,
      el.assistance.value !== 'non' ? `🛡 Assistance : ${FR.assistances[el.assistance.value]}` : null,
      e ? `💶 Estimation affichée : ${e.des ? 'dès ' : '≈ '}${e.total} € TTC` : null,
      '',
      `👤 Prénom : ${el.prenom.value.trim() || '—'}`,
      `📞 Téléphone : ${el.tel.value.trim()}`,
      el.email.value.trim() ? `✉ E-mail : ${el.email.value.trim()}` : null,
      LANG !== 'fr' ? `🌍 Langue du client : ${LANG === 'en' ? 'anglais' : 'italien'}` : null,
    ].filter(x => x !== null).join('\n');
  }

  async function envoyer() {
    const texte = message();
    const tel = el.tel.value.trim();
    const fin = envoye => {
      f.hidden = true; $('qrDone').hidden = false;
      qr.querySelector('.qr-prog').hidden = true;
      $('qrDone').classList.toggle('is-manual', !envoye);
      const wa = $('qrWa');
      wa.hidden = envoye && !etat.photo;
      wa.href = `https://wa.me/${CFG.whatsappNumber || '33617684270'}?text=${encodeURIComponent(envoye ? `Photo pour ma demande de dépannage (${tel})` : texte)}`;
      $('qrDoneTitre').textContent = envoye ? Q.okTitre : Q.waTitre;
      $('qrDoneTxt').textContent = envoye ? Q.okTexte.replace('{tel}', tel) : Q.waTexte;
      // Photo : partage natif (mobile) si possible, sinon consigne.
      const partage = $('qrPhotoShare'), hint = $('qrPhotoHint');
      const peut = !!(etat.photo && navigator.canShare && navigator.canShare({ files: [etat.photo] }));
      partage.hidden = !peut;
      hint.hidden = !etat.photo;
      hint.textContent = peut ? Q.photoShare : Q.photo;
      carteFinale();
      $('qrDoneTitre').focus();
      mesurer(envoye ? 'envoyee' : 'whatsapp');
    };
    if (el.botcheck.checked) return fin(true);
    if (!CFG.formAccessKey) return fin(false);
    nextBtn.disabled = true; nextBtn.textContent = Q.envoi;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), CFG.formTimeoutMs || 8000);
    try {
      const res = await fetch(CFG.formEndpoint, {
        method: 'POST', signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: CFG.formAccessKey, botcheck: false, from_name: 'Dépannage Auto Nice (site)',
          subject: `${el.quand.value === 'plus-tard' ? '📅 Rendez-vous' : '🚨 Dépannage'} — ${FR.types[el.type.value]} — ${tel}`,
          replyto: el.email.value.trim() || undefined, message: texte,
        }),
      });
      fin(res.ok);
    } catch { fin(false); }
    finally { clearTimeout(timer); nextBtn.disabled = false; nextBtn.textContent = nextBtn.dataset.envoyer; }
  }
  $('qrPhotoShare').addEventListener('click', async () => {
    try { await navigator.share({ files: [etat.photo], title: 'Photo de la panne', text: 'Photo de ma panne (demande faite sur le site).' }); mesurer('photo-partagee'); }
    catch (e) { if (e && e.name !== 'AbortError') $('qrPhotoHint').textContent = Q.photo; }
  });

  // Carte finale : atelier → client, trajet routier (OSRM) si disponible.
  async function carteFinale() {
    const zone = $('qrDoneMap'), txt = $('qrDoneDist');
    if (!etat.gps) { zone.hidden = true; txt.hidden = true; return; }
    const km = kmRoute([etat.gps.lat, etat.gps.lng]);
    txt.hidden = false;
    txt.textContent = `${Q.dist.replace('{km}', km)} · ${Q.delai.replace('{d}', delai(km))}`;
    try { await leaflet(); } catch { return; }
    zone.hidden = false;
    zone.textContent = '';
    const client = [etat.gps.lat, etat.gps.lng];
    const m = L.map(zone, { scrollWheelZoom: false, zoomControl: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(m);
    L.marker(client, { icon: L.divIcon({ className: '', html: '<span class="qr-pin"></span>', iconSize: [26, 26], iconAnchor: [13, 13] }) }).addTo(m).bindPopup(Q.position);
    L.marker(D.atelier, { icon: L.divIcon({ className: '', html: '<span class="qr-pin qr-pin-atelier"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }) }).addTo(m).bindPopup(Q.atelier);
    m.fitBounds([D.atelier, client], { padding: [28, 28] });
    setTimeout(() => m.invalidateSize(), 60);
    try {
      const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${D.atelier[1]},${D.atelier[0]};${client[1]},${client[0]}?overview=full&geometries=geojson`);
      const j = await r.json();
      const coords = j.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      L.polyline(coords, { color: '#ffffff', weight: 7, opacity: 0.9 }).addTo(m);
      L.polyline(coords, { color: '#d94e00', weight: 3.5 }).addTo(m);
      const kmR = Math.round(j.routes[0].distance / 1000);
      txt.textContent = `${Q.dist.replace('{km}', kmR)} · ${Q.delai.replace('{d}', delai(kmR))}`;
    } catch {
      L.polyline([D.atelier, client], { color: '#d94e00', weight: 2, dashArray: '6 6' }).addTo(m);
    }
  }

  $('qrAgain').addEventListener('click', () => {
    f.reset(); etat.gps = null; etat.photo = null; etat.vehicule = null;
    gpsBtn.classList.remove('is-ok'); statut('');
    ['qrMap', 'qrMapAide', 'qrDist'].forEach(id => { $(id).hidden = true; });
    apercu.hidden = true; retirer.hidden = true; ajout.hidden = false;
    el.quand.value = 'maintenant'; el.dest.value = 'decider'; majConditions();
    $('qrDone').hidden = true; f.hidden = false; qr.querySelector('.qr-prog').hidden = false;
    aller(1);
  });
})();
