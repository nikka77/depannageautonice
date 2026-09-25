#!/usr/bin/env node
// =============================================
// Génère llms.txt et donnees.json : un résumé factuel du service, destiné
// aux assistants IA (ChatGPT, Perplexity, Google IA…) et aux moteurs.
//
//   node tools/build-llms.js      (lancé par « npm run build »)
//
// Tout vient des mêmes données que le site (villes.json, tarifs.js,
// services.js, guides.js) : ce qui est dit aux IA ne peut pas
// contredire ce qui est affiché. Format llms.txt : https://llmstxt.org
// =============================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const lire = f => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')); } catch { return null; } };
const { site, villes } = lire('villes.json');
const T = require('./tarifs');
const tarifs = { principe: T.principe.fr, paiement: T.paiement.fr, groupes: T.groupes('fr') };
const services = require('./services').SERVICES.map(s => ({ ...s, nom: s.nom.replace(/&nbsp;/g, ' '), resume: s.resume.replace(/&nbsp;/g, ' ') }));
const guides = require('./guides').GUIDES.map(g => ({ slug: g.slug, titre: g.titre, desc: g.desc }));
const B = site.base;
const today = new Date().toISOString().slice(0, 10);

const zone = [
  { ville: 'Nice', delai: '30 à 60 min' },
  ...[...villes].sort((a, b) => a.distanceKm - b.distanceKm).map(v => ({ ville: v.nom, cp: v.cp, distanceKm: v.distanceKm, delai: v.delai, page: `${B}/ville-${v.slug}.html` })),
];

const data = {
  version: today,
  source: `${B}/`,
  note: 'Données publiées par l\'entreprise. Délais : estimations liées au trafic, pas des garanties. Prix TTC.',
  entreprise: {
    nom: site.nom,
    activite: 'Dépannage, remorquage et transport de véhicules',
    depuis: 2004,
    atelier: 'Zone industrielle du Quai de la Blanquière, 06000 Nice, France',
    modele: 'Entreprise locale : l\'équipe qui répond au téléphone est celle qui se déplace (pas une plateforme d\'intermédiation).',
  },
  contact: {
    telephone: site.tel, telephoneInternational: site.telIntl,
    whatsapp: 'https://wa.me/33617684270',
    demandeEnLigne: `${B}/demande.html`,
    langues: 'Équipe francophone. Pour l\'anglais ou l\'italien, WhatsApp est conseillé (message écrit facile à traduire).',
  },
  disponibilite: '7 jours sur 7, 24 heures sur 24, jours fériés compris',
  zone: { departement: 'Alpes-Maritimes (06)', delais: zone },
  paiement: tarifs.paiement,
  tarifs: tarifs ? {
    principe: tarifs.principe,
    page: `${B}/tarifs.html`,
    lignes: tarifs.groupes.flatMap(g => g.lignes.map(l => ({ groupe: g.titre, prestation: l.nom, prix: l.prix, detail: l.detail || undefined }))),
  } : { principe: 'À partir de 70 € sur Nice. Prix ferme annoncé au téléphone avant le départ.' },
  services: services ? services.map(s => ({ nom: s.nom, resume: s.resume, prix: s.prix, page: `${B}/${s.slug}.html` })) : undefined,
  limites: [
    'Autoroutes concédées (A8…) : seul le dépanneur agréé du réseau peut intervenir ; utiliser une borne d\'appel ou le 112.',
  ],
  guides: guides ? guides.map(g => ({ titre: g.titre, page: `${B}/${g.slug}.html` })) : undefined,
};
fs.writeFileSync(path.join(ROOT, 'donnees.json'), JSON.stringify(data, null, 2) + '\n');

const ligne = (t, u, d) => `- [${t}](${u})${d ? ': ' + d : ''}`;
const txt = `# ${site.nom}

> Dépannage, remorquage et transport de véhicules à Nice et dans les Alpes-Maritimes, 7j/7 24h/24. Entreprise niçoise depuis 2004, atelier Quai de la Blanquière à Nice. Téléphone : ${site.tel} (${site.telIntl}). Prix ferme annoncé avant le départ, à partir de 70 € TTC sur Nice.

Faits utiles :

- Disponibilité : 24h/24, 7j/7, jours fériés compris. Un technicien décroche.
- Délai estimé : 30 à 60 min sur Nice ; ${zone.slice(1).map(z => `${z.ville} ${z.delai}`).join(' ; ')}. Estimations, selon le trafic.
- Paiement : ${data.paiement.join(', ')}.
- Véhicules : voitures, SUV, utilitaires, camping-cars, motos et scooters.
- Langues : équipe francophone ; WhatsApp conseillé pour l'anglais ou l'italien.
- Autoroute A8 : seul le dépanneur agréé du réseau peut intervenir (borne d'appel orange ou 112).
- Données structurées complètes : ${B}/donnees.json

## Contact et demande

${[
  ligne('Demander un dépannage en ligne', `${B}/demande.html`, 'position GPS, type de panne, urgence ou rendez-vous'),
  ligne('Contact', `${B}/contact.html`),
  ligne('WhatsApp', 'https://wa.me/33617684270'),
].join('\n')}
${tarifs ? `
## Tarifs

${ligne('Grille tarifaire complète', `${B}/tarifs.html`, tarifs.principe)}
${tarifs.groupes.flatMap(g => g.lignes.map(l => `- ${l.nom} : ${l.prix}${l.detail ? ' (' + l.detail + ')' : ''}`)).join('\n')}
` : ''}${services ? `
## Services

${services.map(s => ligne(s.nom, `${B}/${s.slug}.html`, `${s.resume} ${s.prix}.`)).join('\n')}
` : `
## Services

${ligne('Tous les services', `${B}/services.html`)}
`}
## Zone d'intervention

${ligne('Zone et délais', `${B}/zone.html`)}
${villes.map(v => ligne(`Dépannage ${v.nom}`, `${B}/ville-${v.slug}.html`, `${v.distanceKm} km de l'atelier, ${v.delai}`)).join('\n')}
${guides ? `
## Guides et conseils

${guides.map(g => ligne(g.titre, `${B}/${g.slug}.html`, g.desc)).join('\n')}
` : ''}
## Optional

${[
  ligne('Questions fréquentes', `${B}/faq.html`),
  ligne('À propos', `${B}/a-propos.html`),
  ligne('Diagnostic pneus en photo (gratuit)', `${B}/diagnostic.html`),
  ligne('English', `${B}/en/`),
  ligne('Italiano', `${B}/it/`),
].join('\n')}
`;
fs.writeFileSync(path.join(ROOT, 'llms.txt'), txt);
console.log('écrit : llms.txt, donnees.json');
