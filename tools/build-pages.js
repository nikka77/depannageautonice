#!/usr/bin/env node
// =============================================
// Génère les pages du site au design « Accueil » :
//   index.html, services.html, zone.html, faq.html, contact.html, a-propos.html
//
//   node tools/build-pages.js
//
// Chaque page = un fragment de contenu dans tools/pages/ + la mise en page
// commune définie ici (en-tête, pied de page, actions d'urgence, balises
// SEO, données structurées). Pour modifier un texte, éditer le fragment ou
// les données ci-dessous, puis relancer le script. Ne jamais éditer les
// fichiers HTML générés à la main : ils sont écrasés.
//
// Jetons disponibles dans les fragments :
//   {{TEL}} {{TEL_HREF}} {{WA}}           coordonnées
//   {{ic:nom}} {{ic:nom:classe}}          icône de img/icons.svg
//   {{FAQ_LIST}}                          questions de la page (données FAQ)
//   {{V:slug}} {{ZONE_CHIPS}}             ville + délai, liste des villes (villes.json)
// =============================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { site, villes } = JSON.parse(fs.readFileSync(path.join(__dirname, 'villes.json'), 'utf8'));
const BASE = site.base;
const TEL = site.tel;
const TEL_HREF = site.telHref;
// Message pré-rempli : le client n'a plus qu'à compléter sa position, et la
// conversation arrive identifiée comme une demande de dépannage.
const WA = 'https://wa.me/33617684270?text=' + encodeURIComponent("Bonjour, j'ai besoin d'un dépannage. Je suis à : ");

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23111'/%3E%3Cpath fill='%23ff6b00' d='M18 28c4-7 11-11 18-9l5-3-3 9c2 5 1 11-3 15s-10 5-15 3l-5 3 3-9-2-2-1 1-2-2 1-1c1-2 2-3 4-5z'/%3E%3C/svg%3E";

const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Texte brut pour le JSON-LD : sans balises ni entités.
const plain = s => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const ic = (name, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="img/icons.svg#i-${name}"/></svg>`;

// ── Questions fréquentes ──────────────────────
// Une seule source pour le texte affiché ET le balisage FAQPage : les deux
// ne peuvent pas diverger (Google pénalise un FAQPage qui ne correspond pas
// à la page).
const FAQ = {
  faq: [
    ['Quel est votre délai d\'intervention&nbsp;?',
      `<p>Nous intervenons en 30 minutes à 1 heure sur Nice et ses environs. Pour les communes plus éloignées des Alpes-Maritimes, le délai peut varier selon l'heure et la circulation&nbsp;; il vous est annoncé au téléphone avant le départ de la dépanneuse.</p>`],
    ['Mon assurance prend-elle en charge le dépannage&nbsp;?',
      // La maquette conseillait d'appeler le dépanneur « avant votre
      // assurance ». Or un contrat avec assistance peut refuser de rembourser
      // une intervention qu'il n'a pas missionnée : la réponse protège le client.
      `<p>Dans la majorité des cas, oui. Nous travaillons avec toutes les compagnies d'assurance auto (MAIF, AXA, Allianz, MACIF, GMF, Groupama et bien d'autres). Si votre contrat comprend une assistance, dites-le-nous à l'appel&nbsp;: nous vérifions avec vous ce qui est couvert avant d'intervenir, et nous gérons souvent la prise en charge à votre place.</p>`],
    ['Intervenez-vous la nuit et le week-end&nbsp;?',
      `<p>Oui. Nous sommes disponibles 7 jours sur 7, 24 heures sur 24, y compris les nuits, week-ends et jours fériés. Un technicien décroche — il n'y a pas de répondeur.</p>`],
    ['Quels types de véhicules prenez-vous en charge&nbsp;?',
      `<p>Voitures particulières, SUV, monospaces, utilitaires légers, motos et scooters. Pour les poids lourds ou véhicules spéciaux, contactez-nous pour vérifier la faisabilité.</p>`],
    ['Que faire en cas de panne sur l\'autoroute&nbsp;?',
      `<p>Mettez votre gilet jaune, allumez vos warnings et éloignez-vous du véhicule en passant la glissière de sécurité. Sur autoroute, l'intervention passe obligatoirement par le prestataire agréé du réseau&nbsp;: utilisez une borne d'appel d'urgence ou appelez le 112.</p>`],
    ['Comment le prix est-il fixé&nbsp;?',
      `<p>Le tarif de départ est de 70&nbsp;€ sur Nice et sa première couronne. Au-delà, un devis vous est annoncé au téléphone avant que la dépanneuse parte. Le prix annoncé est le prix facturé&nbsp;: pas de supplément à l'arrivée.</p>`],
  ],
};

// name="faq" : une seule réponse ouverte à la fois, sans JavaScript.
const faqHtml = items => items.map(([q, a], i) =>
  `    <details name="faq"${i === 0 ? ' open' : ''}>\n      <summary>${q}${ic('chevron')}</summary>\n      <div>${a}</div>\n    </details>`).join('\n');
const faqSchema = (items, url) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: items.map(([q, a]) => ({
    '@type': 'Question', name: plain(q),
    acceptedAnswer: { '@type': 'Answer', text: plain(a) },
  })),
});

const crumbs = (url, name) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE}/` },
    { '@type': 'ListItem', position: 2, name, item: url },
  ],
});

// Fiche entreprise — repris de l'ancien accueil. « foundingDate » reste à
// confirmer par le gérant (voir A-COMPLETER.md).
const BUSINESS = {
  '@type': ['LocalBusiness', 'AutomotiveBusiness', 'EmergencyService'],
  '@id': `${BASE}/#business`,
  name: 'Dépannage Auto Nice',
  url: `${BASE}/`,
  telephone: '+33617684270',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Zone industrielle du Quai de la Blanquière',
    addressLocality: 'Nice', addressRegion: 'Alpes-Maritimes',
    postalCode: '06000', addressCountry: 'FR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 43.7102, longitude: 7.2620 },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00', closes: '23:59',
  }],
  priceRange: '€',
  description: 'Dépannage, remorquage et transport auto 7j/7 24h/24 sur Nice et les Alpes-Maritimes. Délai estimé de 30 à 60 minutes sur Nice. À partir de 70 €. Toutes assurances.',
  image: `${BASE}/img/og-cover.jpg`,
  logo: `${BASE}/img/logo.png`,
  foundingDate: '2004',
  areaServed: [
    ...['Nice', 'Cannes', 'Antibes', 'Menton', 'Grasse', 'Vence', 'Cagnes-sur-Mer', 'Villeneuve-Loubet', 'Mougins']
      .map(name => ({ '@type': 'City', name })),
    { '@type': 'AdministrativeArea', name: 'Alpes-Maritimes' },
  ],
  serviceType: ['Dépannage automobile', 'Remorquage', 'Transport de véhicule', 'Erreur de carburant',
    'Changement de pneu', 'Batterie et démarrage', 'Surchauffe moteur'],
  potentialAction: { '@type': 'ReserveAction', target: `${BASE}/demande.html`, name: 'Demander un dépannage' },
  makesOffer: {
    '@type': 'Offer', name: 'Dépannage Nice et environs',
    priceSpecification: { '@type': 'PriceSpecification', minPrice: 70, priceCurrency: 'EUR' },
  },
};

// ── Pages ─────────────────────────────────────
const PAGES = [
  {
    file: 'index.html', frag: 'accueil.html', nav: null, path: '/',
    title: `Dépannage Auto Nice | ${TEL} — 7j/7 24h/24`,
    desc: `Dépanneuse à Nice en 30 à 60 min, 7j/7 24h/24. Dépannage, remorquage et transport dans tout le 06, prix annoncé avant l'intervention, dès 70 €. Tél. ${TEL}.`,
    preload: 'img/hero-1.webp',
    schema: () => [BUSINESS, { '@type': 'WebSite', '@id': `${BASE}/#site`, url: `${BASE}/`, name: 'Dépannage Auto Nice', inLanguage: 'fr-FR' }],
  },
  {
    file: 'services.html', frag: 'services.html', nav: 'services', path: '/services.html',
    title: `Nos services — Dépannage Auto Nice | ${TEL}`,
    desc: 'Remorquage, dépannage sur place, erreur de carburant, pneu, batterie, surchauffe moteur : diagnostic sur place et prix annoncé avant toute manipulation. 7j/7 24h/24.',
    schema: url => [crumbs(url, 'Nos services')],
  },
  {
    file: 'zone.html', frag: 'zone.html', nav: 'zone', path: '/zone.html',
    title: `Zone d'intervention : tout le 06 — Dépannage Auto Nice`,
    desc: 'Dépannage en 30 à 60 min sur Nice et sa première couronne, et dans tout le 06 : Cannes, Antibes, Menton, Cagnes-sur-Mer, Grasse. Délai annoncé avant le départ.',
    leaflet: true,
    schema: url => [crumbs(url, "Zone d'intervention")],
  },
  {
    file: 'faq.html', frag: 'faq.html', nav: 'faq', path: '/faq.html', faq: 'faq',
    title: 'Questions fréquentes — Dépannage Auto Nice',
    desc: "Délai d'intervention, prix, assurance, autoroute, types de véhicules : ce que les clients demandent le plus souvent avant d'appeler un dépanneur à Nice.",
    schema: (url, p) => [crumbs(url, 'Questions fréquentes'), faqSchema(FAQ[p.faq], url)],
  },
  {
    file: 'a-propos.html', frag: 'a-propos.html', nav: 'a-propos', path: '/a-propos.html',
    title: `À propos — une équipe niçoise | Dépannage Auto Nice`,
    desc: "Une équipe niçoise, pas une plateforme : atelier Quai de la Blanquière à Nice, dépannage et remorquage 7j/7 24h/24 dans tout le 06. Un technicien au bout du fil.",
    schema: url => [
      { '@type': 'AboutPage', '@id': `${url}#page`, url, name: 'À propos — Dépannage Auto Nice', inLanguage: 'fr-FR', about: { '@id': `${BASE}/#business` } },
      crumbs(url, 'À propos'),
    ],
  },
  {
    file: 'contact.html', frag: 'contact.html', nav: 'contact', path: '/contact.html',
    title: `Nous joindre — Dépannage Auto Nice | ${TEL}`,
    desc: `Panne en cours : appelez le ${TEL}, 7j/7 24h/24. Devis, rendez-vous atelier ou question : formulaire ou WhatsApp. Atelier Quai de la Blanquière, Nice.`,
    config: true,
    schema: url => [
      { '@type': 'ContactPage', '@id': `${url}#page`, url, name: 'Contact — Dépannage Auto Nice', inLanguage: 'fr-FR', about: { '@id': `${BASE}/#business` } },
      crumbs(url, 'Contact'),
    ],
  },
  {
    file: 'mentions-legales.html', frag: 'mentions-legales.html', nav: null, path: '/mentions-legales.html',
    title: 'Mentions légales — Dépannage Auto Nice',
    desc: 'Mentions légales du site Dépannage Auto Nice : éditeur, hébergeur, données personnelles, services tiers, stockage local.',
    schema: url => [crumbs(url, 'Mentions légales')],
  },
  {
    // GitHub Pages sert 404.html pour toute adresse inconnue, quelle que soit
    // sa profondeur : les liens et ressources sont réécrits en chemins
    // absolus (voir writePage). Pas de <base> : il casserait les ancres #main.
    file: '404.html', frag: '404.html', nav: null, path: '/404.html', base: '/depannageautonice/', noindex: true,
    title: 'Page introuvable — Dépannage Auto Nice',
    desc: `Page introuvable. En panne ? Appelez le ${TEL}, 7j/7 24h/24.`,
    schema: () => [],
  },
];

const NAV = [
  ['services', 'services.html', 'Services'],
  ['zone', 'zone.html', 'Zone'],
  ['faq', 'faq.html', 'FAQ'],
  ['a-propos', 'a-propos.html', 'À propos'],
  ['contact', 'contact.html', 'Contact'],
];

function layout(p, body) {
  const url = `${BASE}${p.path}`;
  const graph = { '@context': 'https://schema.org', '@graph': p.schema(url, p) };
  const nav = NAV.map(([key, href, label]) =>
    `<a href="${href}"${p.nav === key ? ' aria-current="page"' : ''}>${label}</a>`).join('\n        ');
  return `<!DOCTYPE html>
<!-- Généré par tools/build-pages.js — ne pas modifier à la main. -->
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${p.title}</title>
  <meta name="description" content="${escAttr(p.desc)}">
${p.noindex ? '  <meta name="robots" content="noindex">\n' : `  <link rel="canonical" href="${url}">\n`}  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${escAttr(p.title)}">
  <meta property="og:description" content="${escAttr(p.desc)}">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:image" content="${BASE}/img/og-cover.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(p.title)}">
  <meta name="twitter:description" content="${escAttr(p.desc)}">
  <meta name="twitter:image" content="${BASE}/img/og-cover.jpg">
  <meta name="geo.region" content="FR-06">
  <meta name="geo.placename" content="${p.place || 'Nice'}">
${p.geo ? `  <meta name="geo.position" content="${p.geo}">\n` : ''}  <link rel="icon" type="image/svg+xml" href="${FAVICON}">
  <link rel="apple-touch-icon" href="img/icon-180.png">
  <link rel="manifest" href="manifest.webmanifest">
  <meta name="theme-color" content="#ff6b00">
  <link rel="preload" as="font" type="font/woff2" href="fonts/chakra-400-latin.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="fonts/chakra-700-latin.woff2" crossorigin>
  <link rel="stylesheet" href="fonts/fonts.css">
${p.preload ? `  <link rel="preload" as="image" href="${p.preload}" fetchpriority="high">\n` : ''}${p.leaflet ? '  <link rel="stylesheet" href="vendor/css/leaflet.css">\n' : ''}  <link rel="stylesheet" href="site.css">
${graph['@graph'].length ? `  <script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n  </script>\n` : ''}</head>
<body>
  <a class="skip" href="#main">Aller au contenu</a>

  <header class="hd">
    <div class="wrap hd-in">
      <a href="index.html" class="brand"${p.nav === null ? ' aria-current="page"' : ''}>
        <span class="brand-bar" aria-hidden="true"></span>
        <span class="brand-txt">
          <span class="brand-name">Dépannage Auto Nice</span>
          <span class="brand-sub">Remorquage &amp; dépannage · 7j/7 24h/24</span>
        </span>
      </a>
      <button type="button" class="menu-btn" aria-expanded="false" aria-controls="nav">
        <svg class="ic ic-sm i-open" aria-hidden="true"><use href="img/icons.svg#i-menu"/></svg>
        <svg class="ic ic-sm i-close" aria-hidden="true"><use href="img/icons.svg#i-x"/></svg>
        <span class="menu-label">Menu</span>
      </button>
      <nav class="nav" id="nav" aria-label="Navigation principale">
        ${nav}
      </nav>
      <div class="hd-actions">
        <a href="tel:${TEL_HREF}" class="hd-call" aria-label="Appeler le ${TEL}"><small>Urgence 24h/24</small><strong>${TEL}</strong></a>
        <a href="demande.html" class="hd-cta">${ic('file', 'ic-sm')}Demander</a>
      </div>
    </div>
  </header>

  <main id="main">
${body}
  </main>

  <footer class="ft">
    <div class="wrap ft-in">
      <div>
        <p class="ft-name">Dépannage Auto Nice</p>
        <p>Zone industrielle du Quai de la Blanquière, Nice.<br>Équipe niçoise depuis 2004, toutes assurances.</p>
        <a class="ft-tel" href="tel:${TEL_HREF}">${TEL}</a>
      </div>
      <nav class="ft-col" aria-label="Le site">
        <p class="ft-h">Le site</p>
        <a href="index.html">Accueil</a>
        <a href="services.html">Nos services</a>
        <a href="zone.html">Zone d'intervention</a>
        <a href="faq.html">Questions fréquentes</a>
        <a href="a-propos.html">À propos de l'équipe</a>
      </nav>
      <nav class="ft-col" aria-label="Agir">
        <p class="ft-h">Agir</p>
        <a href="demande.html">Demander un dépannage</a>
        <a href="diagnostic.html">Diagnostic pneus gratuit</a>
        <a href="contact.html">Contact</a>
        <a href="mentions-legales.html">Mentions légales</a>
      </nav>
    </div>
    <p class="ft-copy">© <span id="year">2026</span> Dépannage Auto Nice</p>
  </footer>

  <div class="rail" aria-label="Contact rapide" role="navigation">
    <a href="tel:${TEL_HREF}" class="rail-call"><small>Appeler 24h/24</small><strong>${TEL}</strong></a>
    <a href="demande.html" class="rail-btn rail-dem">${ic('file', 'ic-sm')}Demander un dépannage</a>
    <a href="${WA}" class="rail-btn rail-wa" rel="noopener">${ic('message', 'ic-sm')}WhatsApp</a>
    <a href="#main" class="rail-top" aria-label="Remonter en haut de page">${ic('arrow-up', 'ic-sm')}</a>
  </div>

  <div class="bar" aria-label="Contact rapide" role="navigation">
    <a href="tel:${TEL_HREF}" class="bar-call" aria-label="Appeler le ${TEL}"><small>Appeler</small><strong>${TEL}</strong></a>
    <a href="demande.html">${ic('file', 'ic-sm')}Demande</a>
    <a href="${WA}" rel="noopener">${ic('message', 'ic-sm')}WhatsApp</a>
    <a href="#main" class="bar-top" aria-label="Remonter en haut de page">${ic('arrow-up', 'ic-sm')}</a>
  </div>

${p.config ? '  <script src="config.js"></script>\n' : ''}${p.leaflet ? '  <script src="js/leaflet.js"></script>\n' : ''}  <script src="site.js"></script>
</body>
</html>
`;
}

function fill(p, src) {
  return src
    .replace(/\{\{ic:([a-z-]+)(?::([a-z- ]+))?\}\}/g, (_, n, c) => ic(n, c))
    .replace(/\{\{TEL_HREF\}\}/g, TEL_HREF)
    .replace(/\{\{TEL\}\}/g, TEL)
    .replace(/\{\{WA\}\}/g, WA)
    .replace('{{FAQ_LIST}}', p.faq ? faqHtml(FAQ[p.faq]) : '')
    .replace(/\{\{V:([a-z-]+)\}\}/g, (_, slug) => {
      const v = villes.find(x => x.slug === slug);
      if (!v) throw new Error(`ville inconnue : ${slug}`);
      return `<a href="ville-${v.slug}.html">${v.nom}</a> <span class="delai">(${v.delai})</span>`;
    })
    .replace('{{ZONE_CHIPS}}', villes.map(v =>
      `    <li><a href="ville-${v.slug}.html">${v.nom}</a></li>`).join('\n'));
}

// Assemble et écrit une page ; réutilisé par build-villes.js pour que les
// pages ville partagent exactement l'en-tête, le pied et les actions.
function writePage(p, src) {
  let html = layout(p, fill(p, src).replace(/^/gm, '    ').replace(/^ +$/gm, ''));
  if (p.base) {
    html = html.replace(/\b(href|src)="(?!https?:|tel:|mailto:|data:|#|\/)/g, `$1="${p.base}`);
  }
  const left = html.match(/\{\{[^}]+\}\}/);
  if (left) throw new Error(`${p.file} : jeton non remplacé ${left[0]}`);
  fs.writeFileSync(path.join(ROOT, p.file), html);
  console.log('écrit :', p.file);
}

if (require.main === module) {
  for (const p of PAGES) writePage(p, fs.readFileSync(path.join(__dirname, 'pages', p.frag), 'utf8'));
}

module.exports = { PAGES, writePage, ic };
