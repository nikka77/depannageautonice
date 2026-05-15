// =============================================
// DEPANNAGERAUTONICE.FR — script.js
// GSAP 3.15 + Lenis 1.0 + ScrollTrigger
// Défensif : chaque librairie CDN testée avant usage
// =============================================

// ── Références DOM (nécessaires partout) ────
const header    = document.getElementById('header');
const urgencyH  = () => { const b = document.getElementById('urgency-bar'); return b ? b.offsetHeight : 0; };
const headerH   = () => header ? header.offsetHeight : 0;
const progressBar = document.getElementById('progressBar');
const backToTop   = document.getElementById('backToTop');
const navLinks    = document.querySelectorAll('#nav a[data-section]');
const sections    = [...navLinks].map(a => document.getElementById(a.dataset.section)).filter(Boolean);

// ── Lenis smooth scroll (si disponible) ────
if (typeof Lenis !== 'undefined') {
  window._lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  function rafLoop(time) { window._lenis.raf(time); requestAnimationFrame(rafLoop); }
  requestAnimationFrame(rafLoop);

  // Connecter Lenis à GSAP ScrollTrigger si les deux sont dispo
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    window._lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => window._lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Scroll vers ancres via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window._lenis.scrollTo(target, { offset: -(headerH() + urgencyH()) });
      document.getElementById('nav')?.classList.remove('open');
    });
  });

  window._lenis.on('scroll', onScroll);

  if (backToTop) {
    backToTop.addEventListener('click', () => window._lenis.scrollTo(0));
  }

} else {
  // Fallback : scroll natif si Lenis absent
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerH() - urgencyH();
      window.scrollTo({ top, behavior: 'smooth' });
      document.getElementById('nav')?.classList.remove('open');
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

// ── Scroll events (progress + header + nav active + back-to-top) ──
// Throttled via requestAnimationFrame pour limiter les repaints DOM
let _scrollScheduled = false;
function onScroll() {
  if (_scrollScheduled) return;
  _scrollScheduled = true;
  requestAnimationFrame(() => {
    _scrollScheduled = false;
    const scrollY   = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) progressBar.style.width = maxScroll > 0 ? (scrollY / maxScroll * 100) + '%' : '0%';
    if (header) header.classList.toggle('scrolled', scrollY > 30);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 400);

    const offset = headerH() + urgencyH() + 80;
    let current = '';
    sections.forEach(sec => { if (scrollY >= sec.offsetTop - offset) current = sec.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  });
}

onScroll(); // init

// ── Hamburger menu ─────────────────────────
const hamburgerBtn = document.getElementById('hamburger');
const navMenu      = document.getElementById('nav');
if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener('click', () => navMenu.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });
}

// ── GSAP animations (si disponible) ────────
if (typeof gsap !== 'undefined') {
  if (typeof ScrollTrigger !== 'undefined' && typeof Lenis === 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero reveal
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-hud-tag',    { opacity: 0, y: -20, duration: 0.6 })
    .from('#hero h1',          { opacity: 0, y: 40,  duration: 0.8 }, '-=0.2')
    .from('.hero-sub',         { opacity: 0, y: 30,  duration: 0.7 }, '-=0.5')
    .from('.btn-hero',         { opacity: 0, y: 20,  scale: 0.95, duration: 0.6 }, '-=0.4')
    .from('.hero-badges span', { opacity: 0, y: 15,  duration: 0.5, stagger: 0.1 }, '-=0.3');

  // Service cards
  gsap.from('.service-card', {
    scrollTrigger: { trigger: '#services', start: 'top 75%' },
    opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: 'power3.out',
  });

  // Step cards
  gsap.from('.step-card', {
    scrollTrigger: { trigger: '#comment-ca-marche', start: 'top 75%' },
    opacity: 0, y: 40, duration: 0.7, stagger: 0.15, ease: 'power3.out',
  });

  // Tarif cards
  gsap.from('.tarif-card', {
    scrollTrigger: { trigger: '#tarifs', start: 'top 75%' },
    opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: 'power3.out',
  });

  // Compteur stats via GSAP
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const obj    = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString('fr-FR'); },
        });
      },
    });
  });

} else {
  // Fallback : compteur vanilla si GSAP absent
  // Nettoie un timer existant pour éviter les race conditions si rappelé sur le même élément
  function animateCounter(el, target, duration = 1800) {
    if (el._counterTimer) clearInterval(el._counterTimer);
    let start = 0;
    const step = target / (duration / 16);
    el._counterTimer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start).toLocaleString('fr-FR');
      if (start >= target) {
        clearInterval(el._counterTimer);
        delete el._counterTimer;
      }
    }, 16);
  }
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.target, 10));
        statObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number[data-target]').forEach(el => statObs.observe(el));
}

// ── Bouton "Appel direct" — révèle le numéro puis devient cliquable directement ──
const revealBtn = document.getElementById('revealPhoneBtn');
if (revealBtn) {
  revealBtn.addEventListener('click', function () {
    if (this.dataset.revealed) {
      window.location.href = 'tel:0617684270';
      return;
    }
    this.dataset.revealed = '1';
    const textEl = document.getElementById('revealPhoneText');
    if (textEl) textEl.textContent = '06 17 68 42 70';
    this.classList.add('revealed');
    this.setAttribute('aria-label', 'Appeler le 06 17 68 42 70');
  });
}

// ── Duplication ticker + marquee pour la boucle d'animation ──
// Évite la duplication du HTML source : le contenu n'est écrit qu'une fois,
// puis cloné via JS pour permettre l'animation `translate3d(-50%, 0, 0)`.
(function cloneLoops() {
  document.querySelectorAll('.ticker-track, .marquee-track').forEach(track => {
    const children = Array.from(track.children);
    children.forEach(child => track.appendChild(child.cloneNode(true)));
  });
})();

// ── FAQ Accordion ──────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;
    document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.classList.remove('open');
      }
    });
    btn.setAttribute('aria-expanded', String(!isOpen));
    answer.classList.toggle('open', !isOpen);
  });
});

// ── Carte Leaflet — Zone d'intervention ────
(function initLeaflet() {
  const mapEl = document.getElementById('zoneMap');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('zoneMap', {
    center: [43.7102, 7.2620], zoom: 10,
    scrollWheelZoom: false, zoomControl: true, attributionControl: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CARTO', subdomains: 'abcd', maxZoom: 18,
  }).addTo(map);

  L.circle([43.7102, 7.2620], {
    radius: 30000, color: '#ff6b00', fillColor: '#ff6b00', fillOpacity: 0.07, weight: 1.5,
  }).addTo(map);

  const pulseIcon = L.divIcon({
    className: '',
    html: '<div class="leaflet-marker-pulse"></div>',
    iconSize: [18, 18], iconAnchor: [9, 9],
  });

  L.marker([43.7102, 7.2620], { icon: pulseIcon })
    .addTo(map)
    .bindPopup(
      '<strong style="font-family:\'JetBrains Mono\',monospace;color:#ff6b00">DÉPANNAGE AUTO NICE</strong>' +
      '<br><span style="font-size:0.78rem">Quai de la Blanquière, Nice</span>'
    );
})();

// ── Formulaire → mailto ────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    const body    = `Nom: ${name}\nTéléphone: ${phone}\n\nMessage:\n${message}`;
    window.location.href = `mailto:contact@depannagerautonice.fr?subject=Demande%20de%20dépannage&body=${encodeURIComponent(body)}`;
  });
}
