// =============================================
// DÉPANNAGE AUTO NICE — site.js
// Comportements des pages du nouveau design. Tout est facultatif : sans
// JavaScript, le menu mobile reste accessible (liens du pied de page), les
// panneaux restent lisibles et la FAQ utilise <details> natif.
// =============================================

(function () {
  'use strict';

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
        setStatus('Message envoyé. Nous vous rappelons au plus vite.', 'ok');
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
        setStatus('Votre message est prêt dans WhatsApp — appuyez sur Envoyer. Sinon, appelez le 06 17 68 42 70.', 'ok');
        return;
      }

      const label = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours…'; }
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
        setStatus('Message envoyé. Nous vous rappelons au plus vite.', 'ok');
      } catch {
        setStatus("L'envoi a échoué. Appelez-nous au 06 17 68 42 70 ou réessayez.", 'error');
      } finally {
        clearTimeout(timer);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = label; }
      }
    });
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
