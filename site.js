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
          wa: 'Votre message est prêt. Envoyez-le par WhatsApp ou par SMS, ou appelez le 06 17 68 42 70.',
          echec: "L'envoi a échoué. Appelez-nous au 06 17 68 42 70 ou réessayez.",
          rappelOk: 'C\'est noté : un technicien vous rappelle dès que possible.',
          rappelWa: 'Votre demande de rappel est prête. Envoyez-la par WhatsApp ou par SMS :', sms: 'SMS',
          rappelTel: 'Indiquez un numéro de téléphone complet.', plus: 'En savoir plus', reduire: 'Réduire' },
    en: { pause: 'Pause', reprendre: 'Resume', pauseAria: 'Pause — stop the rotating town names', reprendreAria: 'Resume — restart the rotating town names',
          ok: 'Message sent. We will call you back as soon as possible.', envoi: 'Sending…',
          wa: 'Your message is ready. Send it by WhatsApp or text message, or call +33 6 17 68 42 70.',
          echec: 'Sending failed. Call us on +33 6 17 68 42 70 or try again.',
          rappelOk: 'Done: a technician will call you back as soon as possible.',
          rappelWa: 'Your call-back request is ready. Send it by WhatsApp or text message:', sms: 'Text message',
          rappelTel: 'Please enter a full phone number.', plus: 'Learn more', reduire: 'Show less' },
    it: { pause: 'Pausa', reprendre: 'Riprendi', pauseAria: 'Pausa — ferma lo scorrimento delle città', reprendreAria: 'Riprendi — riavvia lo scorrimento delle città',
          ok: 'Messaggio inviato. Vi richiameremo al più presto.', envoi: 'Invio in corso…',
          wa: 'Il messaggio è pronto. Inviatelo su WhatsApp o via SMS, oppure chiamate il +33 6 17 68 42 70.',
          echec: "L'invio non è riuscito. Chiamateci al +33 6 17 68 42 70 o riprovate.",
          rappelOk: 'Fatto: un tecnico vi richiamerà al più presto.',
          rappelWa: 'La richiesta di richiamata è pronta. Inviatela su WhatsApp o via SMS:', sms: 'SMS',
          rappelTel: 'Inserite un numero di telefono completo.', plus: 'Scopri di più', reduire: 'Riduci' },
  };
  const tx = TXT[LANG] || TXT.fr;

  // ── Envoi manuel : WhatsApp ou SMS ────────
  // Sans relais d'e-mail (config.formAccessKey vide), le message déjà rédigé
  // part depuis le téléphone du client, par WhatsApp ou par SMS. Le SMS
  // s'ouvre avec le texte pré-rempli : « sms:numéro?body= » (Android) ou
  // « &body= » (iPhone). Les émojis sont retirés : ils font passer un SMS en
  // encodage Unicode et le découpent en plusieurs messages.
  const CFG = window.SITE_CONFIG || {};
  const estIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const lienWa = texte => `https://wa.me/${CFG.whatsappNumber || '33617684270'}?text=${encodeURIComponent(texte)}`;
  const lienSms = texte => {
    const corps = texte.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]\uFE0F?\s?/gu, '').replace(/\uFE0F/g, '');
    return `sms:${CFG.phoneHref || '+33617684270'}${estIOS ? '&' : '?'}body=${encodeURIComponent(corps)}`;
  };
  window.lienSms = lienSms;
  // Affiche le texte et les deux boutons d'envoi dans la zone d'état.
  const choixEnvoi = (zone, intro, texte) => {
    zone.textContent = '';
    zone.className = 'form-status is-ok';
    const p = document.createElement('span'); p.textContent = intro;
    const act = document.createElement('span'); act.className = 'envoi-choix';
    [[lienWa(texte), 'btn-wa', 'WhatsApp'], [lienSms(texte), 'btn-sms', tx.sms]].forEach(([href, cls, nom]) => {
      const a = document.createElement('a');
      a.href = href; a.className = `btn btn-sm ${cls}`; a.textContent = nom;
      if (cls === 'btn-wa') { a.target = '_blank'; a.rel = 'noopener'; }
      a.addEventListener('click', () => { if (window.mesurer) window.mesurer(cls === 'btn-wa' ? 'whatsapp' : 'sms'); });
      act.append(a);
    });
    zone.append(p, act);
    zone.hidden = false;
  };
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
    // contact.html?sujet=pro (page Professionnels) : sujet présélectionné.
    const sujet = new URLSearchParams(location.search).get('sujet');
    const opt = sujet && form.querySelector(`option[data-sujet="${CSS.escape(sujet)}"]`);
    if (opt) opt.selected = true;

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
        if (statusEl) choixEnvoi(statusEl, tx.wa, 'Message depuis le site\n\n' + body);
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
        if (st) choixEnvoi(st, tx.rappelWa, `Bonjour, pouvez-vous me rappeler au ${tel.value.trim()} ? ${prenom}`.trim());
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

  // ── Formulaires de la page Professionnels ──
  // data-pro="chauffeur" : demande de dépannage d'un véhicule d'entreprise
  // (entreprise + plaque + lieu), sans paiement par le chauffeur.
  // data-pro="compte" : demande d'ouverture de compte professionnel.
  // Le message reprend chaque champ rempli avec son libellé (data-l). Même
  // relais que le contact ; sans relais, envoi par WhatsApp ou SMS.
  const PRO = {
    chauffeur: {
      titre: '🚚 Dépannage véhicule pro',
      sujet: el => `🚚 Pro — ${el.entreprise.value.trim()} — ${el.plaque.value.trim()}`,
      note: 'Facturation à l\'entreprise (compte pro à vérifier).',
      ok: 'Demande envoyée. Nous vérifions le compte de l\'entreprise et vous rappelons tout de suite.',
      wa: 'Votre demande est prête. Envoyez-la par WhatsApp ou par SMS :',
    },
    compte: {
      titre: '🏢 Demande de compte pro',
      sujet: el => `🏢 Compte pro — ${el.societe.value.trim()}`,
      note: '',
      ok: 'Demande envoyée. Nous revenons vers vous avec une proposition écrite.',
      wa: 'Votre demande est prête. Envoyez-la par WhatsApp ou par SMS :',
    },
  };
  document.querySelectorAll('form[data-pro]').forEach((f) => {
    const P = PRO[f.dataset.pro];
    if (!P) return;
    const cfg = window.SITE_CONFIG || {};
    const st = f.querySelector('.form-status');
    const btn = f.querySelector('button[type="submit"]');
    const dire = (text, kind) => { st.textContent = text; st.className = `form-status is-${kind}`; st.hidden = !text; };
    const champs = () => [...f.querySelectorAll('[data-l]')];

    if (f.elements.plaque) {
      f.elements.plaque.addEventListener('blur', (e) => { e.target.value = e.target.value.toUpperCase().trim(); });
    }

    // « Utiliser ma position » : coordonnées et lien carte dans le champ lieu.
    f.querySelectorAll('[data-gps]').forEach((b) => {
      const cible = document.getElementById(b.dataset.gps);
      if (!navigator.geolocation || !cible) { b.hidden = true; return; }
      const label = b.innerHTML;
      b.addEventListener('click', () => {
        b.disabled = true; b.textContent = 'Localisation…';
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude: la, longitude: lo } = pos.coords;
          cible.value = `GPS ${la.toFixed(5)}, ${lo.toFixed(5)} — https://maps.google.com/?q=${la.toFixed(5)},${lo.toFixed(5)}`;
          b.disabled = false; b.innerHTML = label;
        }, () => {
          b.disabled = false; b.innerHTML = label;
          dire('Position indisponible : indiquez l\'adresse ou un repère.', 'error');
          cible.focus();
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
      });
    });

    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (f.elements.botcheck && f.elements.botcheck.checked) { dire(P.ok, 'ok'); return; }
      const manquant = champs().find(c => c.required && !c.value.trim());
      if (manquant) {
        const lab = f.querySelector(`label[for="${manquant.id}"]`);
        dire(`Merci de remplir : ${lab ? lab.textContent.replace(/\s+/g, ' ').trim() : manquant.name}.`, 'error');
        manquant.focus(); return;
      }
      const tel = f.elements.tel;
      if (tel.value.replace(/\D/g, '').length < 9) { dire(tx.rappelTel, 'error'); tel.focus(); return; }
      if (f.elements.email && f.elements.email.value && !f.elements.email.checkValidity()) {
        dire('Indiquez une adresse e-mail valide.', 'error'); f.elements.email.focus(); return;
      }

      const lignes = champs().filter(c => c.value.trim()).map(c => `${c.dataset.l} : ${c.value.trim()}`);
      const texte = [P.titre, ...lignes, P.note].filter(Boolean).join('\n');
      if (window.mesurer) window.mesurer('pro/' + f.dataset.pro);

      if (!cfg.formAccessKey) { choixEnvoi(st, P.wa, texte); return; }
      const label = btn.innerHTML;
      btn.disabled = true; btn.textContent = tx.envoi;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), cfg.formTimeoutMs || 8000);
      try {
        const res = await fetch(cfg.formEndpoint, {
          method: 'POST', signal: ctrl.signal,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: cfg.formAccessKey, botcheck: false, subject: P.sujet(f.elements),
            from_name: 'Dépannage Auto Nice (site)', message: texte,
            ...(f.elements.email && f.elements.email.value ? { replyto: f.elements.email.value.trim() } : {}),
          }),
        });
        if (!res.ok) throw new Error('relais');
        f.reset();
        dire(P.ok, 'ok');
      } catch {
        // Le relais a échoué : on ne perd pas la demande, elle part par WhatsApp ou SMS.
        choixEnvoi(st, tx.echec + ' ' + P.wa, texte);
        st.className = 'form-status is-error';
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

  // ── Apparition légère au défilement ─────────
  // Seuls les blocs encore sous la ligne de flottaison au chargement sont
  // concernés : rien ne clignote en haut de page. Sans JavaScript, ou avec
  // « réduire les animations », tout reste affiché normalement.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const SEL = 'main .sec-t, main .sec-sub, .fact, .steps > li, .panels, .grid, .callback, .promo, .band, .chips, .split > *, .faq, .prix';
    const cascade = '.fact, .steps > li, .split > *';
    const bas = window.innerHeight * 0.92;
    const vu = new IntersectionObserver((entrees) => entrees.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-vu');
      vu.unobserve(e.target);
    }), { rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll(SEL).forEach((n) => {
      if (n.closest('.hero, dialog') || n.getBoundingClientRect().top < bas) return;
      if (n.matches(cascade)) {
        const i = [...n.parentElement.children].indexOf(n);
        if (i > 0) n.style.setProperty('--rv-d', `${Math.min(i, 5) * 80}ms`);
      }
      if (n.matches('.grid, .panels')) {
        [...n.children].forEach((c, i) => c.style.setProperty('--rv-i', `${Math.min(i, 8) * 70}ms`));
      }
      n.classList.add('rv');
      vu.observe(n);
    });
  }

  // ── Année du pied de page ───────────────────
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
