// =============================================
// Traductions de la mise en page (anglais, italien) — utilisé par
// tools/build-pages.js. Le contenu de chaque page traduite vit dans
// tools/pages/en/ et tools/pages/it/.
//
// Règle d'honnêteté : les pages traduites ne disent pas que l'équipe parle
// anglais ou italien au téléphone (non confirmé par le gérant). Elles
// proposent WhatsApp, où un message écrit se traduit facilement.
// Le formulaire de demande et le diagnostic restent en français : les
// liens qui y mènent le signalent.
// =============================================

// Adresse de chaque page, par langue. La clé relie les traductions entre
// elles (sélecteur de langue, balises hreflang).
const ROUTES = {
  fr: { accueil: 'index.html', services: 'services.html', zone: 'zone.html', faq: 'faq.html', 'a-propos': 'a-propos.html', contact: 'contact.html' },
  en: { accueil: 'en/index.html', services: 'en/services.html', zone: 'en/service-area.html', faq: 'en/faq.html', 'a-propos': 'en/about.html', contact: 'en/contact.html' },
  it: { accueil: 'it/index.html', services: 'it/servizi.html', zone: 'it/zona.html', faq: 'it/faq.html', 'a-propos': 'it/chi-siamo.html', contact: 'it/contatti.html' },
};

const LANGS = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'it', label: 'IT', name: 'Italiano' },
];

const T = {
  fr: {
    locale: 'fr_FR', inLang: 'fr-FR', skip: 'Aller au contenu', home: 'Accueil',
    brandSub: 'Remorquage &amp; dépannage · 7j/7 24h/24', menu: 'Menu', navAria: 'Navigation principale', langAria: 'Langue',
    nav: { services: 'Services', zone: 'Zone', faq: 'FAQ', 'a-propos': 'À propos', contact: 'Contact' },
    tel: '06 17 68 42 70', urgence: 'Urgence 24h/24', callAria: 'Appeler le', headCta: 'Demander',
    footAddr: 'Zone industrielle du Quai de la Blanquière, Nice.<br>Équipe niçoise depuis 2004, toutes assurances.',
    ftSite: 'Le site', ftAct: 'Agir',
    ftLinks: { accueil: 'Accueil', services: 'Nos services', zone: "Zone d'intervention", faq: 'Questions fréquentes', 'a-propos': "À propos de l'équipe" },
    demande: 'Demander un dépannage', diag: 'Diagnostic pneus gratuit', contact: 'Contact', legal: 'Mentions légales',
    quick: 'Contact rapide', railCall: 'Appeler 24h/24', railDem: 'Demander un dépannage', top: 'Remonter en haut de page',
    barCall: 'Appeler', barDem: 'Demande',
    wa: "Bonjour, j'ai besoin d'un dépannage. Je suis à : ",
  },
  en: {
    locale: 'en_GB', inLang: 'en-GB', skip: 'Skip to content', home: 'Home',
    brandSub: 'Towing &amp; roadside assistance · 24/7', menu: 'Menu', navAria: 'Main navigation', langAria: 'Language',
    nav: { services: 'Services', zone: 'Area', faq: 'FAQ', 'a-propos': 'About', contact: 'Contact' },
    tel: '+33 6 17 68 42 70', urgence: 'Emergency 24/7', callAria: 'Call', headCta: 'Online form',
    footAddr: 'Industrial zone, Quai de la Blanquière, Nice.<br>A Nice-based team since 2004, all insurers.',
    ftSite: 'This site', ftAct: 'Get help',
    ftLinks: { accueil: 'Home', services: 'Our services', zone: 'Service area', faq: 'FAQ', 'a-propos': 'About the team' },
    demande: 'Online request (in French)', diag: 'Free tyre check (in French)', contact: 'Contact', legal: 'Legal notice (in French)',
    quick: 'Quick contact', railCall: 'Call 24/7', railDem: 'Online request (FR)', top: 'Back to top',
    barCall: 'Call', barDem: 'Form',
    wa: 'Hello, I need roadside assistance. I am at: ',
  },
  it: {
    locale: 'it_IT', inLang: 'it-IT', skip: 'Vai al contenuto', home: 'Home',
    brandSub: 'Soccorso stradale · 24 ore su 24', menu: 'Menu', navAria: 'Navigazione principale', langAria: 'Lingua',
    nav: { services: 'Servizi', zone: 'Zona', faq: 'FAQ', 'a-propos': 'Chi siamo', contact: 'Contatti' },
    tel: '+33 6 17 68 42 70', urgence: 'Urgenze 24h/24', callAria: 'Chiama il', headCta: 'Modulo online',
    footAddr: 'Zona industriale del Quai de la Blanquière, Nizza.<br>Squadra nizzarda dal 2004, tutte le assicurazioni.',
    ftSite: 'Il sito', ftAct: 'Aiuto',
    ftLinks: { accueil: 'Home', services: 'I nostri servizi', zone: "Zona d'intervento", faq: 'Domande frequenti', 'a-propos': 'Chi siamo' },
    demande: 'Richiesta online (in francese)', diag: 'Diagnosi pneumatici (in francese)', contact: 'Contatti', legal: 'Note legali (in francese)',
    quick: 'Contatto rapido', railCall: 'Chiama 24h/24', railDem: 'Richiesta online (FR)', top: 'Torna su',
    barCall: 'Chiama', barDem: 'Modulo',
    wa: 'Buongiorno, ho bisogno di un soccorso stradale. Mi trovo a: ',
  },
};

// Noms de ville propres à une langue (exonymes italiens).
const NOMS = { it: { nice: 'Nizza', menton: 'Mentone' } };
const nomVille = (lang, slug, nom) => (NOMS[lang] && NOMS[lang][slug]) || nom;

// « 45 min à 1 h 15 » → « 45 min–1 h 15 » : lisible en anglais comme en italien.
const delai = (lang, d) => lang === 'fr' ? d : d.replace(' à ', '–');
const DELAI_NICE = { fr: '30 à 60 minutes', en: '30–60 minutes', it: '30–60 minuti' };

// ── Questions fréquentes traduites ────────────
const FAQ = {
  en: [
    ['How quickly can you get to me?',
      `<p>We reach you within 30 minutes to 1 hour in Nice and the surrounding area. Further out in the Alpes-Maritimes, the time depends on the hour and the traffic: it is given to you on the phone before the tow truck sets off.</p>`],
    ['Will my insurance cover the breakdown call-out?',
      `<p>In most cases, yes. We work with all car insurers. If your policy includes breakdown assistance, tell us when you call: we check with you what is covered before we start, and we often handle the claim for you.</p>`],
    ['Do you work at night and at weekends?',
      `<p>Yes. We are available 7 days a week, 24 hours a day, including nights, weekends and public holidays. A technician answers — there is no answering machine.</p>`],
    ['What vehicles do you handle?',
      `<p>Cars, SUVs, people carriers, light vans, motorbikes and scooters. For lorries or special vehicles, contact us to check feasibility.</p>`],
    ['I have broken down on the motorway. What should I do?',
      `<p>Put on your high-visibility vest, switch on your hazard lights and get behind the safety barrier, away from the vehicle. On French motorways, recovery must be carried out by the operator approved for that network: use an emergency call box or dial 112.</p>`],
    ['How is the price set?',
      `<p>The starting rate is €70 in Nice and the neighbouring towns. Further out, a quote is given to you on the phone before the tow truck leaves. The price quoted is the price charged: no extra on arrival.</p>`],
    ['Do you speak English?',
      `<p>Our team speaks French. If a phone call is difficult, send us a WhatsApp message with your location and a short description: written messages are easy to translate on both sides.</p>`],
  ],
  it: [
    ['In quanto tempo arrivate?',
      `<p>Interveniamo in 30 minuti – 1 ora a Nizza e dintorni. Per i comuni più lontani delle Alpi Marittime, il tempo dipende dall'ora e dal traffico: ve lo comunichiamo al telefono prima della partenza del carro attrezzi.</p>`],
    ["L'assicurazione copre il soccorso?",
      `<p>Nella maggior parte dei casi, sì. Lavoriamo con tutte le compagnie assicurative auto. Se la vostra polizza comprende l'assistenza stradale, ditecelo al telefono: verifichiamo con voi cosa è coperto prima di intervenire, e spesso gestiamo noi la pratica.</p>`],
    ['Intervenite di notte e nel fine settimana?',
      `<p>Sì. Siamo disponibili 7 giorni su 7, 24 ore su 24, notti, fine settimana e festivi compresi. Risponde un tecnico — nessuna segreteria.</p>`],
    ['Quali veicoli trattate?',
      `<p>Auto, SUV, monovolume, furgoni leggeri, moto e scooter. Per mezzi pesanti o veicoli speciali, contattateci per verificare la fattibilità.</p>`],
    ['Sono in panne in autostrada: cosa devo fare?',
      `<p>Indossate il gilet ad alta visibilità, accendete le luci di emergenza e mettetevi dietro il guardrail, lontano dal veicolo. Sulle autostrade francesi il soccorso è riservato all'operatore autorizzato della rete: usate una colonnina SOS oppure chiamate il 112.</p>`],
    ['Come viene stabilito il prezzo?',
      `<p>La tariffa di partenza è di 70&nbsp;€ a Nizza e nei comuni vicini. Più lontano, il preventivo vi viene comunicato al telefono prima che il carro attrezzi parta. Il prezzo annunciato è il prezzo fatturato: nessun supplemento all'arrivo.</p>`],
    ['Parlate italiano?',
      `<p>La nostra squadra parla francese. Se una telefonata è difficile, mandateci un messaggio WhatsApp con la vostra posizione e una breve descrizione: un messaggio scritto si traduce facilmente, da entrambe le parti.</p>`],
  ],
};

// ── Titres et descriptions des pages traduites ─
const META = {
  en: {
    accueil: { title: 'Breakdown & towing in Nice, 24/7 | +33 6 17 68 42 70', desc: 'Tow truck in Nice within 30–60 min, 24/7. Roadside repair, towing and vehicle transport across the Alpes-Maritimes. Price given before we set off, from €70.' },
    services: { title: 'Our services — Breakdown & towing in Nice', desc: 'Towing, roadside repair, wrong fuel, flat tyre, battery, overheating: diagnosis on the spot and price given before any work. 24/7 in Nice and the Alpes-Maritimes.', crumb: 'Our services' },
    zone: { title: 'Service area: all of the Alpes-Maritimes — Breakdown in Nice', desc: '30–60 min in Nice and the neighbouring towns, and across the whole Alpes-Maritimes: Cannes, Antibes, Menton, Grasse. Arrival time given before we set off.', crumb: 'Service area' },
    faq: { title: 'FAQ — Breakdown & towing in Nice', desc: 'Arrival time, price, insurance, motorways, vehicles, language: what drivers ask most before calling a breakdown service in Nice.', crumb: 'FAQ' },
    'a-propos': { title: 'About us — a Nice-based team | Breakdown in Nice', desc: 'A local team, not a platform: workshop at Quai de la Blanquière in Nice, breakdown and towing 24/7 across the Alpes-Maritimes.', crumb: 'About' },
    contact: { title: 'Contact — Breakdown & towing in Nice | +33 6 17 68 42 70', desc: 'Broken down now: call +33 6 17 68 42 70, 24/7, or message us on WhatsApp with your location. Workshop at Quai de la Blanquière, Nice.', crumb: 'Contact' },
  },
  it: {
    accueil: { title: 'Soccorso stradale a Nizza, 24 ore su 24 | +33 6 17 68 42 70', desc: 'Carro attrezzi a Nizza in 30–60 minuti, 24 ore su 24. Riparazione sul posto, traino e trasporto in tutte le Alpi Marittime. Prezzo comunicato prima della partenza, da 70 €.' },
    services: { title: 'I nostri servizi — Soccorso stradale a Nizza', desc: 'Traino, riparazione sul posto, carburante sbagliato, pneumatico, batteria, surriscaldamento: diagnosi sul posto e prezzo comunicato prima di intervenire.', crumb: 'I nostri servizi' },
    zone: { title: "Zona d'intervento: tutte le Alpi Marittime — Soccorso a Nizza", desc: '30–60 minuti a Nizza e nei comuni vicini, e in tutte le Alpi Marittime: Cannes, Antibes, Mentone, Grasse. Tempo di arrivo comunicato prima della partenza.', crumb: "Zona d'intervento" },
    faq: { title: 'Domande frequenti — Soccorso stradale a Nizza', desc: "Tempi, prezzo, assicurazione, autostrada, veicoli, lingua: le domande più frequenti prima di chiamare un soccorso stradale a Nizza.", crumb: 'Domande frequenti' },
    'a-propos': { title: 'Chi siamo — una squadra nizzarda | Soccorso a Nizza', desc: 'Una squadra locale, non una piattaforma: officina al Quai de la Blanquière a Nizza, soccorso e traino 24 ore su 24 in tutte le Alpi Marittime.', crumb: 'Chi siamo' },
    contact: { title: 'Contatti — Soccorso stradale a Nizza | +33 6 17 68 42 70', desc: 'In panne adesso: chiamate il +33 6 17 68 42 70, 24 ore su 24, o scriveteci su WhatsApp con la vostra posizione. Officina al Quai de la Blanquière, Nizza.', crumb: 'Contatti' },
  },
};

module.exports = { ROUTES, LANGS, T, NOMS, nomVille, delai, DELAI_NICE, FAQ, META };
