#!/usr/bin/env node
// =============================================
// Génère les pages services (une par prestation), les guides et la page
// d'accueil des guides (conseils.html), à partir de tools/services.js et
// tools/guides.js. Même mise en page que le reste du site (writePage).
//
//   node tools/build-contenu.js      (lancé par « npm run build »)
// =============================================

const { writePage } = require('./build-pages');
const { CATS: SCATS, SERVICES } = require('./services');
const { CATS: GCATS, GUIDES, MAJ } = require('./guides');
const { site } = require('./villes.json');

const B = site.base;
const plain = s => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
// Typographie française : espace insécable avant ? : ! ; (hors balises).
const fine = s => String(s).replace(/(>[^<]*)/g, m => m.replace(/ ([?:!;])/g, '&nbsp;$1'));
const fineTxt = s => String(s).replace(/ ([?:!;])/g, '&nbsp;$1');
const esc = s => String(s).replace(/&(?!(amp|lt|gt|quot|nbsp|#\d+);)/g, '&amp;').replace(/</g, '&lt;');

const guideParSlug = Object.fromEntries(GUIDES.map(g => [g.slug, g]));
const serviceParSlug = Object.fromEntries(SERVICES.map(s => [s.slug, s]));
const verifier = (liste, table, ou) => liste.forEach(x => { if (!table[x]) throw new Error(`${ou} : lien vers « ${x} » introuvable`); });

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});
const faqSchema = (faq, url) => ({
  '@type': 'FAQPage', '@id': `${url}#faq`,
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: plain(q), acceptedAnswer: { '@type': 'Answer', text: plain(a) } })),
});
const faqHtml = faq => faq.map(([q, a], i) =>
  `    <details name="faq"${i === 0 ? ' open' : ''}><summary>${fineTxt(q)}{{ic:chevron}}</summary><div><p>${fineTxt(a)}</p></div></details>`).join('\n');

// ── Pages services ─────────────────────────
function pageService(s) {
  verifier(s.guides, guideParSlug, s.slug);
  const url = `${B}/${s.slug}.html`;
  const demande = `demande.html?type=${s.type}${s.quand ? '&amp;quand=plus-tard' : ''}`;
  const estim = s.estim ? `tarifs.html?${s.estim}#estimer` : (['epave', 'gardiennage', 'longue', 'treuillage', 'clim', 'diag-atelier'].includes(s.presta) ? 'tarifs.html#h-g-autres' : `tarifs.html?presta=${s.presta}#estimer`);
  const cat = SCATS.find(c => c.id === s.cat);
  const memes = SERVICES.filter(o => o.cat === s.cat && o.slug !== s.slug);
  const prixNum = (s.prix.match(/(\d+)/) || [])[1];

  const contenu = `<section class="wrap intro">
  <a href="services.html" class="back">← Tous les services</a>
  <p class="kicker">${cat.titre}</p>
  <h1>${s.h1}</h1>
  <p class="lead">${s.intro}</p>
  <div class="btns">
    <a href="tel:{{TEL_HREF}}" class="btn btn-orange">{{ic:phone}}Appeler le {{TEL}}</a>
    <a href="${demande}" class="btn btn-dark">{{ic:${s.quand ? 'calendar' : 'file'}}}${s.quand ? 'Prendre rendez-vous' : 'Demander en ligne'}</a>
  </div>
</section>

<section class="wrap" aria-label="${esc(plain(s.nom))} en bref">
  <div class="facts">
    <div class="fact"><b>${s.prix.replace(/^dès /, 'Dès ')}</b><span><a href="${estim}">Prix TTC, voir la grille</a></span></div>
    <div class="fact"><b>${s.quand ? 'Sur rendez-vous' : '24h/24 · 7j/7'}</b><span>${s.quand ? 'À la date qui vous convient' : 'Nuits, dimanches, jours fériés'}</span></div>
    <div class="fact"><b>${s.quand ? 'Tout le 06' : '30 – 60 min'}</b><span>${s.quand ? 'Depuis l\'atelier de Nice' : 'Délai estimé sur Nice'}</span></div>
  </div>
</section>

<section class="wrap sec" aria-labelledby="h-comment">
  <h2 class="sec-t" id="h-comment">Comment on intervient</h2>
  <ol class="steps">
    ${s.etapes.map((e, i) => `<li><span class="step-n">${String(i + 1).padStart(2, '0')}</span><p>${e}</p></li>`).join('\n    ')}
  </ol>
</section>

<section class="wrap sec" aria-labelledby="h-attente">
  <div class="aside">
    <h2 id="h-attente">${s.quand ? 'Avant le rendez-vous' : 'En attendant la dépanneuse'}</h2>
    <ul>
      ${s.attente.map(a => `<li>${a}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="wrap sec" aria-labelledby="h-faq">
  <h2 class="sec-t" id="h-faq">Questions fréquentes</h2>
  <div class="faq">
${faqHtml(s.faq)}
  </div>
</section>

<section class="wrap sec" aria-labelledby="h-guides">
  <h2 class="sec-t" id="h-guides">Nos guides sur le sujet</h2>
  <ul class="links">
    ${s.guides.map(g => `<li><a href="${g}.html">{{ic:book}}<span>${fineTxt(guideParSlug[g].titre)}</span></a></li>`).join('\n    ')}
  </ul>
</section>

<section class="wrap sec" aria-labelledby="h-memes">
  <h2 class="sec-t" id="h-memes">${cat.titre} : nos autres services</h2>
  <ul class="chips">
    ${memes.map(o => `<li><a href="${o.slug}.html">${o.nom}</a></li>`).join('\n    ')}
    <li><a href="services.html">Tous les services</a></li>
  </ul>
</section>

<section class="wrap sec sec-end" aria-labelledby="h-band">
  <div class="band">
    <div>
      <h2 id="h-band">${s.quand ? 'Fixons une date' : 'Besoin de nous maintenant&nbsp;?'}</h2>
      <p>Prix ferme annoncé avant le départ. Carte, Apple&nbsp;Pay, Google&nbsp;Pay ou espèces.</p>
    </div>
    <a href="tel:{{TEL_HREF}}" class="btn btn-orange">{{ic:phone}}Appeler le {{TEL}}</a>
  </div>
</section>
`;
  const service = {
    '@type': 'Service', '@id': `${url}#service`, name: plain(s.nom), description: plain(s.desc),
    serviceType: plain(s.nom), provider: { '@id': `${B}/#business` },
    areaServed: [{ '@type': 'City', name: 'Nice' }, { '@type': 'AdministrativeArea', name: 'Alpes-Maritimes' }],
    availableChannel: { '@type': 'ServiceChannel', servicePhone: { '@type': 'ContactPoint', telephone: site.telIntl, contactType: 'emergency' }, serviceUrl: `${B}/#demande` },
  };
  if (prixNum) service.offers = { '@type': 'Offer', priceCurrency: 'EUR', priceSpecification: { '@type': 'PriceSpecification', minPrice: +prixNum, priceCurrency: 'EUR', valueAddedTaxIncluded: true } };
  if (/^Gratuit/.test(s.prix)) service.offers = { '@type': 'Offer', price: 0, priceCurrency: 'EUR' };
  writePage({
    file: `${s.slug}.html`, path: `/${s.slug}.html`, nav: 'services', title: s.titre, desc: s.desc,
    schema: () => [service, crumbs([['Accueil', `${B}/`], ['Services', `${B}/services.html`], [plain(s.nom), url]]), faqSchema(s.faq, url)],
  }, contenu);
}

// ── Guides ─────────────────────────────────
function pageGuide(g) {
  verifier(g.services, serviceParSlug, g.slug);
  const url = `${B}/${g.slug}.html`;
  const cat = GCATS.find(c => c.id === g.cat);
  const autres = GUIDES.filter(o => o.slug !== g.slug && o.cat === g.cat).slice(0, 5);
  const contenu = `<section class="wrap intro">
  <a href="conseils.html" class="back">← Guides et conseils</a>
  <p class="kicker">${cat.titre} · ${g.min}&nbsp;min de lecture</p>
  <h1>${fineTxt(esc(g.titre))}</h1>
  <p class="lead">${fineTxt(esc(g.desc))}</p>
</section>

<section class="wrap sec" aria-labelledby="h-essentiel">
  <div class="essentiel">
    <h2 id="h-essentiel">{{ic:check}}L'essentiel</h2>
    <ul>
      ${g.essentiel.map(e => `<li>${fineTxt(esc(e))}</li>`).join('\n      ')}
    </ul>
    <p>En panne maintenant&nbsp;? <a href="tel:{{TEL_HREF}}">Appelez le {{TEL}}</a>, 24h/24.</p>
  </div>
</section>

<section class="wrap sec">
  <article class="prose">
${fine(g.corps.trim())}
    <p class="maj">Mis à jour le ${new Date(MAJ + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}. Informations générales&nbsp;: votre contrat, le manuel de votre véhicule et les consignes des secours priment.</p>
  </article>
</section>
${g.faq ? `
<section class="wrap sec" aria-labelledby="h-faq">
  <h2 class="sec-t" id="h-faq">Questions fréquentes</h2>
  <div class="faq">
${faqHtml(g.faq)}
  </div>
</section>
` : ''}
<section class="wrap sec" aria-labelledby="h-services">
  <h2 class="sec-t" id="h-services">Nos services liés</h2>
  <div class="grid">
    ${g.services.map(sl => { const s = serviceParSlug[sl]; return `<a class="cell cell-link" href="${sl}.html">{{ic:${s.ic}}}<h3>${s.nom}</h3><p>${s.resume}</p><span class="svc-meta">${s.prix}</span></a>`; }).join('\n    ')}
  </div>
</section>

<section class="wrap sec" aria-labelledby="h-autres">
  <h2 class="sec-t" id="h-autres">À lire aussi</h2>
  <ul class="links">
    ${autres.map(o => `<li><a href="${o.slug}.html">{{ic:book}}<span>${fineTxt(esc(o.titre))}</span></a></li>`).join('\n    ')}
    <li><a href="conseils.html">{{ic:arrow-right}}<span>Tous les guides</span></a></li>
  </ul>
</section>

<section class="wrap sec sec-end" aria-labelledby="h-band">
  <div class="band">
    <div>
      <h2 id="h-band">Une panne en cours&nbsp;?</h2>
      <p>Un technicien décroche, 7j/7 24h/24. Prix ferme annoncé avant le départ.</p>
    </div>
    <a href="tel:{{TEL_HREF}}" class="btn btn-orange">{{ic:phone}}Appeler le {{TEL}}</a>
  </div>
</section>
`;
  const article = {
    '@type': 'Article', '@id': `${url}#article`, headline: plain(g.titre).slice(0, 110), description: plain(g.desc),
    inLanguage: 'fr-FR', datePublished: MAJ, dateModified: MAJ, mainEntityOfPage: url,
    image: `${B}/img/og-cover.jpg`,
    author: { '@type': 'Organization', name: site.nom, url: `${B}/` },
    publisher: { '@id': `${B}/#business` },
  };
  writePage({
    file: `${g.slug}.html`, path: `/${g.slug}.html`, nav: 'conseils', title: `${plain(g.title)} | ${site.nom}`, desc: g.desc,
    schema: () => [article, crumbs([['Accueil', `${B}/`], ['Guides et conseils', `${B}/conseils.html`], [plain(g.titre), url]]), ...(g.faq ? [faqSchema(g.faq, url)] : [])],
  }, contenu);
}

// ── Accueil des guides ─────────────────────
function pageConseils() {
  const url = `${B}/conseils.html`;
  const contenu = `<section class="wrap intro">
  <a href="index.html" class="back">← Accueil</a>
  <h1>Guides et conseils</h1>
  <p class="lead">Que faire en pleine panne, comprendre ce qui se passe, savoir qui paie&nbsp;: ${GUIDES.length} guides écrits par l'équipe, sans jargon. En urgence, appelez d'abord&nbsp;: le <a href="tel:{{TEL_HREF}}">{{TEL}}</a> répond 24h/24.</p>
</section>
${GCATS.map(c => `
<section class="wrap sec" aria-labelledby="h-${c.id}">
  <h2 class="sec-t" id="h-${c.id}">${c.titre}</h2>
  <p class="sec-sub">${c.sub}</p>
  <div class="grid grid-wide">
    ${GUIDES.filter(g => g.cat === c.id).map(g => `<a class="cell cell-link" href="${g.slug}.html">{{ic:${g.ic}}}<h3>${fineTxt(esc(g.titre))}</h3><p>${fineTxt(esc(g.desc))}</p><span class="svc-meta">${g.min} min de lecture</span></a>`).join('\n    ')}
  </div>
</section>`).join('\n')}

<section class="wrap sec sec-end" aria-labelledby="h-band">
  <div class="band">
    <div>
      <h2 id="h-band">Vous ne trouvez pas votre réponse&nbsp;?</h2>
      <p>Consultez les <a href="faq.html">questions fréquentes</a> ou appelez-nous&nbsp;: un technicien décroche.</p>
    </div>
    <a href="tel:{{TEL_HREF}}" class="btn btn-orange">{{ic:phone}}Appeler le {{TEL}}</a>
  </div>
</section>
`;
  writePage({
    file: 'conseils.html', path: '/conseils.html', nav: 'conseils',
    title: `Guides et conseils panne auto — ${site.nom}`,
    desc: 'Panne, batterie, pneu crevé, erreur de carburant, autoroute A8, tunnel, accident, assurance, épave : nos guides pratiques pour réagir et savoir qui paie.',
    schema: () => [
      { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: 'Guides et conseils', inLanguage: 'fr-FR',
        hasPart: GUIDES.map(g => ({ '@type': 'Article', headline: plain(g.titre).slice(0, 110), url: `${B}/${g.slug}.html` })) },
      crumbs([['Accueil', `${B}/`], ['Guides et conseils', url]]),
    ],
  }, contenu);
}

SERVICES.forEach(pageService);
GUIDES.forEach(pageGuide);
pageConseils();
