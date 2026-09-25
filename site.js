// =============================================
// DÉPANNAGE AUTO NICE — site.js
// Comportements des pages du nouveau design. Tout est facultatif : sans
// JavaScript, le menu mobile reste accessible (liens du pied de page), les
// panneaux restent lisibles et la FAQ utilise <details> natif.
// =============================================

(function () {
  'use strict';

  // Textes affichés par le script, selon la langue de la page.
  const LANG = (document.documentElement.lang || 'fr').slice(0, 2);
  const TXT = {
    fr: { pause: 'Pause', reprendre: 'Reprendre', pauseAria: 'Pause — mettre en pause le défilement des villes', reprendreAria: 'Reprendre — relancer le défilement des villes',
          ok: 'Message envoyé. Nous vous rappelons au plus vite.', envoi: 'Envoi en cours…',
          wa: 'Votre message est prêt dans WhatsApp — appuyez sur Envoyer. Sinon, appelez le 06 17 68 42 70.',
          echec: "L'envoi a échoué. Appelez-nous au 06 17 68 42 70 ou réessayez.",
          rappelOk: 'C\'est noté : un technicien vous rappelle dès que possible.',
          rappelWa: 'Votre demande de rappel est prête dans WhatsApp — appuyez sur Envoyer.',
          rappelTel: 'Indiquez un numéro de téléphone complet.', plus: 'En savoir plus', reduire: 'Réduire' },
    en: { pause: 'Pause', reprendre: 'Resume', pauseAria: 'Pause — stop the rotating town names', reprendreAria: 'Resume — restart the rotating town names',
          ok: 'Message sent. We will call you back as soon as possible.', envoi: 'Sending…',
          wa: 'Your message is ready in WhatsApp — tap Send. Otherwise, call +33 6 17 68 42 70.',
          echec: 'Sending failed. Call us on +33 6 17 68 42 70 or try again.',
          rappelOk: 'Done: a technician will call you back as soon as possible.',
          rappelWa: 'Your call-back request is ready in WhatsApp — tap Send.',
          rappelTel: 'Please enter a full phone number.', plus: 'Learn more', reduire: 'Show less' },
    it: { pause: 'Pausa', reprendre: 'Riprendi', pauseAria: 'Pausa — ferma lo scorrimento delle città', reprendreAria: 'Riprendi — riavvia lo scorrimento delle città',
          ok: 'Messaggio inviato. Vi richiameremo al più presto.', envoi: 'Invio in corso…',
          wa: 'Il messaggio è pronto su WhatsApp — premete Invia. Altrimenti chiamate il +33 6 17 68 42 70.',
          echec: "L'invio non è riuscito. Chiamateci al +33 6 17 68 42 70 o riprovate.",
          rappelOk: 'Fatto: un tecnico vi richiamerà al più presto.',
          rappelWa: 'La richiesta di richiamata è pronta su WhatsApp — premete Invia.',
          rappelTel: 'Inserite un numero di telefono completo.', plus: 'Scopri di più', reduire: 'Riduci' },
  };
  const tx = TXT[LANG] || TXT.fr;
  const TXT_ESTIM = {
    fr: { rem: d => `Remorquage sur ${d} km`, depl: k => `Déplacement (${k} km au-delà de Nice)`, nuit: 'Nuit, dimanche ou férié', sousSol: 'Parking souterrain', util: 'Utilitaire ou camping-car' },
    en: { rem: d => `Towing over ${d} km`, depl: k => `Travel (${k} km beyond Nice)`, nuit: 'Night, Sunday or holiday', sousSol: 'Underground car park', util: 'Van or motorhome' },
    it: { rem: d => `Traino per ${d} km`, depl: k => `Spostamento (${k} km oltre Nizza)`, nuit: 'Notte, domenica o festivo', sousSol: 'Parcheggio sotterraneo', util: 'Furgone o camper' },
  };

  // ── Menu mobile ─────────────────────────────
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  // ── Panneaux « En savoir plus » (accueil) ───
  document.querySelectorAll('[data-toggle]').forEach((btn) => {
    const target = document.getElementById(btn.getAttribute('aria-controls'));
    if (!target) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      target.hidden = !open;
      btn.textContent = open ? tx.reduire : tx.plus;
    });
  });

  // ── Carte Leaflet (page Zone) ───────────────
  const mapEl = document.getElementById('zoneMap');
  if (mapEl && typeof L !== 'undefined') {
    mapEl.textContent = '';
    const centre = [43.7102, 7.2620];
    const map = L.map(mapEl, { center: centre, zoom: 9, scrollWheelZoom: false });
    // Tuiles OpenStreetMap : libres, sans clé. Le crédit est obligatoire
    // (licence ODbL), d'où l'attribution laissée active.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }).addTo(map);
    L.circle(centre, {
      radius: 15000, color: '#ff6b00', fillColor: '#ff6b00', fillOpacity: 0.10, weight: 1.5,
    }).addTo(map);
    L.circle(centre, {
      radius: 45000, color: '#b34800', fillOpacity: 0, weight: 1, dashArray: '6 6',
    }).addTo(map);
    L.marker(centre).addTo(map)
      .bindPopup('<strong>Dépannage Auto Nice</strong><br>Quai de la Blanquière, Nice');
  }

  // ── Formulaire de contact ───────────────────
  // Envoi via le relais configuré dans config.js. Sans relais, bascule sur
  // WhatsApp plutôt que sur un mailto : le domaine depannageautonice.fr n'est
  // pas enregistré, l'adresse de contact ne reçoit rien.
  const form = document.getElementById('contactForm');
  if (form) {
    const cfg = window.SITE_CONFIG || {};
    const statusEl = document.getElementById('contactFormStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    const setStatus = (text, kind) => {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.className = `form-status is-${kind}`;
      statusEl.hidden = !text;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Case piège cochée : c'est un robot. On feint le succès sans rien envoyer.
      if (form.elements.botcheck && form.elements.botcheck.checked) {
        setStatus(tx.ok, 'ok');
        return;
      }
      const name = form.elements.name.value.trim();
      const phone = form.elements.phone.value.trim();
      const message = form.elements.message.value.trim();
      const subject = form.elements.subject ? form.elements.subject.value : 'Message';
      const body = `Sujet : ${subject}\nNom : ${name}\nTéléphone : ${phone}\n\nMessage :\n${message}`;

      if (!cfg.formAccessKey) {
        const numero = cfg.whatsappNumber || '33617684270';
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent('Message depuis le site\n\n' + body)}`, '_blank', 'noopener');
        setStatus(tx.wa, 'ok');
        return;
      }

      const label = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = tx.envoi; }
      setStatus('', 'ok');

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), cfg.formTimeoutMs || 8000);
      try {
        const res = await fetch(cfg.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            access_key: cfg.formAccessKey,
            botcheck: false,
            subject: `${subject} — ${name}`,
            from_name: 'Dépannage Auto Nice (site)',
            message: body,
          }),
        });
        if (!res.ok) throw new Error('relais indisponible');
        form.reset();
        setStatus(tx.ok, 'ok');
      } catch {
        setStatus(tx.echec, 'error');
      } finally {
        clearTimeout(timer);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = label; }
      }
    });
  }

  // ── « On vous rappelle » : prénom + téléphone ──
  // Même relais que le formulaire de contact ; sans relais, le message part
  // par WhatsApp (déjà rédigé) plutôt que de faire croire à un envoi.
  document.querySelectorAll('form[data-rappel]').forEach((f) => {
    const cfg = window.SITE_CONFIG || {};
    const st = f.querySelector('.form-status');
    const btn = f.querySelector('button[type="submit"]');
    const tel = f.elements.tel;
    const dire = (text, kind) => { if (!st) return; st.textContent = text; st.className = `form-status is-${kind}`; st.hidden = !text; };

    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (f.elements.botcheck && f.elements.botcheck.checked) { dire(tx.rappelOk, 'ok'); return; }
      const chiffres = tel.value.replace(/[^\d+]/g, '');
      if (chiffres.replace(/\D/g, '').length < 9) { dire(tx.rappelTel, 'error'); tel.focus(); return; }
      const prenom = (f.elements.prenom.value || '').trim();
      const texte = `Demande de rappel depuis le site\nPrénom : ${prenom || '—'}\nTéléphone : ${tel.value.trim()}\nPage : ${location.pathname}`;
      if (window.mesurer) window.mesurer('rappel');

      if (!cfg.formAccessKey) {
        const numero = cfg.whatsappNumber || '33617684270';
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(`Bonjour, pouvez-vous me rappeler au ${tel.value.trim()} ? ${prenom}`.trim())}`, '_blank', 'noopener');
        dire(tx.rappelWa, 'ok');
        return;
      }
      const label = btn.innerHTML;
      btn.disabled = true; btn.textContent = tx.envoi;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), cfg.formTimeoutMs || 8000);
      try {
        const res = await fetch(cfg.formEndpoint, {
          method: 'POST', signal: ctrl.signal,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: cfg.formAccessKey, botcheck: false, subject: `📞 Rappel — ${tel.value.trim()}`, from_name: 'Dépannage Auto Nice (site)', message: texte }),
        });
        if (!res.ok) throw new Error('relais');
        f.reset();
        dire(tx.rappelOk, 'ok');
      } catch {
        dire(tx.echec, 'error');
      } finally {
        clearTimeout(timer);
        btn.disabled = false; btn.innerHTML = label;
      }
    });
  });

  // ── Estimateur de prix (page Tarifs) ──────
  // Même grille que les tableaux : tools/tarifs.js, injectée dans la page.
  const est = document.querySelector('[data-estim]');
  const dataEl = document.getElementById('tarifsData');
  if (est && dataEl) {
    let D = null;
    try { D = JSON.parse(dataEl.textContent); } catch { D = null; }
    if (D) {
      const E = TXT_ESTIM[LANG] || TXT_ESTIM.fr;
      const c = D.calcul;
      const $ = id => document.getElementById(id);
      const eur = n => (LANG === 'en' ? '€' + n : n + ' €');
      const typeSel = () => est.querySelector('input[name="e-type"]:checked').value;
      const km = $('e-km'), kmVal = $('e-km-val');

      // Nuit, dimanche : pré-coché selon l'heure du visiteur (modifiable).
      const now = new Date();
      if (now.getHours() >= 20 || now.getHours() < 8 || now.getDay() === 0) $('e-nuit').checked = true;
      // ?presta=ouverture ou ?type=remorquage depuis une page service.
      const qs = new URLSearchParams(location.search);
      if (qs.get('presta') && D.presta[qs.get('presta')]) $('e-presta').value = qs.get('presta');
      if (qs.get('type') === 'remorquage') est.querySelector('input[value="remorquage"]').checked = true;

      const calculer = () => {
        const type = typeSel();
        est.querySelectorAll('[data-si]').forEach(el => { el.hidden = el.dataset.si !== type; });
        const lignes = [];
        let total = 0;
        if (type === 'sur-place') {
          const pr = D.presta[$('e-presta').value];
          total = pr.prix; lignes.push([pr.nom + (pr.plus ? ' ' + pr.plus : ''), pr.prix]);
        } else {
          const d = +km.value;
          kmVal.textContent = d + ' km';
          const b = c.bandes.find(([max]) => d <= max);
          const dernier = c.bandes[c.bandes.length - 1];
          total = b ? b[1] : Math.round(dernier[1] + (d - dernier[0]) * c.kmSupp);
          lignes.push([E.rem(d), total]);
        }
        const loin = Math.max(0, +$('e-ville').value - c.baseKm);
        if (loin) { const x = Math.round(loin * c.deplacementKm); total += x; lignes.push([E.depl(loin), x]); }
        if ($('e-nuit').checked) { total += c.nuit; lignes.push([E.nuit, c.nuit]); }
        if ($('e-sous-sol').checked) { total += c.sousSol; lignes.push([E.sousSol, c.sousSol]); }
        if ($('e-util').checked) { total += c.utilitaire; lignes.push([E.util, c.utilitaire]); }
        $('e-total').textContent = total;
        const ul = $('e-detail');
        ul.textContent = '';
        lignes.forEach(([n, v]) => {
          const li = document.createElement('li');
          li.append(n); const b = document.createElement('b'); b.textContent = eur(v); li.append(b);
          ul.append(li);
        });
        const dem = $('e-demande');
        if (dem) dem.setAttribute('href', dem.getAttribute('href').split('?')[0] + (type === 'remorquage' ? '?type=remorquage' : ''));
      };
      est.addEventListener('input', calculer);
      est.addEventListener('change', calculer);
      calculer();
    }
  }

  // ── Demande rapide dans une fenêtre ────────
  // Tous les liens vers demande.html ouvrent le formulaire court sur place.
  // Clic avec Ctrl/Cmd ou clic milieu : comportement normal (nouvel onglet).
  const qr = document.getElementById('qr');
  if (qr && typeof qr.showModal === 'function') {
    const Q = JSON.parse(document.getElementById('qrTxt').textContent);
    const cfg = window.SITE_CONFIG || {};
    const f = document.getElementById('qrForm');
    const done = document.getElementById('qrDone');
    const err = document.getElementById('qrErr');
    const gpsBtn = document.getElementById('qrGps');
    const gpsSt = document.getElementById('qrGpsSt');
    const rdv = document.getElementById('qrRdv');
    const date = document.getElementById('qrDate');
    const LIB = { batterie: 'Batterie / démarrage', pneu: 'Pneu crevé', carburant: 'Carburant', remorquage: 'Remorquage', moteur: 'Surchauffe moteur', cles: 'Clés perdues / porte bloquée', accident: 'Accident', autre: 'Autre besoin' };
    const LANGUE = { en: 'anglais', it: 'italien' };
    let gps = null;
    let dernierDeclencheur = null;

    const jour = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const majQuand = () => {
      const tard = f.elements.quand.value === 'plus-tard';
      rdv.hidden = !tard;
      if (tard && !date.value) { const d = new Date(); date.min = jour(d); d.setDate(d.getDate() + 1); date.value = jour(d); }
    };
    f.addEventListener('change', e => { if (e.target.name === 'quand') majQuand(); if (!err.hidden) err.hidden = true; });

    const ouvrir = (href, declencheur) => {
      const u = new URL(href, location.href);
      const type = u.searchParams.get('type');
      const radio = type && f.querySelector(`input[name="type"][value="${type}"]`);
      if (radio) radio.checked = true;
      if (u.searchParams.get('quand') === 'plus-tard') { f.elements.quand.value = 'plus-tard'; majQuand(); }
      dernierDeclencheur = declencheur;
      qr.showModal();
      // Premier champ utile : le lieu si rien n'est rempli, sinon le téléphone.
      (radio ? document.getElementById(gps || f.elements.adresse.value ? 'qrTel' : 'qrAdresse') : gpsBtn).focus();
      if (window.mesurer) window.mesurer('demande-rapide/ouverture');
    };
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.hasAttribute('data-qr-skip')) return;
      if (!/(^|\/)demande\.html(\?|#|$)/.test(a.getAttribute('href'))) return;
      e.preventDefault();
      ouvrir(a.href, a);
    });
    qr.addEventListener('click', e => {
      // Clic sur le fond (hors du panneau) ou sur un bouton de fermeture.
      if (e.target === qr || e.target.closest('[data-qr-close]')) qr.close();
    });
    qr.addEventListener('close', () => { if (dernierDeclencheur) dernierDeclencheur.focus(); });

    gpsBtn.addEventListener('click', () => {
      if (!navigator.geolocation) { gpsSt.hidden = false; gpsSt.textContent = Q.gpsKo; return; }
      gpsSt.hidden = false; gpsSt.textContent = Q.gpsEnCours;
      navigator.geolocation.getCurrentPosition(async pos => {
        gps = { lat: pos.coords.latitude, lng: pos.coords.longitude, prec: Math.round(pos.coords.accuracy) };
        gpsBtn.classList.add('is-ok');
        gpsSt.textContent = `${Q.gpsOk} (± ${gps.prec} m)`;
        // Adresse lisible, si le champ est vide : OpenStreetMap (Nominatim).
        if (!f.elements.adresse.value) {
          try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&accept-language=fr&lat=${gps.lat}&lon=${gps.lng}`, { headers: { Accept: 'application/json' } });
            const j = await r.json();
            const a = j.address || {};
            const rue = [a.house_number, a.road].filter(Boolean).join(' ');
            const ville = a.city || a.town || a.village || a.municipality || '';
            if (rue || ville) f.elements.adresse.value = [rue, ville].filter(Boolean).join(', ');
          } catch { /* l'adresse reste à saisir, la position GPS suffit */ }
        }
        document.getElementById('qrTel').focus();
      }, () => { gpsSt.textContent = Q.gpsKo; f.elements.adresse.focus(); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });

    const montrer = (msg, champ) => { err.textContent = msg; err.hidden = false; if (champ) champ.focus(); };
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const el = f.elements;
      const tel = el.tel.value.trim();
      if (!gps && !el.adresse.value.trim()) return montrer(Q.errLieu, el.adresse);
      if (!el.type.value) return montrer(Q.errType, f.querySelector('input[name="type"]'));
      if (tel.replace(/\D/g, '').length < 9) return montrer(Q.errTel, el.tel);
      err.hidden = true;

      const tard = el.quand.value === 'plus-tard';
      const quand = tard ? `Rendez-vous : ${el.date.value ? new Date(el.date.value + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'à convenir'}, ${el.creneau.value}` : 'Maintenant (urgence)';
      const estim = document.getElementById('e-total');
      const lignes = [
        tard ? '📅 DEMANDE DE RENDEZ-VOUS' : '🚨 DEMANDE DE DÉPANNAGE',
        `Quand : ${quand}`,
        `Panne : ${LIB[el.type.value] || el.type.value}`,
        `Lieu : ${el.adresse.value.trim() || '—'}`,
        gps ? `GPS : https://www.google.com/maps?q=${gps.lat.toFixed(5)},${gps.lng.toFixed(5)} (± ${gps.prec} m)` : 'GPS : non communiqué',
        el.details.value.trim() ? `Précisions : ${el.details.value.trim()}` : null,
        estim ? `Estimation vue sur le site : ${estim.textContent} €` : null,
        `Prénom : ${el.prenom.value.trim() || '—'}`,
        `Téléphone : ${tel}`,
        LANGUE[LANG] ? `Langue du client : ${LANGUE[LANG]}` : null,
        `Page : ${location.pathname.split('/').pop() || 'accueil'}`,
      ].filter(Boolean);
      const texte = lignes.join('\n');

      const fin = (envoye) => {
        f.hidden = true; done.hidden = false;
        done.classList.toggle('is-manual', !envoye);
        const wa = document.getElementById('qrWa');
        wa.hidden = envoye;
        wa.href = `https://wa.me/${cfg.whatsappNumber || '33617684270'}?text=${encodeURIComponent(texte)}`;
        document.getElementById('qrDoneTitre').textContent = envoye ? Q.okTitre : Q.waTitre;
        document.getElementById('qrDoneTxt').textContent = envoye ? Q.okTexte.replace('{tel}', tel) : Q.waTexte;
        document.getElementById('qrDoneTitre').focus();
        if (window.mesurer) window.mesurer(`demande-rapide/${envoye ? 'envoyee' : 'whatsapp'}`);
      };
      if (el.botcheck.checked) return fin(true);
      if (!cfg.formAccessKey) return fin(false);

      const btn = f.querySelector('.qr-send');
      const label = btn.innerHTML;
      btn.disabled = true; btn.textContent = Q.envoi;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), cfg.formTimeoutMs || 8000);
      try {
        const res = await fetch(cfg.formEndpoint, {
          method: 'POST', signal: ctrl.signal,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: cfg.formAccessKey, botcheck: false, subject: `${tard ? '📅 Rendez-vous' : '🚨 Dépannage'} — ${LIB[el.type.value]} — ${tel}`, from_name: 'Dépannage Auto Nice (site)', message: texte }),
        });
        fin(res.ok);
      } catch { fin(false); }
      finally { clearTimeout(timer); btn.disabled = false; btn.innerHTML = label; }
    });
    document.getElementById('qrAgain').addEventListener('click', () => {
      f.reset(); gps = null; gpsBtn.classList.remove('is-ok'); gpsSt.hidden = true; rdv.hidden = true;
      done.hidden = true; f.hidden = false; gpsBtn.focus();
    });
  }

  // ── Titre de l'accueil : une ville toutes les 3 secondes ──
  // Chaque ville garde son propre délai. ?ville=grasse (annonce, QR code,
  // lien envoyé) fixe le titre sur cette ville. Pas de défilement si
  // l'utilisateur a demandé moins d'animations ; bouton Pause (WCAG 2.2.2).
  const h1 = document.querySelector('h1[data-villes]');
  if (h1) {
    let liste = [];
    try { liste = JSON.parse(h1.dataset.villes); } catch { liste = []; }
    const vEl = h1.querySelector('.h-ville');
    const dEl = h1.querySelector('.h-delai');
    const joli = d => d.replace(/ (min|h|minutes|minuti)\b/g, '\u00a0$1');
    // Texte découpé pour l'animation : chaque mot (et chaque morceau de
    // nom composé, « Saint-/Laurent-/du-/Var ») reste insécable, chaque
    // lettre s'anime avec un léger décalage. Le texte complet reste lisible
    // par les lecteurs d'écran (span sr-only), les lettres sont masquées.
    let lettre = 0;
    const decouper = (el, texte) => {
      el.textContent = '';
      const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = texte;
      const vis = document.createElement('span'); vis.className = 'fx'; vis.setAttribute('aria-hidden', 'true');
      lettre = 0;
      texte.split(/(\s+)/).forEach(mot => {
        if (/^\s+$/.test(mot)) { vis.append(mot.includes('\u00a0') ? '\u00a0' : ' '); return; }
        mot.split(/(?<=-)/).forEach((morceau, k) => {
          if (k) vis.append(document.createElement('wbr'));
          const w = document.createElement('span'); w.className = 'fx-w';
          [...morceau].forEach(ch => { const l = document.createElement('span'); l.className = 'fx-l'; l.style.setProperty('--i', lettre++); l.textContent = ch; w.append(l); });
          vis.append(w);
        });
      });
      el.append(sr, vis);
    };
    const poser = (c) => { decouper(vEl, c.v); decouper(dEl, joli(c.d)); };
    const voulue = new URLSearchParams(location.search).get('ville');
    const fixe = liste.find(c => c.s === (voulue || '').toLowerCase());

    if (fixe) {
      poser(fixe);
    } else if (liste.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Hauteur réservée à la variante la plus longue : sinon le texte et
      // les boutons sautent à chaque changement, sous le doigt du visiteur.
      const reserver = () => {
        h1.style.minHeight = '';
        let max = 0;
        liste.forEach(c => { poser(c); max = Math.max(max, h1.offsetHeight); });
        poser(liste[i]);
        h1.style.minHeight = max + 'px';
      };
      let i = 0, pause = false, survol = false, t;
      reserver();
      let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(reserver, 150); });

      // « After effect » : les lettres de l'ancienne ville sortent vers le
      // haut en se floutant, les nouvelles entrent une à une par le bas,
      // puis un trait orange balaie le nom (classes fx-out / fx-in, site.css).
      const suivant = () => {
        if (pause || survol || document.hidden) return;
        const n = Math.max(vEl.querySelectorAll('.fx-l').length, 1);
        h1.classList.remove('fx-in');
        h1.classList.add('fx-out');
        setTimeout(() => {
          i = (i + 1) % liste.length;
          poser(liste[i]);
          h1.classList.remove('fx-out');
          void h1.offsetWidth; // relance l'animation d'entrée
          h1.classList.add('fx-in');
        }, 240 + Math.min(n, 20) * 14);
      };
      t = setInterval(suivant, 3000);

      const heroEl = h1.closest('.hero');
      heroEl.addEventListener('mouseenter', () => { survol = true; });
      heroEl.addEventListener('mouseleave', () => { survol = false; });
      heroEl.addEventListener('focusin', () => { survol = true; });
      heroEl.addEventListener('focusout', () => { survol = false; });

      const btn = document.querySelector('.rot-pause');
      if (btn) {
        btn.hidden = false;
        btn.addEventListener('click', () => {
          pause = !pause;
          btn.setAttribute('aria-pressed', String(pause));
          btn.textContent = pause ? tx.reprendre : tx.pause;
          btn.setAttribute('aria-label', pause ? tx.reprendreAria : tx.pauseAria);
        });
      }
    }
  }

  // ── Photos 2 et 3 du hero, chargées après l'affichage ──
  const hero = document.querySelector('.hero');
  if (hero && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const go = () => hero.classList.add('ready');
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
  }

  // ── Année du pied de page ───────────────────
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
