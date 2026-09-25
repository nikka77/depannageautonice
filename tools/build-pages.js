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
const I18N = require('./i18n');
const TARIFS = require('./tarifs');
const { CATS: SCATS, SERVICES } = require('./services');
const waLink = lang => 'https://wa.me/33617684270?text=' + encodeURIComponent(I18N.T[lang].wa);
const WA = waLink('fr');

// Chemin relatif entre deux pages, chacune repérée depuis la racine du site
// (« index.html », « en/about.html »). Les pages traduites vivent dans un
// sous-dossier par langue.
function rel(from, to) {
  const dir = from.includes('/') ? from.slice(0, from.lastIndexOf('/') + 1) : '';
  if (dir && to.startsWith(dir)) return to.slice(dir.length);
  return (dir ? '../' : '') + to;
}

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23111'/%3E%3Cpath fill='%23ff6b00' d='M18 28c4-7 11-11 18-9l5-3-3 9c2 5 1 11-3 15s-10 5-15 3l-5 3 3-9-2-2-1 1-2-2 1-1c1-2 2-3 4-5z'/%3E%3C/svg%3E";

const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Texte brut pour le JSON-LD : sans balises ni entités.
const plain = s => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const ic = (name, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="img/icons.svg#i-${name}"/></svg>`;

// ── Questions fréquentes ──────────────────────
// Une seule source pour le texte affiché ET le balisage FAQPage : les deux
// ne peuvent pas diverger (Google pénalise un FAQPage qui ne correspond pas
// à la page).
// Questions de la page FAQ, par thème. La page affiche les thèmes ; le
// balisage FAQPage reprend toutes les questions (FAQ.faq).
const FAQ_GROUPES = [
  { id: 'intervention', titre: "L'intervention", items: [
    ['Quel est votre délai d\'intervention&nbsp;?',
      `<p>Nous intervenons en 30 minutes à 1 heure sur Nice et ses environs. Pour les communes plus éloignées des Alpes-Maritimes, le délai peut varier selon l'heure et la circulation&nbsp;; il vous est annoncé au téléphone avant le départ de la dépanneuse. <a href="zone.html">Délais par commune</a>.</p>`],
    ['Intervenez-vous la nuit et le week-end&nbsp;?',
      `<p>Oui. Nous sommes disponibles 7 jours sur 7, 24 heures sur 24, y compris les nuits, week-ends et jours fériés. Un technicien décroche — il n'y a pas de répondeur.</p>`],
    ['Comment se passe une intervention&nbsp;?',
      `<p>Vous appelez (ou envoyez la <a href="demande.html">demande en ligne</a>), nous vous localisons, le prix ferme vous est annoncé, puis le technicien part. Sur place, il répare quand c'est possible&nbsp;; sinon, il remorque le véhicule où vous le souhaitez.</p>`],
    ['Que faut-il dire au téléphone&nbsp;?',
      `<p>Où vous êtes (adresse, repère ou position GPS), le modèle du véhicule, ce qui s'est passé, l'accès (parking souterrain, hauteur limite) et où emmener la voiture si elle doit être remorquée. <a href="guide-que-faire-en-cas-de-panne.html">Les bons réflexes en cas de panne</a>.</p>`],
    ['Puis-je choisir où va mon véhicule&nbsp;?',
      `<p>Oui, toujours&nbsp;: notre atelier du Quai de la Blanquière, votre garagiste, un concessionnaire, votre domicile. Nous pouvons aussi le garder en attendant&nbsp;: 48 heures de <a href="gardiennage-vehicule-nice.html">gardiennage</a> offertes.</p>`],
    ['Puis-je monter dans la dépanneuse&nbsp;?',
      `<p>Dans la limite des places de la cabine, oui. Dites combien vous êtes au moment de l'appel.</p>`],
    ['Peut-on prendre rendez-vous plutôt qu\'une intervention immédiate&nbsp;?',
      `<p>Oui, pour un transport au garage, un enlèvement d'épave ou un véhicule immobilisé sans urgence&nbsp;: choisissez «&nbsp;Plus tard&nbsp;» dans la <a href="demande.html?quand=plus-tard">demande en ligne</a>, avec la date et le créneau.</p>`],
  ] },
  { id: 'prix', titre: 'Prix et paiement', items: [
    ['Comment le prix est-il fixé&nbsp;?',
      `<p>Le tarif de départ est de 70&nbsp;€ sur Nice et sa première couronne. Au-delà, un devis vous est annoncé au téléphone avant que la dépanneuse parte. Le prix annoncé est le prix facturé&nbsp;: pas de supplément à l'arrivée. <a href="tarifs.html">Voir la grille complète et l'estimateur</a>.</p>`],
    ['Quels moyens de paiement acceptez-vous&nbsp;?',
      `<p>Carte bancaire, Apple&nbsp;Pay, Google&nbsp;Pay et espèces, à la fin de l'intervention. Une facture détaillée vous est remise sur place ou envoyée par e-mail.</p>`],
    ['Y a-t-il des frais cachés&nbsp;?',
      `<p>Non&nbsp;: ni frais de dossier, ni frais d'appel. Les suppléments (nuit, dimanche, parking souterrain, utilitaire) sont publiés et annoncés avant le départ.</p>`],
    ['Que se passe-t-il si j\'annule&nbsp;?',
      `<p>Avant le départ de la dépanneuse, rien. Après, un forfait de déplacement de 40&nbsp;€ est dû, comme le prévoient nos <a href="cgv.html">conditions de vente</a>.</p>`],
  ] },
  { id: 'assurance', titre: 'Assurance et location', items: [
    ['Mon assurance prend-elle en charge le dépannage&nbsp;?',
      // La maquette conseillait d'appeler le dépanneur « avant votre
      // assurance ». Or un contrat avec assistance peut refuser de rembourser
      // une intervention qu'il n'a pas missionnée : la réponse protège le client.
      `<p>Dans la majorité des cas, oui. Nous travaillons avec toutes les compagnies d'assurance auto (MAIF, AXA, Allianz, MACIF, GMF, Groupama et bien d'autres). Si votre contrat comprend une assistance, dites-le-nous à l'appel&nbsp;: nous vérifions avec vous ce qui est couvert avant d'intervenir, et nous gérons souvent la prise en charge à votre place.</p>`],
    ['Faut-il appeler son assurance avant le dépanneur&nbsp;?',
      `<p>Si votre contrat comprend une assistance et que vous voulez être pris en charge, oui&nbsp;: la plupart des contrats ne paient que les interventions qu'ils ont organisées. <a href="guide-assurance-assistance.html">Assurance et assistance&nbsp;: qui paie&nbsp;?</a></p>`],
    ['Qu\'est-ce que l\'assistance «&nbsp;0&nbsp;km&nbsp;»&nbsp;?',
      `<p>Une assistance qui intervient même devant votre domicile. Sans elle, beaucoup de contrats ne couvrent une panne qu'à partir d'une certaine distance de chez vous (souvent 25 ou 50&nbsp;km).</p>`],
    ['Je suis en voiture de location.',
      `<p>Appelez d'abord le numéro d'assistance du loueur&nbsp;: une intervention qu'il n'a pas autorisée peut rester à votre charge. <a href="guide-voiture-de-location-en-panne.html">Voiture de location en panne</a>.</p>`],
  ] },
  { id: 'situations', titre: 'Situations particulières', items: [
    ['Que faire en cas de panne sur l\'autoroute&nbsp;?',
      `<p>Mettez votre gilet jaune, allumez vos warnings et éloignez-vous du véhicule en passant la glissière de sécurité. Sur autoroute, l'intervention passe obligatoirement par le prestataire agréé du réseau&nbsp;: utilisez une borne d'appel d'urgence ou appelez le 112. <a href="guide-panne-autoroute-a8.html">Panne sur l'A8</a>.</p>`],
    ['Je me suis trompé de carburant.',
      `<p>Ne démarrez pas, ne mettez même pas le contact, et appelez-nous&nbsp;: une <a href="erreur-carburant-nice.html">vidange du réservoir</a> sur place suffit tant que le moteur n'a pas tourné.</p>`],
    ['Mes clés sont enfermées dans la voiture.',
      `<p>Nous ouvrons le véhicule sans casse dans la très grande majorité des cas, dès 90&nbsp;€, sur présentation des papiers. Un enfant ou un animal enfermé au soleil&nbsp;: appelez le 112. <a href="ouverture-porte-voiture-nice.html">Ouverture de porte</a>.</p>`],
    ['Ma voiture est dans un parking souterrain.',
      `<p>Nous venons avec un matériel adapté aux hauteurs limitées. Donnez-nous la hauteur affichée à l'entrée, le niveau et le numéro de place. <a href="depannage-parking-souterrain-nice.html">Dépannage en sous-sol</a>.</p>`],
    ['Dépannez-vous les voitures électriques&nbsp;?',
      `<p>Oui&nbsp;: batterie 12&nbsp;V sur place, et transport sur plateau (jamais roues au sol) vers une borne ou le concessionnaire. <a href="depannage-voiture-electrique-nice.html">Électriques et hybrides</a>.</p>`],
  ] },
  { id: 'vehicules', titre: 'Véhicules et démarches', items: [
    ['Quels types de véhicules prenez-vous en charge&nbsp;?',
      `<p>Voitures, SUV, monospaces, utilitaires, motos et scooters, électriques et hybrides. Camping-cars et véhicules de plus de 3,5&nbsp;t sur devis&nbsp;: nous vous confirmons la faisabilité à l'appel.</p>`],
    ['Enlevez-vous les épaves&nbsp;?',
      `<p>Oui, gratuitement pour un véhicule complet dont vous êtes le titulaire&nbsp;: il est remis à un centre VHU agréé qui délivre le certificat de destruction. <a href="enlevement-epave-nice.html">Enlèvement d'épave</a>.</p>`],
    ['Réparez-vous les véhicules&nbsp;?',
      `<p>Oui, à l'atelier du Quai de la Blanquière, sur rendez-vous&nbsp;: diagnostic électronique, réparations mécaniques courantes, recharge de climatisation. Toujours sur devis.</p>`],
  ] },
];

const FAQ = {
  faq: FAQ_GROUPES.flatMap(g => g.items),
  tarifs: [
    ['Pourquoi un prix «&nbsp;dès&nbsp;» et pas un prix exact en ligne&nbsp;?',
      `<p>Le prix final dépend de la distance, de l'heure, de l'accès (parking souterrain, roues bloquées) et du véhicule. Donnez-nous votre position et la panne&nbsp;: le prix ferme vous est annoncé au téléphone avant le départ. L'estimateur ci-dessus applique la même grille.</p>`],
    ['Le prix peut-il changer une fois sur place&nbsp;?',
      `<p>Non. Seulement si la situation réelle diffère de celle décrite (un parking souterrain non signalé, par exemple), nous vous annonçons un nouveau prix <strong>avant</strong> de toucher au véhicule, et vous êtes libre de refuser.</p>`],
    ['Que se passe-t-il si j\'annule&nbsp;?',
      `<p>Avant le départ de la dépanneuse&nbsp;: rien, l'appel et le devis sont gratuits. Après le départ, un forfait de déplacement de 40&nbsp;€ est dû (plus les frais kilométriques au-delà de 10&nbsp;km de l'atelier), comme le prévoient nos <a href="cgv.html">conditions de vente</a>.</p>`],
    ['Mon assurance ou mon loueur peut-il payer&nbsp;?',
      `<p>Souvent, oui. Si votre contrat d'assurance ou de location comprend une assistance, appelez-la d'abord&nbsp;: si elle nous missionne, vous n'avancez rien ou seulement la part non couverte. Sinon, notre facture détaillée vous permet de demander un remboursement.</p>`],
    ['Comment payer&nbsp;?',
      `<p>Par carte bancaire, Apple&nbsp;Pay, Google&nbsp;Pay ou en espèces, à la fin de l'intervention. Une facture détaillée vous est remise sur place ou envoyée par e-mail.</p>`],
  ],
};

// name="faq" : une seule réponse ouverte à la fois, sans JavaScript.
const faqHtml = (items, ouvrir = true) => items.map(([q, a], i) =>
  `    <details name="faq"${ouvrir && i === 0 ? ' open' : ''}>\n      <summary>${q}${ic('chevron')}</summary>\n      <div>${a}</div>\n    </details>`).join('\n');
const faqSchema = (items, url) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: items.map(([q, a]) => ({
    '@type': 'Question', name: plain(q),
    acceptedAnswer: { '@type': 'Answer', text: plain(a) },
  })),
});

const crumbs = (url, name, lang = 'fr') => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: I18N.T[lang].home, item: `${BASE}/${lang === 'fr' ? '' : lang + '/'}` },
    { '@type': 'ListItem', position: 2, name, item: url },
  ],
});

// Questions d'une page, dans sa langue.
const faqListe = (lang, cle) => lang === 'fr' ? FAQ[cle] : (cle === 'faq' ? I18N.FAQ[lang] : I18N.FAQX[cle][lang]);

// Catalogue des prix (page Tarifs) : les prestations à prix fixe.
const offerCatalog = (url, lang) => ({
  '@type': 'OfferCatalog', '@id': `${url}#tarifs`, name: I18N.T[lang].nav.tarifs,
  itemListElement: TARIFS.surPlace.map(s => ({
    '@type': 'Offer', priceCurrency: 'EUR', price: s.prix,
    priceSpecification: { '@type': 'PriceSpecification', minPrice: s.prix, priceCurrency: 'EUR', valueAddedTaxIncluded: true },
    itemOffered: { '@type': 'Service', name: s.nom[lang], provider: { '@id': `${BASE}/#business` } },
  })),
});

// Tableaux de la grille, paiement et données de l'estimateur (page Tarifs).
function tarifsTables(lang) {
  return TARIFS.groupes(lang).map(g => `<section class="wrap sec" aria-labelledby="h-g-${g.id}">
  <h2 class="sec-t" id="h-g-${g.id}">${g.titre}</h2>
  <p class="sec-sub">${g.note}</p>
  <table class="prix">
    <tbody>
${g.lignes.map(l => `      <tr${l.id ? ` id="t-${l.id}"` : ''}><th scope="row">${l.nom}</th><td>${l.prix}</td></tr>`).join('\n')}
    </tbody>
  </table>
</section>`).join('\n\n');
}
const PAY_IC = ['card', 'phone', 'phone', 'euro'];
const paiementHtml = lang => `<ul class="pay">${TARIFS.paiement[lang].map((m, i) => `<li>${ic(PAY_IC[i])}${m}</li>`).join('')}</ul>`;
function estimData(lang) {
  const nomV = v => I18N.nomVille(lang, v.slug, v.nom);
  return {
    calcul: TARIFS.calcul,
    presta: Object.fromEntries(TARIFS.surPlace.map(s => [s.id, { prix: s.prix, nom: s.nom[lang], plus: s.plus ? s.plus[lang] : '' }])),
    villes: [{ nom: I18N.nomVille(lang, 'nice', 'Nice'), km: 0 }, ...[...villes].sort((a, b) => a.distanceKm - b.distanceKm).map(v => ({ nom: nomV(v), km: v.distanceKm }))],
  };
}

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
  paymentAccepted: 'Carte bancaire, Apple Pay, Google Pay, Espèces',
  currenciesAccepted: 'EUR',
  description: 'Dépannage, remorquage et transport auto 7j/7 24h/24 sur Nice et les Alpes-Maritimes. Délai estimé de 30 à 60 minutes sur Nice. À partir de 70 €. Toutes assurances.',
  image: `${BASE}/img/og-cover.jpg`,
  logo: `${BASE}/img/logo.png`,
  foundingDate: '2004',
  areaServed: [
    ...['Nice', 'Cannes', 'Antibes', 'Menton', 'Grasse', 'Vence', 'Cagnes-sur-Mer', 'Villeneuve-Loubet', 'Saint-Laurent-du-Var', 'Mougins']
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
    file: 'index.html', frag: 'accueil.html', key: 'accueil', nav: null, path: '/',
    title: `Dépannage Auto Nice | ${TEL} — 7j/7 24h/24`,
    desc: `Dépanneuse à Nice en 30 à 60 min, 7j/7 24h/24. Dépannage, remorquage et transport dans tout le 06, prix annoncé avant l'intervention, dès 70 €. Tél. ${TEL}.`,
    preload: 'img/hero-1.webp',
    schema: () => [BUSINESS, { '@type': 'WebSite', '@id': `${BASE}/#site`, url: `${BASE}/`, name: 'Dépannage Auto Nice', inLanguage: 'fr-FR' }],
  },
  {
    file: 'services.html', frag: 'services.html', key: 'services', nav: 'services', path: '/services.html',
    title: `Nos services de dépannage à Nice — prix publiés | ${TEL}`,
    desc: 'Batterie, pneu, panne sèche, erreur de carburant, remorquage, accident, parking souterrain, clés perdues, moto, utilitaire, électrique, épave, gardiennage : 21 services, prix publiés, 7j/7 24h/24.',
    schema: url => [crumbs(url, 'Nos services'), { '@type': 'ItemList', '@id': `${url}#services`, itemListElement: SERVICES.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.nom.replace(/&nbsp;/g, ' '), url: `${BASE}/${x.slug}.html` })) }],
  },
  {
    file: 'tarifs.html', frag: 'tarifs.html', key: 'tarifs', nav: 'tarifs', path: '/tarifs.html', faq: 'tarifs',
    title: `Tarifs dépannage et remorquage à Nice — dès 70 € | ${TEL}`,
    desc: 'Grille tarifaire publiée : dépannage et remorquage dès 70 € à Nice, prix du remorquage au km, suppléments nuit et sous-sol, estimateur en ligne. Carte, Apple Pay, Google Pay, espèces.',
    schema: (url, p) => [crumbs(url, 'Tarifs'), faqSchema(FAQ[p.faq], url), offerCatalog(url, 'fr')],
  },
  {
    file: 'zone.html', frag: 'zone.html', key: 'zone', nav: 'zone', path: '/zone.html',
    title: `Zone d'intervention : tout le 06 — Dépannage Auto Nice`,
    desc: 'Dépannage en 30 à 60 min sur Nice et sa première couronne, et dans tout le 06 : Cannes, Antibes, Menton, Cagnes-sur-Mer, Grasse. Délai annoncé avant le départ.',
    leaflet: true,
    schema: url => [crumbs(url, "Zone d'intervention")],
  },
  {
    file: 'faq.html', frag: 'faq.html', key: 'faq', nav: 'faq', path: '/faq.html', faq: 'faq',
    title: 'Questions fréquentes — Dépannage Auto Nice',
    desc: "Délai, prix, paiement, assurance, location, autoroute, clés, carburant, parking souterrain, épave : 23 réponses aux questions posées avant d'appeler un dépanneur à Nice.",
    schema: (url, p) => [crumbs(url, 'Questions fréquentes'), faqSchema(FAQ[p.faq], url)],
  },
  {
    file: 'a-propos.html', frag: 'a-propos.html', key: 'a-propos', nav: 'a-propos', path: '/a-propos.html',
    title: `À propos — une équipe niçoise | Dépannage Auto Nice`,
    desc: "Une équipe niçoise, pas une plateforme : atelier Quai de la Blanquière à Nice, dépannage et remorquage 7j/7 24h/24 dans tout le 06. Un technicien au bout du fil.",
    schema: url => [
      { '@type': 'AboutPage', '@id': `${url}#page`, url, name: 'À propos — Dépannage Auto Nice', inLanguage: 'fr-FR', about: { '@id': `${BASE}/#business` } },
      crumbs(url, 'À propos'),
    ],
  },
  {
    file: 'contact.html', frag: 'contact.html', key: 'contact', nav: 'contact', path: '/contact.html',
    title: `Nous joindre — Dépannage Auto Nice | ${TEL}`,
    desc: `Panne en cours : appelez le ${TEL}, 7j/7 24h/24. Devis, rendez-vous atelier ou question : formulaire ou WhatsApp. Atelier Quai de la Blanquière, Nice.`,
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
    file: 'cgv.html', frag: 'cgv.html', nav: null, path: '/cgv.html',
    title: 'Conditions générales de vente — Dépannage Auto Nice',
    desc: 'Conditions générales de vente : devis et prix ferme avant départ, annulation, paiement (carte, Apple Pay, Google Pay, espèces), gardiennage, épave, médiation.',
    schema: url => [crumbs(url, 'Conditions générales de vente')],
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

// ── Pages traduites (anglais, italien) ───────
// Même contenu que les pages françaises clés, fragments dans pages/<langue>/.
for (const lang of ['en', 'it']) {
  const R = I18N.ROUTES[lang];
  for (const key of Object.keys(R)) {
    const m = I18N.META[lang][key];
    const file = R[key];
    const page = {
      lang, key, file, frag: `${lang}/${path.basename(file)}`, path: '/' + file,
      nav: key === 'accueil' ? null : key, title: m.title, desc: m.desc,
    };
    if (key === 'accueil') page.preload = 'img/hero-1.webp';
    if (key === 'zone') page.leaflet = true;
    if (key === 'faq') page.faq = 'faq';
    if (key === 'tarifs') page.faq = 'tarifs';
    page.schema = url => key === 'accueil'
      ? [{ '@type': 'WebPage', '@id': `${url}#page`, url, name: m.title, inLanguage: I18N.T[lang].inLang, about: { '@id': `${BASE}/#business` } }]
      : [crumbs(url, m.crumb, lang),
        ...(page.faq ? [faqSchema(faqListe(lang, page.faq), url)] : []),
        ...(key === 'tarifs' ? [offerCatalog(url, lang)] : [])];
    PAGES.push(page);
  }
}

function layout(p, body) {
  const lang = p.lang || 'fr';
  const t = I18N.T[lang];
  const R = I18N.ROUTES[lang];
  const tel = t.tel;
  const wa = waLink(lang);
  const url = `${BASE}${p.path}`;
  const graph = { '@context': 'https://schema.org', '@graph': p.schema(url, p) };
  const to = target => rel(p.file, target);

  const route = key => R[key] || I18N.FR_SEULEMENT[key];
  const nav = I18N.NAV[lang].map(key =>
    `<a href="${to(route(key))}"${p.nav === key ? ' aria-current="page"' : ''}>${t.nav[key]}</a>`).join('\n        ');

  // Sélecteur de langue : page équivalente si elle existe, sinon l'accueil.
  const langs = I18N.LANGS.map(l => {
    const target = I18N.ROUTES[l.code][p.key] || I18N.ROUTES[l.code].accueil;
    const cur = l.code === lang;
    return `<a href="${to(target)}" hreflang="${l.code}" lang="${l.code}"${cur ? ' aria-current="true"' : ''} title="${l.name}">${l.label}</a>`;
  }).join('');

  // hreflang : seulement pour les pages qui existent dans les trois langues.
  const alternates = p.key ? I18N.LANGS.map(l =>
    `  <link rel="alternate" hreflang="${l.code}" href="${BASE}/${I18N.ROUTES[l.code][p.key].replace(/(^|\/)index\.html$/, '$1')}">`).join('\n') +
    `\n  <link rel="alternate" hreflang="x-default" href="${BASE}/${I18N.ROUTES.fr[p.key].replace(/^index\.html$/, '')}">\n` : '';

  return `<!DOCTYPE html>
<!-- Généré par tools/build-pages.js — ne pas modifier à la main. -->
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escAttr(p.title)}</title>
  <meta name="description" content="${escAttr(p.desc)}">
${p.noindex ? '  <meta name="robots" content="noindex">\n' : `  <link rel="canonical" href="${url}">\n`}${alternates}  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${escAttr(p.title)}">
  <meta property="og:description" content="${escAttr(p.desc)}">
  <meta property="og:locale" content="${t.locale}">
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
  <a class="skip" href="#main">${t.skip}</a>

  <header class="hd">
    <div class="wrap hd-in">
      <a href="${to(R.accueil)}" class="brand"${p.nav === null && p.key === 'accueil' ? ' aria-current="page"' : ''}>
        <span class="brand-bar" aria-hidden="true"></span>
        <span class="brand-txt">
          <span class="brand-name">Dépannage Auto Nice</span>
          <span class="brand-sub">${t.brandSub}</span>
        </span>
      </a>
      <button type="button" class="menu-btn" aria-expanded="false" aria-controls="nav">
        <svg class="ic ic-sm i-open" aria-hidden="true"><use href="img/icons.svg#i-menu"/></svg>
        <svg class="ic ic-sm i-close" aria-hidden="true"><use href="img/icons.svg#i-x"/></svg>
        <span class="menu-label">${t.menu}</span>
      </button>
      <nav class="nav" id="nav" aria-label="${t.navAria}">
        ${nav}
        <span class="langs" role="group" aria-label="${t.langAria}">${langs}</span>
      </nav>
      <div class="hd-actions">
        <a href="tel:${TEL_HREF}" class="hd-call" aria-label="${t.callAria} ${tel}"><small>${t.urgence}</small><strong>${tel}</strong></a>
        <a href="demande.html" class="hd-cta">${ic('file', 'ic-sm')}${t.headCta}</a>
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
        <p>${t.footAddr}</p>
        <a class="ft-tel" href="tel:${TEL_HREF}">${tel}</a>
      </div>
      <nav class="ft-col" aria-label="${t.ftSite}">
        <p class="ft-h">${t.ftSite}</p>
        ${Object.keys(t.ftLinks).filter(k => route(k)).map(k => `<a href="${to(route(k))}">${t.ftLinks[k]}</a>`).join('\n        ')}
      </nav>
      <nav class="ft-col" aria-label="${t.ftAct}">
        <p class="ft-h">${t.ftAct}</p>
        <a href="demande.html">${t.demande}</a>
        <a href="diagnostic.html">${t.diag}</a>
        <a href="${to(R.contact)}">${t.contact}</a>
        <a href="cgv.html">${t.cgv}</a>
        <a href="mentions-legales.html">${t.legal}</a>
      </nav>
    </div>
    <p class="ft-copy">© <span id="year">2026</span> Dépannage Auto Nice · ${t.noCookie}</p>
  </footer>

  <div class="rail" aria-label="${t.quick}" role="navigation">
    <a href="tel:${TEL_HREF}" class="rail-call"><small>${t.railCall}</small><strong>${tel}</strong></a>
    <a href="demande.html" class="rail-btn rail-dem">${ic('file', 'ic-sm')}${t.railDem}</a>
    <a href="${wa}" class="rail-btn rail-wa" rel="noopener">${ic('message', 'ic-sm')}WhatsApp</a>
    <a href="#main" class="rail-top" aria-label="${t.top}">${ic('arrow-up', 'ic-sm')}</a>
  </div>

  <div class="bar" aria-label="${t.quick}" role="navigation">
    <a href="tel:${TEL_HREF}" class="bar-call" aria-label="${t.callAria} ${tel}"><small>${t.barCall}</small><strong>${tel}</strong></a>
    <a href="demande.html">${ic('file', 'ic-sm')}${t.barDem}</a>
    <a href="${wa}" rel="noopener">${ic('message', 'ic-sm')}WhatsApp</a>
    <a href="#main" class="bar-top" aria-label="${t.top}">${ic('arrow-up', 'ic-sm')}</a>
  </div>

  <script src="config.js"></script>
  <script src="js/mesure.js"></script>
${p.leaflet ? '  <script src="js/leaflet.js"></script>\n' : ''}  <script src="site.js"></script>
</body>
</html>
`;
}

function fill(p, src) {
  const lang = p.lang || 'fr';
  const t = I18N.T[lang];
  const nom = v => I18N.nomVille(lang, v.slug, v.nom);
  return src
    .replace(/\{\{ic:([a-z-]+)(?::([a-z- ]+))?\}\}/g, (_, n, c) => ic(n, c))
    .replace(/\{\{TEL_HREF\}\}/g, TEL_HREF)
    .replace(/\{\{TEL\}\}/g, t.tel)
    .replace(/\{\{WA\}\}/g, waLink(lang))
    .replace('{{FAQ_LIST}}', p.faq ? faqHtml(faqListe(lang, p.faq)) : '')
    .replace('{{FAQ_GROUPES}}', () => FAQ_GROUPES.map(g => `<section class="wrap sec" aria-labelledby="h-f-${g.id}">
  <h2 class="sec-t" id="h-f-${g.id}">${g.titre}</h2>
  <div class="faq">
${faqHtml(g.items, g === FAQ_GROUPES[0])}
  </div>
</section>`).join('\n\n'))
    .replace('{{TARIFS_TABLES}}', () => `<script type="application/json" id="tarifsData">${JSON.stringify(estimData(lang)).replace(/</g, '\\u003c')}</script>\n\n` + tarifsTables(lang))
    .replace('{{PAIEMENT}}', () => paiementHtml(lang))
    .replace('{{SERVICES_GRID}}', () => SCATS.map(c => `<section class="wrap sec svc-cat" aria-labelledby="h-c-${c.id}">
  <h2 class="sec-t" id="h-c-${c.id}">${c.titre}</h2>
  <p class="sec-sub">${c.sub}</p>
  <div class="grid grid-wide svc-list">
${SERVICES.filter(x => x.cat === c.id).map(x => `    <a class="cell cell-link" href="${x.slug}.html">${ic(x.ic)}<h3>${x.nom}</h3><p>${x.resume}</p><span class="svc-meta"><span>${x.prix}</span><span>Voir →</span></span></a>`).join('\n')}
  </div>
</section>`).join('\n\n'))
    .replace('{{ESTIM_PRESTAS}}', () => TARIFS.surPlace.map(s => `<option value="${s.id}">${s.nom[lang]}</option>`).join(''))
    .replace('{{ESTIM_VILLES}}', () => estimData(lang).villes.map((v, i) => `<option value="${v.km}"${i === 0 ? ' selected' : ''}>${v.nom}</option>`).join(''))
    .replace(/\{\{V:([a-z-]+)\}\}/g, (_, slug) => {
      const v = villes.find(x => x.slug === slug);
      if (!v) throw new Error(`ville inconnue : ${slug}`);
      return `<a href="ville-${v.slug}.html">${nom(v)}</a> <span class="delai">(${I18N.delai(lang, v.delai)})</span>`;
    })
    // Titre de l'accueil : chaque ville avec SON délai (villes.json). Afficher
    // « 30 à 60 minutes » pour Grasse serait faux : c'est 50 min à 1 h 20.
    .replace('{{HERO_VILLES}}', () => escAttr(JSON.stringify([
      { s: 'nice', v: I18N.nomVille(lang, 'nice', 'Nice'), d: I18N.DELAI_NICE[lang] },
      ...[...villes].sort((x, y) => x.distanceKm - y.distanceKm).map(v => ({ s: v.slug, v: nom(v), d: I18N.delai(lang, v.delai) })),
    ])))
    .replace('{{ZONE_CHIPS}}', villes.map(v =>
      `    <li><a href="ville-${v.slug}.html">${nom(v)}</a></li>`).join('\n'));
}

// Assemble et écrit une page ; réutilisé par build-villes.js pour que les
// pages ville partagent exactement l'en-tête, le pied et les actions.
function writePage(p, src) {
  let html = layout(p, fill(p, src).replace(/^/gm, '    ').replace(/^ +$/gm, ''));
  // Pages traduites (sous-dossier) : les liens vers les pages de la même
  // langue restent tels quels ; tout le reste (styles, images, pages en
  // français : demande, villes, mentions) remonte d'un dossier.
  if (p.lang && p.lang !== 'fr') {
    const propres = new Set(Object.values(I18N.ROUTES[p.lang]).map(f => path.basename(f)));
    html = html.replace(/\b(href|src)="(?!https?:|tel:|mailto:|data:|#|\/|\.\.\/)([^"]*)"/g,
      (m, attr, u) => propres.has(u.split(/[?#]/)[0]) ? m : `${attr}="../${u}"`);
  }
  if (p.base) {
    html = html.replace(/\b(href|src)="(?!https?:|tel:|mailto:|data:|#|\/)/g, `$1="${p.base}`);
  }
  const left = html.match(/\{\{[^}]+\}\}/);
  if (left) throw new Error(`${p.file} : jeton non remplacé ${left[0]}`);
  fs.mkdirSync(path.dirname(path.join(ROOT, p.file)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, p.file), html);
  console.log('écrit :', p.file);
}

if (require.main === module) {
  for (const p of PAGES) writePage(p, fs.readFileSync(path.join(__dirname, 'pages', p.frag), 'utf8'));
}

module.exports = { PAGES, writePage, ic };
