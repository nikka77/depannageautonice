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

// Auto Ways préfixe tous ses champs par « AWN_ » (AWN_marque, AWN_modele…).
// On compare donc sur le nom sans préfixe, ce qui accepte aussi une
// éventuelle réponse non préfixée.
function cleNormalisee(cle) {
  return cle.replace(/^AWN_/i, '').toLowerCase();
}

// Auto Ways remplit les champs inconnus avec des marqueurs plutôt qu'avec
// du vide : les laisser passer afficherait « INCONNU » au client.
const MARQUEURS_VIDES = new Set(['', '0', 'inconnu', 'non renseigne', 'non renseigné', 'nc', 'null']);

function propre(valeur) {
  if (valeur == null) return null;
  if (Array.isArray(valeur)) return valeur.length ? valeur : null;
  const texte = String(valeur).trim();
  if (MARQUEURS_VIDES.has(texte.toLowerCase())) return null;
  return texte;
}

function champ(obj, ...noms) {
  if (!obj || typeof obj !== 'object') return null;
  for (const n of noms) {
    const cible = n.toLowerCase();
    for (const cle of Object.keys(obj)) {
      if (cleNormalisee(cle) === cible) {
        const v = propre(obj[cle]);
        if (v !== null) return v;
      }
    }
  }
  return null;
}

function normaliser(data) {
  // Enveloppe Auto Ways : { code, country, query, error, message, data: {…} }
  const v = (data && typeof data === 'object' && data.data && typeof data.data === 'object')
    ? data.data
    : (data || {});

  // La date arrive en 2019-06-20 (champ « _us ») ou en 20-06-2019.
  const dateUs = champ(v, 'date_mise_en_circulation_us');
  const dateFr = champ(v, 'date_mise_en_circulation', 'date_cg');
  const source = dateUs || dateFr || '';
  const annee = (source.match(/(19|20)\d{2}/) || [null])[0];

  // Auto Ways renvoie les pneus d'origine sous forme de liste d'objets
  // { width, height, diameter, load_index, speed_index, label }.
  const pneus = champ(v, 'pneus');
  const pneu = Array.isArray(pneus) && pneus.length ? (pneus[0].label || null) : null;

  return {
    marque:      champ(v, 'marque'),
    modele:      champ(v, 'modele', 'modele_prf', 'modele_etude', 'model'),
    version:     champ(v, 'finition', 'label_moteur', 'version'),
    annee:       annee,
    miseEnCirculation: dateFr,
    energie:     champ(v, 'energie'),
    carrosserie: champ(v, 'carrosserie'),
    puissanceFiscale: champ(v, 'puissance_fiscale'),
    puissanceCh: champ(v, 'puissance_chevaux'),
    portes:      champ(v, 'nbr_portes'),
    vin:         champ(v, 'vin'),
    pneu:        pneu,
    pneus:       pneus,
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
  // Seule exception : le mode diagnostic, réservé à la mise au point.
  const diag = process.env.DEBUG_PLAQUE === '1' && req.query.diag === '1';
  if (!origineOk && !diag) {
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

    const texte = await reponse.text();

    if (!reponse.ok) {
      // Le corps amont n'est jamais relayé tel quel hors diagnostic :
      // il peut contenir l'URL appelée, donc le jeton.
      console.error('Auto Ways a répondu', reponse.status, texte.slice(0, 300));

      // Un 403 signifie « Token invalide » : clé expirée, révoquée ou quota
      // épuisé. C'est un problème d'exploitation, pas une panne passagère :
      // il doit ressortir clairement dans les journaux Vercel, sinon on le
      // cherche longtemps.
      if (reponse.status === 403) {
        console.error(
          'AUTOWAYS : jeton refusé (403). Vérifier la clé et le quota sur ' +
          'https://app.auto-ways.net/api-keys, puis redéployer.'
        );
      }

      // Observé en production : pour une plaque absente de sa base, Auto Ways
      // ne renvoie pas un 404 propre mais un 500 avec une page HTML d'erreur.
      // On le traite donc comme « introuvable » : pour le visiteur, la suite
      // est la même (saisie manuelle), et annoncer une panne de service
      // serait faux dans l'immense majorité des cas.
      const htmlDErreur = reponse.status >= 500 && !texte.trim().startsWith('{');
      const statut = (reponse.status === 404 || htmlDErreur) ? 404 : 502;

      const corps = { erreur: statut === 404 ? 'Véhicule introuvable' : 'Service de recherche indisponible' };
      if (diag) { corps.amont_statut = reponse.status; corps.amont_corps = texte.slice(0, 1200); }
      return res.status(statut).json(corps);
    }

    let data;
    try {
      data = JSON.parse(texte);
    } catch {
      console.error('Réponse amont non JSON');
      const corps = { erreur: 'Réponse inattendue du service' };
      if (diag) corps.amont_corps = texte.slice(0, 1200);
      return res.status(502).json(corps);
    }

    // Auto Ways répond 200 même quand la plaque est inconnue : c'est le
    // drapeau « error » de la charge utile qui fait foi.
    if (data && data.error === true) {
      const corps = { erreur: 'Véhicule introuvable' };
      if (diag) corps.brut = data;
      return res.status(404).json(corps);
    }

    const vehicule = normaliser(data);

    if (!vehicule.marque && !vehicule.modele) {
      const corps = { erreur: 'Véhicule introuvable' };
      if (diag) corps.brut = data;
      return res.status(404).json(corps);
    }

    const charge = { plaque, vehicule };
    if (diag) charge.brut = data;
    return res.status(200).json(charge);

  } catch (e) {
    console.error('Échec de la recherche par plaque :', e.name);
    return res.status(504).json({ erreur: 'Service de recherche injoignable' });
  }
};
