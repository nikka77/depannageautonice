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
          rappelTel: 'Indiquez un numéro de téléphone complet.' },
    en: { pause: 'Pause', reprendre: 'Resume', pauseAria: 'Pause — stop the rotating town names', reprendreAria: 'Resume — restart the rotating town names',
          ok: 'Message sent. We will call you back as soon as possible.', envoi: 'Sending…',
          wa: 'Your message is ready in WhatsApp — tap Send. Otherwise, call +33 6 17 68 42 70.',
          echec: 'Sending failed. Call us on +33 6 17 68 42 70 or try again.',
          rappelOk: 'Done: a technician will call you back as soon as possible.',
          rappelWa: 'Your call-back request is ready in WhatsApp — tap Send.',
          rappelTel: 'Please enter a full phone number.' },
    it: { pause: 'Pausa', reprendre: 'Riprendi', pauseAria: 'Pausa — ferma lo scorrimento delle città', reprendreAria: 'Riprendi — riavvia lo scorrimento delle città',
          ok: 'Messaggio inviato. Vi richiameremo al più presto.', envoi: 'Invio in corso…',
          wa: 'Il messaggio è pronto su WhatsApp — premete Invia. Altrimenti chiamate il +33 6 17 68 42 70.',
          echec: "L'invio non è riuscito. Chiamateci al +33 6 17 68 42 70 o riprovate.",
          rappelOk: 'Fatto: un tecnico vi richiamerà al più presto.',
          rappelWa: 'La richiesta di richiamata è pronta su WhatsApp — premete Invia.',
          rappelTel: 'Inserite un numero di telefono completo.' },
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
      btn.textContent = open ? 'Réduire' : 'En savoir plus';
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
    const poser = (c) => { vEl.textContent = c.v; dEl.textContent = c.d.replace(/ (min|h|minutes|minuti)\b/g, '\u00a0$1'); };
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

      const suivant = () => {
        if (pause || survol || document.hidden) return;
        h1.classList.add('swap');
        setTimeout(() => { i = (i + 1) % liste.length; poser(liste[i]); h1.classList.remove('swap'); }, 180);
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
