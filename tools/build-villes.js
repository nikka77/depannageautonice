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

const { writePage, PAGES } = require('./build-pages');
const { SERVICES } = require('./services');
const { GUIDES } = require('./guides');
// Services mis en avant sur chaque page ville.
const VILLE_SERVICES = ['remorquage-voiture-nice', 'depannage-batterie-nice', 'pneu-creve-nice', 'ouverture-porte-voiture-nice', 'erreur-carburant-nice', 'depannage-accident-nice'].map(sl => SERVICES.find(x => x.slug === sl));


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

  // Contenu seul : l'en-tête, le pied de page et les actions d'urgence
  // viennent de la mise en page commune (tools/build-pages.js).
  const contenu = `<section class="wrap intro">
  <a href="zone.html" class="back">← Zone d'intervention</a>
  <p class="kicker">${esc(v.nom)} ${esc(v.cp)} — 7j/7 24h/24</p>
  <h1>Dépannage auto à ${esc(v.nom)}</h1>
  <p class="lead">${v.intro}</p>
  <div class="btns">
    <a href="tel:{{TEL_HREF}}" class="btn btn-orange">{{ic:phone}}Appeler le {{TEL}}</a>
    <a href="demande.html" class="btn btn-dark">{{ic:file}}Demander en ligne</a>
  </div>
</section>

<section class="wrap sec" aria-label="${esc(v.nom)} en bref">
  <div class="grid">
    <div class="cell"><p class="svc-num">Distance depuis l'atelier</p><p class="fact-v">${v.distanceKm} km</p></div>
    <div class="cell"><p class="svc-num">Délai d'intervention estimé</p><p class="fact-v">${esc(v.delai)}</p></div>
    <div class="cell"><p class="svc-num">Accès</p><p class="fact-v">${esc(v.acces)}</p></div>
  </div>
  <p class="small-mono">Nos camions partent de ${esc(site.depart)}. Le délai annoncé est une estimation liée au trafic, pas une garantie&nbsp;: nous vous donnons une fourchette réaliste au téléphone.</p>
</section>

<section class="wrap sec" aria-labelledby="h-local">
  <h2 class="sec-t" id="h-local">${esc(v.specTitre || `Ce que nous voyons le plus souvent à ${v.nom}`)}</h2>
  <div class="grid grid-wide">
    ${v.specificites.map(sp => `<article class="cell"><h3>${esc(sp.titre)}</h3><p>${sp.texte}</p></article>`).join('\n    ')}
  </div>
</section>

<section class="wrap sec" aria-labelledby="h-inter">
  <h2 class="sec-t" id="h-inter">Nos interventions à ${esc(v.nom)}</h2>
  <p class="sec-sub">Les mêmes qu'à Nice, avec les mêmes prix publiés (plus le déplacement au-delà de 10&nbsp;km) — <a href="services.html">les ${SERVICES.length} services</a>.</p>
  <div class="grid grid-wide">
    ${VILLE_SERVICES.map(x => `<a class="cell cell-link" href="${x.slug}.html"><h3>${x.nom}</h3><p>${x.resume}</p><span class="svc-meta">${x.prix}</span></a>`).join('\n    ')}
  </div>
</section>

<section class="wrap sec" aria-labelledby="h-quartiers">
  <h2 class="sec-t" id="h-quartiers">Quartiers desservis à ${esc(v.nom)}</h2>
  <ul class="chips">
    ${v.quartiers.map(q => `<li><span>${esc(q)}</span></li>`).join('\n    ')}
  </ul>
  <p class="small-mono">Cette liste n'est pas limitative&nbsp;: nous intervenons sur l'ensemble de la commune et des communes voisines.</p>
</section>

<section class="wrap sec" aria-labelledby="h-tarifs">
  <h2 class="sec-t" id="h-tarifs">Tarifs</h2>
  <p class="lead">Notre tarif de base est de <strong>70&nbsp;€</strong> pour Nice et ses environs immédiats (<a href="tarifs.html">grille complète</a>). ${v.distanceKm > 20 ? `${esc(v.nom)} étant à ${v.distanceKm}&nbsp;km, un supplément de distance s'applique&nbsp;:` : 'Pour ' + esc(v.nom) + ', le tarif reste proche de ce montant&nbsp;:'} le prix exact vous est annoncé au téléphone <strong>avant</strong> tout déplacement, et c'est celui qui sera facturé. Aucun supplément à l'arrivée.</p>
  <p class="lead">Nous travaillons avec toutes les compagnies d'assurance auto&nbsp;: la prise en charge directe est souvent possible, demandez-nous.</p>
</section>

<section class="wrap sec" aria-labelledby="h-faq">
  <h2 class="sec-t" id="h-faq">Questions fréquentes — ${esc(v.nom)}</h2>
  <div class="faq">
    ${v.faq.map((f, i) => `<details name="faq"${i === 0 ? ' open' : ''}><summary>${esc(f.q)}{{ic:chevron}}</summary><div><p>${f.r}</p></div></details>`).join('\n    ')}
  </div>
</section>

<section class="wrap sec" aria-labelledby="h-autres">
  <h2 class="sec-t" id="h-autres">Nous intervenons aussi à</h2>
  <ul class="chips">
    ${autres.map(o => `<li><a href="ville-${o.slug}.html">${esc(o.nom)}</a></li>`).join('\n    ')}
    <li><a href="zone.html">Tout le 06</a></li>
  </ul>
</section>

<section class="wrap sec sec-end" aria-labelledby="h-band">
  <div class="band">
    <div>
      <h2 id="h-band">Une panne à ${esc(v.nom)} maintenant&nbsp;?</h2>
      <p>Décrivez la panne et votre position&nbsp;: vous saurez tout de suite le délai et le prix.</p>
    </div>
    <a href="tel:{{TEL_HREF}}" class="btn btn-orange">{{ic:phone}}Appeler le {{TEL}}</a>
  </div>
</section>
`;

  writePage({
    file: `ville-${v.slug}.html`, path: `/ville-${v.slug}.html`, nav: null,
    place: v.nom, geo: `${v.lat};${v.lng}`,
    title: titre, desc,
    schema: () => schema['@graph'],
  }, contenu);
}

// ── Écriture des pages ──────────────────────
villes.forEach(page);

// ── Sitemap ─────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
// Pages du générateur principal (toutes langues), sauf celles exclues de
// l'index (404) : une seule source, le sitemap ne peut plus oublier une page.
const PRIO = { accueil: '1.0', services: '0.9', tarifs: '0.9', zone: '0.8', faq: '0.7', contact: '0.7', 'a-propos': '0.6' };
const staticPages = [
  ...PAGES.filter(p => !p.noindex).map(p => ({
    loc: `${site.base}/${p.file.replace(/(^|\/)index\.html$/, '$1')}`,
    freq: p.key === 'accueil' ? 'weekly' : 'monthly',
    // Les traductions passent après les pages françaises de même rang.
    prio: p.lang ? '0.6' : (PRIO[p.key] || '0.3'),
  })),
  { loc: `${site.base}/demande.html`, freq: 'monthly', prio: '0.9' },
  { loc: `${site.base}/diagnostic.html`, freq: 'monthly', prio: '0.8' },
  { loc: `${site.base}/conseils.html`, freq: 'monthly', prio: '0.7' },
  ...SERVICES.map(x => ({ loc: `${site.base}/${x.slug}.html`, freq: 'monthly', prio: '0.8' })),
  ...GUIDES.map(g => ({ loc: `${site.base}/${g.slug}.html`, freq: 'monthly', prio: '0.6' })),
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
