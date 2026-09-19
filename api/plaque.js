// =============================================
// DEPANNAGEAUTONICE.FR — api/plaque.js
// Fonction serverless Vercel : relais vers l'API Auto Ways.
//
// Pourquoi ce relais existe : le jeton Auto Ways transite en paramètre
// d'URL. Mis dans le site statique, il serait lisible par tout visiteur
// et par tout robot scannant le dépôt public, et la consommation serait
// facturée à l'exploitant. Le jeton reste donc ici, côté serveur, dans
// la variable d'environnement AUTOWAYS_TOKEN, et n'est jamais renvoyé
// au navigateur.
//
// Variables d'environnement attendues (Vercel → Settings → Environment Variables) :
//   AUTOWAYS_TOKEN    (obligatoire) le jeton Auto Ways
//   ALLOWED_ORIGINS   (recommandé)  origines autorisées, séparées par des virgules
//   DEBUG_PLAQUE      (facultatif)  "1" pour renvoyer aussi la réponse brute
// =============================================

const UPSTREAM = 'https://app.auto-ways.net/api/v1/fr';

const ORIGINES_PAR_DEFAUT = [
  'https://nikka77.github.io',
  'http://localhost:8123',
];

// Format SIV depuis 2009 (AA-123-AA) et ancien format FNI (123-ABC-45).
const SIV = /^[A-Z]{2}-?[0-9]{3}-?[A-Z]{2}$/;
const FNI = /^[0-9]{1,4}-?[A-Z]{2,3}-?[0-9]{2}$/;

// Limitation de débit, au mieux : chaque instance a sa propre mémoire et
// Vercel peut en exécuter plusieurs en parallèle. Cela freine les abus
// grossiers, cela n'est pas un rempart. La vraie protection reste le
// plafond de consommation côté Auto Ways.
const FENETRE_MS = 60_000;
const MAX_PAR_FENETRE = 8;
const compteurs = new Map();

function tropDeRequetes(ip) {
  const maintenant = Date.now();
  const entree = compteurs.get(ip);
  if (!entree || maintenant > entree.reset) {
    compteurs.set(ip, { n: 1, reset: maintenant + FENETRE_MS });
    return false;
  }
  entree.n += 1;
  if (compteurs.size > 5000) compteurs.clear(); // garde-fou mémoire
  return entree.n > MAX_PAR_FENETRE;
}

function originesAutorisees() {
  const brut = process.env.ALLOWED_ORIGINS;
  if (!brut) return ORIGINES_PAR_DEFAUT;
  return brut.split(',').map(o => o.trim()).filter(Boolean);
}

// Récupère la première clé présente parmi plusieurs noms possibles :
// le nommage exact d'Auto Ways n'est pas figé, on reste tolérant.
function champ(obj, ...noms) {
  for (const n of noms) {
    for (const cle of Object.keys(obj || {})) {
      if (cle.toLowerCase() === n.toLowerCase() && obj[cle] !== '' && obj[cle] != null) {
        return obj[cle];
      }
    }
  }
  return null;
}

function normaliser(data) {
  // La charge utile est parfois encapsulée (data, result, vehicule…)
  const v = (data && typeof data === 'object')
    ? (champ(data, 'data', 'result', 'vehicule', 'vehicle') || data)
    : {};
  const annee = champ(v, 'annee', 'year', 'date_mise_en_circulation', 'dateMiseCirculation', 'date1erCir_fr');
  return {
    marque:      champ(v, 'marque', 'make', 'brand'),
    modele:      champ(v, 'modele', 'model', 'modele_etude'),
    version:     champ(v, 'version', 'finition', 'trim'),
    annee:       typeof annee === 'string' ? (annee.match(/(19|20)\d{2}/) || [null])[0] : annee,
    energie:     champ(v, 'energie', 'carburant', 'fuel', 'energy'),
    puissance:   champ(v, 'puissance_fiscale', 'puissanceFiscale', 'puissance', 'power'),
    boite:       champ(v, 'boite_vitesse', 'boiteVitesse', 'transmission'),
    portes:      champ(v, 'nb_portes', 'portes', 'doors'),
    genre:       champ(v, 'genre', 'type', 'carrosserie'),
    pneus:       champ(v, 'pneus', 'dimension_pneus', 'tyres'),
  };
}

module.exports = async function handler(req, res) {
  const origine = req.headers.origin || '';
  const autorisees = originesAutorisees();
  const origineOk = autorisees.includes(origine);

  if (origineOk) {
    res.setHeader('Access-Control-Allow-Origin', origine);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ erreur: 'Méthode non autorisée' });

  // Une origine absente correspond à un appel hors navigateur (curl, script) :
  // on le refuse, ce relais n'est là que pour nos propres pages.
  if (!origineOk) {
    return res.status(403).json({ erreur: 'Origine non autorisée' });
  }

  const token = process.env.AUTOWAYS_TOKEN;
  if (!token) {
    console.error('AUTOWAYS_TOKEN absent des variables d\'environnement');
    return res.status(503).json({ erreur: 'Service de recherche non configuré' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'inconnue';
  if (tropDeRequetes(ip)) {
    return res.status(429).json({ erreur: 'Trop de recherches, patientez une minute' });
  }

  const plaque = String(req.query.plaque || '').toUpperCase().replace(/[\s.]/g, '');
  if (!SIV.test(plaque) && !FNI.test(plaque)) {
    return res.status(400).json({ erreur: 'Format de plaque invalide' });
  }

  try {
    const url = `${UPSTREAM}?plaque=${encodeURIComponent(plaque)}&token=${encodeURIComponent(token)}&country=fr`;
    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), 8000);

    let reponse;
    try {
      reponse = await fetch(url, { signal: controleur.signal });
    } finally {
      clearTimeout(minuteur);
    }

    if (!reponse.ok) {
      // On ne relaie jamais le corps d'erreur : il peut contenir l'URL appelée,
      // donc le jeton.
      console.error('Auto Ways a répondu', reponse.status);
      const statut = reponse.status === 404 ? 404 : 502;
      return res.status(statut).json({
        erreur: statut === 404 ? 'Véhicule introuvable' : 'Service de recherche indisponible',
      });
    }

    const data = await reponse.json();
    const vehicule = normaliser(data);

    if (!vehicule.marque && !vehicule.modele) {
      return res.status(404).json({ erreur: 'Véhicule introuvable' });
    }

    const charge = { plaque, vehicule };
    if (process.env.DEBUG_PLAQUE === '1') charge.brut = data;
    return res.status(200).json(charge);

  } catch (e) {
    console.error('Échec de la recherche par plaque :', e.name);
    return res.status(504).json({ erreur: 'Service de recherche injoignable' });
  }
};
