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
//   {{ZONE_ROWS}} {{ZONE_CHIPS}}          délais et communes (villes.json)
// =============================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { site, villes } = JSON.parse(fs.readFileSync(path.join(__dirname, 'villes.json'), 'utf8'));
const BASE = site.base;
const TEL = site.tel;
const TEL_HREF = site.telHref;
const WA = 'https://wa.me/33617684270';

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
      `<p>Entre <strong>30 minutes et 1 heure sur Nice</strong>, estimé hors heures de pointe. Pour les autres communes du 06, le délai dépend de la distance&nbsp;; il vous est annoncé au téléphone, avant l'intervention.</p><p><a href="zone.html">Voir les délais par commune</a></p>`],
    ['Combien coûte un dépannage&nbsp;?',
      `<p><strong>À partir de 70&nbsp;€</strong> sur Nice et ses environs. Au-delà, le prix dépend de la distance et vous est annoncé au téléphone avant le départ de la dépanneuse. Le prix annoncé est le prix facturé&nbsp;: aucun supplément à l'arrivée.</p>`],
    ['Mon assurance prend-elle en charge le dépannage&nbsp;?',
      `<p>Dans la majorité des cas, oui. Nous travaillons avec <strong>toutes les compagnies d'assurance auto</strong> (MAIF, AXA, Allianz, MACIF, GMF, Groupama et bien d'autres). Si votre contrat inclut une assistance, appelez-nous&nbsp;: nous vérifions avec vous ce qui est couvert.</p>`],
    ['Intervenez-vous la nuit et le week-end&nbsp;?',
      `<p>Oui. Nous sommes disponibles <strong>7 jours sur 7, 24 heures sur 24</strong>, y compris les nuits, week-ends et jours fériés.</p>`],
    ['Quels types de véhicules prenez-vous en charge&nbsp;?',
      `<p>Voitures particulières, SUV, monospaces, utilitaires légers, motos et scooters. Pour les poids lourds ou les véhicules spéciaux, appelez pour vérifier la faisabilité.</p>`],
    ['Où emmenez-vous mon véhicule&nbsp;?',
      `<p>Où vous le décidez&nbsp;: notre atelier du Quai de la Blanquière à Nice, votre garage habituel ou votre domicile. S'il arrive à notre atelier, le diagnostic et la réparation peuvent se faire sur place.</p>`],
    ['Que faire en cas de panne sur l\'autoroute&nbsp;?',
      `<p><strong>Mettez votre gilet, allumez vos feux de détresse et passez derrière la glissière de sécurité.</strong> Sur autoroute, l'intervention passe obligatoirement par le dépanneur agréé par la société d'autoroute&nbsp;: utilisez une borne d'appel d'urgence.</p>`],
    ['Je ne peux pas téléphoner, comment faire&nbsp;?',
      `<p>Faites la <a href="demande.html">demande en ligne</a> — position, panne, véhicule — ou écrivez-nous sur <a href="${WA}" rel="noopener">WhatsApp</a>. Nous vous rappelons ou vous répondons par écrit.</p>`],
  ],
  'a-propos': [
    ['Êtes-vous un dépanneur ou un garage&nbsp;?',
      `<p>Les deux. Nous dépannons sur la route et nous disposons d'un atelier Zone industrielle du Quai de la Blanquière, à Nice. Un véhicule remorqué peut donc être diagnostiqué et réparé au même endroit, sans changer d'interlocuteur.</p>`],
    ['Intervenez-vous vraiment la nuit et le dimanche&nbsp;?',
      `<p>Oui, 7 jours sur 7 et 24 heures sur 24. Le délai est estimé entre 30 minutes et 1 heure sur Nice&nbsp;; il s'allonge aux heures de pointe et à mesure que l'on s'éloigne de Nice.</p>`],
    ['Comment connaître le prix avant de m\'engager&nbsp;?',
      `<p>Le prix est annoncé par téléphone, avant le départ de la dépanneuse. Le devis est transmis avant l'intervention et le prix annoncé est le prix facturé&nbsp;: pas de frais découverts à l'arrivée.</p>`],
  ],
};

const faqHtml = items => items.map(([q, a]) =>
  `    <details>\n      <summary>${q}${ic('chevron')}</summary>\n      <div>${a}</div>\n    </details>`).join('\n');
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
    file: 'services.html', frag: 'services.html', nav: 'services', path: '/services.html', crumb: 'Services & tarifs',
    title: `Services et tarifs — Dépannage Auto Nice | ${TEL}`,
    desc: 'Remorquage, dépannage sur place, erreur de carburant, pneu, batterie, surchauffe moteur. À partir de 70 € sur Nice, devis annoncé avant intervention. 7j/7 24h/24.',
    schema: url => [crumbs(url, 'Services & tarifs')],
  },
  {
    file: 'zone.html', frag: 'zone.html', nav: 'zone', path: '/zone.html', crumb: "Zone d'intervention",
    title: `Zone d'intervention : Nice et tout le 06 — Dépannage Auto Nice`,
    desc: 'Dépannage sur Nice et dans toutes les Alpes-Maritimes : Cannes, Antibes, Menton, Cagnes-sur-Mer, Grasse. Délais estimés par commune, annoncés avant intervention.',
    leaflet: true,
    schema: url => [crumbs(url, "Zone d'intervention")],
  },
  {
    file: 'faq.html', frag: 'faq.html', nav: 'faq', path: '/faq.html', crumb: 'Questions fréquentes', faq: 'faq',
    title: 'Questions fréquentes — Dépannage Auto Nice',
    desc: "Délai d'intervention, prix, assurance, autoroute, types de véhicules : les réponses aux questions les plus posées sur le dépannage auto à Nice.",
    schema: (url, p) => [crumbs(url, 'Questions fréquentes'), faqSchema(FAQ[p.faq], url)],
  },
  {
    file: 'a-propos.html', frag: 'a-propos.html', nav: 'a-propos', path: '/a-propos.html', crumb: 'À propos', faq: 'a-propos',
    title: `À propos — Dépannage Auto Nice | ${TEL}`,
    desc: 'Qui nous sommes : un atelier à Nice, Quai de la Blanquière, et un service de dépannage et remorquage 7j/7 24h/24 sur tout le 06. Prix annoncé = prix facturé.',
    schema: (url, p) => [
      { '@type': 'AboutPage', '@id': `${url}#page`, url, name: 'À propos — Dépannage Auto Nice', inLanguage: 'fr-FR', about: { '@id': `${BASE}/#business` } },
      crumbs(url, 'À propos'), faqSchema(FAQ[p.faq], url),
    ],
  },
  {
    file: 'contact.html', frag: 'contact.html', nav: 'contact', path: '/contact.html', crumb: 'Contact',
    title: `Contact — Dépannage Auto Nice | ${TEL}`,
    desc: `Appelez le ${TEL} 7j/7 24h/24, écrivez sur WhatsApp ou envoyez un message. Atelier Zone industrielle du Quai de la Blanquière, Nice.`,
    config: true,
    schema: url => [
      { '@type': 'ContactPage', '@id': `${url}#page`, url, name: 'Contact — Dépannage Auto Nice', inLanguage: 'fr-FR', about: { '@id': `${BASE}/#business` } },
      crumbs(url, 'Contact'),
    ],
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
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
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
  <meta name="geo.placename" content="Nice">
  <link rel="icon" type="image/svg+xml" href="${FAVICON}">
  <meta name="theme-color" content="#ff6b00">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
${p.preload ? `  <link rel="preload" as="image" href="${p.preload}" fetchpriority="high">\n` : ''}${p.leaflet ? '  <link rel="stylesheet" href="vendor/css/leaflet.css">\n' : ''}  <link rel="stylesheet" href="site.css">
  <script type="application/ld+json">
${JSON.stringify(graph, null, 2)}
  </script>
</head>
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
        <a href="services.html">Services &amp; tarifs</a>
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
      <nav class="ft-col" aria-label="Villes">
        <p class="ft-h">Villes</p>
${villes.map(v => `        <a href="ville-${v.slug}.html">Dépannage ${v.nom}</a>`).join('\n')}
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
    .replace('{{ZONE_ROWS}}', villes.map(v =>
      `          <tr><td><a href="ville-${v.slug}.html">${v.nom}</a></td><td>${v.delai}</td></tr>`).join('\n'))
    .replace('{{ZONE_CHIPS}}', villes.map(v =>
      `    <li><a href="ville-${v.slug}.html">${v.nom}</a></li>`).join('\n'));
}

for (const p of PAGES) {
  const src = fs.readFileSync(path.join(__dirname, 'pages', p.frag), 'utf8');
  const html = layout(p, fill(p, src).replace(/^/gm, '    ').replace(/^ +$/gm, ''));
  const left = html.match(/\{\{[^}]+\}\}/);
  if (left) throw new Error(`${p.file} : jeton non remplacé ${left[0]}`);
  fs.writeFileSync(path.join(ROOT, p.file), html);
  console.log('écrit :', p.file);
}

module.exports = { PAGES };
