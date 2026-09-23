#!/usr/bin/env node
// =============================================
// Génère les pages locales (ville-<slug>.html) et met à jour sitemap.xml
// à partir de tools/villes.json.
//
//   node tools/build-villes.js
//
// Le contenu de chaque page vient du JSON : pour modifier un texte,
// éditer villes.json puis relancer le script. Ne jamais éditer les
// fichiers ville-*.html à la main, ils sont écrasés.
// =============================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'villes.json'), 'utf8'));
const { site, villes } = data;

const esc = s => String(s).replace(/&(?!(amp|lt|gt|quot|#\d+|nbsp);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Pour le JSON-LD : pas de HTML, donc on retire les entités et le balisage.
const plain = s => String(s).replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23111'/%3E%3Cpath fill='%23ff6b00' d='M18 28c4-7 11-11 18-9l5-3-3 9c2 5 1 11-3 15s-10 5-15 3l-5 3 3-9-2-2-1 1-2-2 1-1c1-2 2-3 4-5z'/%3E%3C/svg%3E";

function page(v) {
  const url = `${site.base}/ville-${v.slug}.html`;
  const titre = `Dépannage auto ${v.nom} — 7j/7 24h/24 | ${site.tel}`;
  const desc = `Dépannage et remorquage auto à ${v.nom} (${v.cp}), 7j/7 24h/24. Intervention en ${v.delai} depuis Nice. Toutes assurances. Appelez le ${site.tel}.`;

  const autres = villes.filter(o => o.slug !== v.slug);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: `Dépannage auto à ${v.nom}`,
        serviceType: 'Dépannage automobile, remorquage et transport de véhicule',
        description: plain(desc),
        provider: { '@id': `${site.base}/#business` },
        areaServed: {
          '@type': 'City',
          name: v.nom,
          address: { '@type': 'PostalAddress', addressLocality: v.nom, postalCode: v.cp, addressRegion: 'Alpes-Maritimes', addressCountry: 'FR' },
          geo: { '@type': 'GeoCoordinates', latitude: v.lat, longitude: v.lng },
        },
        availableChannel: {
          '@type': 'ServiceChannel',
          servicePhone: { '@type': 'ContactPoint', telephone: site.telIntl, contactType: 'emergency' },
          serviceUrl: `${site.base}/demande.html`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.base}/` },
          { '@type': 'ListItem', position: 2, name: `Dépannage ${v.nom}`, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: v.faq.map(f => ({
          '@type': 'Question',
          name: plain(f.q),
          acceptedAnswer: { '@type': 'Answer', text: plain(f.r) },
        })),
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(titre)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(titre)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:image" content="${site.base}/img/og-cover.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(titre)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${site.base}/img/og-cover.jpg">
  <meta name="geo.region" content="FR-06">
  <meta name="geo.placename" content="${esc(v.nom)}">
  <meta name="geo.position" content="${v.lat};${v.lng}">
  <link rel="icon" type="image/svg+xml" href="${FAVICON}">
  <meta name="theme-color" content="#ff6b00">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="ville.css">
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body>

  <header class="v-top">
    <a class="v-top-logo" href="index.html">← Dépannage<strong>Auto</strong>Nice</a>
    <a class="v-top-tel" href="tel:${site.telHref}">${site.tel}</a>
  </header>

  <nav class="v-crumb" aria-label="Fil d'Ariane">
    <a href="index.html">Accueil</a>
    <span aria-hidden="true">/</span>
    <span aria-current="page">Dépannage ${esc(v.nom)}</span>
  </nav>

  <main>
    <section class="v-hero">
      <span class="v-badge">◆ ${esc(v.nom)} ${esc(v.cp)} — 7J/7 24H/24</span>
      <h1>Dépannage auto à ${esc(v.nom)}</h1>
      <p class="v-lead">${v.intro}</p>
      <div class="v-cta">
        <a class="v-btn v-btn-call" href="tel:${site.telHref}">Appeler le ${site.tel}</a>
        <a class="v-btn v-btn-ghost" href="demande.html">Demander en ligne</a>
      </div>
      <dl class="v-facts">
        <div><dt>Distance depuis notre atelier</dt><dd>${v.distanceKm} km</dd></div>
        <div><dt>Délai d'intervention estimé</dt><dd>${esc(v.delai)}</dd></div>
        <div><dt>Accès</dt><dd>${esc(v.acces)}</dd></div>
      </dl>
      <p class="v-honest">Nos camions partent de ${esc(site.depart)}. Le délai annoncé est une estimation liée au trafic, pas une garantie&nbsp;: nous vous donnons une fourchette réaliste au téléphone.</p>
    </section>

    <section class="v-section">
      <h2>Ce que nous voyons le plus souvent à ${esc(v.nom)}</h2>
      <div class="v-cards">
        ${v.specificites.map(s => `<article class="v-card">
          <h3>${esc(s.titre)}</h3>
          <p>${s.texte}</p>
        </article>`).join('\n        ')}
      </div>
    </section>

    <section class="v-section">
      <h2>Nos interventions</h2>
      <ul class="v-services">
        <li><strong>Remorquage</strong><span>Véhicule non roulant, accident, immobilisation</span></li>
        <li><strong>Batterie et démarrage</strong><span>Test, redémarrage, remplacement sur place</span></li>
        <li><strong>Pneu crevé</strong><span>Roue de secours, kit anti-crevaison, remorquage</span></li>
        <li><strong>Erreur de carburant</strong><span>Vidange du réservoir avant démarrage</span></li>
        <li><strong>Surchauffe moteur</strong><span>Diagnostic sur place, remorquage si nécessaire</span></li>
        <li><strong>Clés enfermées</strong><span>Ouverture sans dégât quand c'est possible</span></li>
      </ul>
    </section>

    <section class="v-section">
      <h2>Quartiers desservis à ${esc(v.nom)}</h2>
      <ul class="v-quartiers">
        ${v.quartiers.map(q => `<li>${esc(q)}</li>`).join('\n        ')}
      </ul>
      <p class="v-note">Cette liste n'est pas limitative&nbsp;: nous intervenons sur l'ensemble de la commune et des communes voisines.</p>
    </section>

    <section class="v-section">
      <h2>Tarifs</h2>
      <p>Notre tarif de base est de <strong>70 €</strong> pour Nice et ses environs immédiats. ${v.distanceKm > 20 ? `${esc(v.nom)} étant à ${v.distanceKm} km, un supplément de distance s'applique&nbsp;:` : 'Pour ' + esc(v.nom) + ', le tarif reste proche de ce montant&nbsp;:'} le prix exact vous est annoncé au téléphone <strong>avant</strong> tout déplacement, et c'est celui qui sera facturé. Aucun supplément à l'arrivée.</p>
      <p>Nous travaillons avec toutes les compagnies d'assurance auto&nbsp;: la prise en charge directe est souvent possible, demandez-nous.</p>
    </section>

    <section class="v-section">
      <h2>Questions fréquentes — ${esc(v.nom)}</h2>
      ${v.faq.map(f => `<details class="v-faq">
        <summary>${esc(f.q)}</summary>
        <p>${f.r}</p>
      </details>`).join('\n      ')}
    </section>

    <section class="v-final">
      <h2>Une panne à ${esc(v.nom)} maintenant&nbsp;?</h2>
      <p>Appelez-nous, nous répondons 24h/24. Décrivez la panne et votre position&nbsp;: vous saurez tout de suite le délai et le prix.</p>
      <div class="v-cta">
        <a class="v-btn v-btn-call" href="tel:${site.telHref}">${site.tel}</a>
        <a class="v-btn v-btn-ghost" href="demande.html">Formulaire de demande</a>
      </div>
    </section>
  </main>

  <footer class="v-footer">
    <p class="v-footer-title">Nous intervenons aussi à</p>
    <ul class="v-links">
      ${autres.map(o => `<li><a href="ville-${o.slug}.html">Dépannage ${esc(o.nom)}</a></li>`).join('\n      ')}
      <li><a href="index.html">Nice et tout le 06</a></li>
    </ul>
    <p class="v-footer-legal">
      <a href="index.html">Accueil</a> · <a href="a-propos.html">À propos</a> · <a href="diagnostic.html">Diagnostic pneus</a> · <a href="mentions-legales.html">Mentions légales</a>
      <br>© <span id="year"></span> ${esc(site.nom)} — ${esc(site.depart)}
    </p>
  </footer>

  <a class="v-sticky" href="tel:${site.telHref}" aria-label="Appeler le ${site.tel}">Appeler — ${site.tel}</a>

  <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
</body>
</html>
`;
}

// ── Écriture des pages ──────────────────────
villes.forEach(v => {
  const file = path.join(ROOT, `ville-${v.slug}.html`);
  fs.writeFileSync(file, page(v));
  console.log('écrit :', path.basename(file));
});

// ── Sitemap ─────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const staticPages = [
  { loc: `${site.base}/`, freq: 'weekly', prio: '1.0' },
  { loc: `${site.base}/demande.html`, freq: 'monthly', prio: '0.9' },
  { loc: `${site.base}/diagnostic.html`, freq: 'monthly', prio: '0.8' },
  { loc: `${site.base}/a-propos.html`, freq: 'monthly', prio: '0.6' },
  { loc: `${site.base}/mentions-legales.html`, freq: 'yearly', prio: '0.3' },
];
const cityPages = villes.map(v => ({ loc: `${site.base}/ville-${v.slug}.html`, freq: 'monthly', prio: '0.8' }));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...cityPages].map(p => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.prio}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log('écrit : sitemap.xml (' + (staticPages.length + cityPages.length) + ' URL)');
