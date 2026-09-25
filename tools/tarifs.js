// =============================================
// GRILLE TARIFAIRE — source unique des prix du site.
//
// Utilisée par : la page Tarifs (FR/EN/IT) et son estimateur, les pages
// services (« dès … »), llms.txt / donnees.json. Pour changer un prix,
// le changer ICI puis lancer « npm run build » : tout le site suit.
//
// Prix TTC, en euros. Positionnement septembre 2026 : départ à 70 €,
// sous les concurrents relevés (Paris 79 €, plateformes 75–90 €,
// Nice 49 € « d'appel » sans détail). Voir A-COMPLETER.md : grille à
// valider par le gérant.
// =============================================

const calcul = {
  // Rayon couvert par les prix de base, depuis l'atelier (Nice et
  // communes limitrophes). Au-delà : frais de déplacement par km (aller).
  baseKm: 10,
  deplacementKm: 1.5,
  // Remorquage : prix par tranche de distance de remorquage (du lieu de la
  // panne au lieu de dépose), puis prix du km supplémentaire.
  bandes: [[10, 70], [20, 95], [30, 120], [40, 145], [50, 170]],
  kmSupp: 2.2,
  // Suppléments.
  nuit: 40,        // 20 h – 8 h, dimanches et jours fériés
  sousSol: 30,     // sortie de parking souterrain
  utilitaire: 30,  // utilitaire ou camping-car jusqu'à 3,5 t
  attente: 15,     // par quart d'heure entamé, au-delà de 15 min d'attente due au client
  roueBloquee: 30, // chariots porte-roues (roue bloquée, boîte auto en panne)
};

// Prestations sur place (Nice et communes limitrophes, de jour).
// id : repris par l'estimateur et les pages services.
const surPlace = [
  { id: 'batterie', prix: 70, nom: { fr: 'Démarrage batterie à plat (booster)', en: 'Flat battery jump-start', it: 'Avviamento batteria scarica' } },
  { id: 'roue', prix: 70, nom: { fr: 'Pose de la roue de secours', en: 'Fitting the spare wheel', it: 'Montaggio ruota di scorta' } },
  { id: 'meche', prix: 80, nom: { fr: 'Réparation de crevaison (mèche)', en: 'Puncture repair (plug)', it: 'Riparazione foratura (tappo)' } },
  { id: 'panne-seche', prix: 70, plus: { fr: '+ carburant', en: '+ fuel', it: '+ carburante' }, nom: { fr: 'Panne sèche : livraison de carburant', en: 'Out of fuel: fuel delivery', it: 'Senza carburante: consegna' } },
  { id: 'batterie-neuve', prix: 70, plus: { fr: '+ prix de la batterie', en: '+ battery price', it: '+ prezzo batteria' }, nom: { fr: 'Remplacement de batterie sur place', en: 'Battery replacement on the spot', it: 'Sostituzione batteria sul posto' } },
  { id: 'ouverture', prix: 90, nom: { fr: 'Ouverture de porte (clés enfermées)', en: 'Door opening (keys locked in)', it: 'Apertura porta (chiavi chiuse dentro)' } },
  { id: 'neiman', prix: 90, nom: { fr: 'Déblocage direction / écrou antivol', en: 'Steering lock / locking wheel nut', it: 'Sblocco sterzo / bullone antifurto' } },
  { id: 'carburant', prix: 150, nom: { fr: 'Erreur de carburant : vidange du réservoir', en: 'Wrong fuel: tank drain', it: 'Carburante sbagliato: svuotamento serbatoio' } },
  { id: 'diagnostic', prix: 60, nom: { fr: 'Diagnostic électronique (valise) sur place', en: 'On-site electronic diagnosis', it: 'Diagnosi elettronica sul posto' } },
];

// Services sans estimation automatique.
const autres = [
  { id: 'epave', prix: 0, nom: { fr: 'Enlèvement d\'épave (véhicule complet, papiers en règle)', en: 'Scrap car removal (complete vehicle, papers in order)', it: 'Ritiro rottame (veicolo completo, documenti in regola)' } },
  { id: 'gardiennage', texte: { fr: '48 h offertes, puis 10 € / jour', en: '48 h free, then €10 / day', it: '48 h gratis, poi 10 € / giorno' }, nom: { fr: 'Gardiennage sécurisé à l\'atelier', en: 'Secure storage at the workshop', it: 'Custodia in officina' } },
  { id: 'clim', prix: 50, depuis: true, nom: { fr: 'Recharge de climatisation (atelier)', en: 'Air-con recharge (workshop)', it: 'Ricarica aria condizionata (officina)' } },
  { id: 'diag-atelier', prix: 49, depuis: true, nom: { fr: 'Diagnostic électronique à l\'atelier', en: 'Electronic diagnosis at the workshop', it: 'Diagnosi elettronica in officina' } },
  { id: 'cle', devis: true, nom: { fr: 'Reproduction de clé ou de carte', en: 'Key or key card copy', it: 'Duplicato chiave o scheda' } },
  { id: 'treuillage', devis: true, nom: { fr: 'Treuillage, véhicule embourbé ou en contrebas', en: 'Winching, vehicle stuck or off the road', it: 'Verricello, veicolo impantanato o fuori strada' } },
  { id: 'longue', devis: true, nom: { fr: 'Transport longue distance, Monaco, Italie', en: 'Long-distance transport, Monaco, Italy', it: 'Trasporto a lunga distanza, Monaco, Italia' } },
  { id: 'lourd', devis: true, nom: { fr: 'Camping-car ou véhicule de plus de 3,5\u00a0t', en: 'Motorhome or vehicle over 3.5 t', it: 'Camper o veicolo oltre 3,5 t' } },
];

const paiement = {
  fr: ['Carte bancaire', 'Apple Pay', 'Google Pay', 'Espèces'],
  en: ['Bank card', 'Apple Pay', 'Google Pay', 'Cash'],
  it: ['Carta', 'Apple Pay', 'Google Pay', 'Contanti'],
};

const principe = {
  fr: 'Prix TTC. Le prix ferme est annoncé au téléphone avant le départ de la dépanneuse : c\'est le prix facturé. Devis gratuit, aucun frais de dossier.',
  en: 'Prices include VAT. A firm price is given on the phone before the tow truck sets off: it is the price you pay. Free quote, no admin fee.',
  it: 'Prezzi IVA inclusa. Il prezzo fisso viene comunicato al telefono prima della partenza: è il prezzo fatturato. Preventivo gratuito, nessuna spesa di pratica.',
};

// ── Mise en forme ─────────────────────────────
const euro = (n, lang) => {
  const s = Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', lang === 'en' ? '.' : ',');
  return lang === 'en' ? `€${s}` : `${s} €`;
};
const L = {
  fr: { des: 'dès', gratuit: 'Gratuit', devis: 'Sur devis', par: 'par km', km: 'km' },
  en: { des: 'from', gratuit: 'Free', devis: 'On quotation', par: 'per km', km: 'km' },
  it: { des: 'da', gratuit: 'Gratis', devis: 'Su preventivo', par: 'al km', km: 'km' },
};
function prixTexte(item, lang) {
  const l = L[lang];
  if (item.texte) return item.texte[lang];
  if (item.devis) return l.devis;
  if (item.prix === 0) return l.gratuit;
  return `${item.depuis ? l.des + ' ' : ''}${euro(item.prix, lang)}${item.plus ? ' ' + item.plus[lang] : ''}`;
}

// Groupes affichés dans les tableaux (et repris par llms.txt).
function groupes(lang = 'fr') {
  const l = L[lang];
  const c = calcul;
  const T = {
    fr: { sp: 'Dépannage sur place', spNote: `Nice et communes limitrophes (jusqu'à ${c.baseKm} km de l'atelier), de jour.`,
          rem: 'Remorquage', remNote: 'Voiture, moto ou scooter. Distance entre le lieu de la panne et le lieu de dépose (atelier, garage, domicile).',
          jusqua: km => `Jusqu'à ${km} km`, de: (a, b) => `De ${a} à ${b} km`, audela: km => `Au-delà de ${km} km`,
          sup: 'Suppléments', supNote: 'Annoncés avant le départ, jamais découverts sur place.',
          nuit: 'Nuit (20 h – 8 h), dimanche et jour férié', depl: `Déplacement au-delà de ${c.baseKm} km de l'atelier`, sousSol: 'Sortie de parking souterrain',
          util: 'Utilitaire ou camping-car jusqu\'à 3,5\u00a0t', roue: 'Roues bloquées (chariots porte-roues)', attente: 'Attente due au client, au-delà de 15 min', quart: 'par quart d\'heure',
          aut: 'Autres services', autNote: 'À l\'atelier du Quai de la Blanquière ou sur rendez-vous.' },
    en: { sp: 'Roadside repair', spNote: `Nice and neighbouring towns (up to ${c.baseKm} km from the workshop), daytime.`,
          rem: 'Towing', remNote: 'Car, motorbike or scooter. Distance from the breakdown to the drop-off point (workshop, garage, home).',
          jusqua: km => `Up to ${km} km`, de: (a, b) => `${a} to ${b} km`, audela: km => `Beyond ${km} km`,
          sup: 'Extras', supNote: 'Given before we set off, never discovered on arrival.',
          nuit: 'Night (8 pm – 8 am), Sunday and public holiday', depl: `Travel beyond ${c.baseKm} km from the workshop`, sousSol: 'Underground car park exit',
          util: 'Van or motorhome up to 3.5\u00a0t', roue: 'Locked wheels (wheel dollies)', attente: 'Waiting caused by the customer, beyond 15 min', quart: 'per quarter hour',
          aut: 'Other services', autNote: 'At our Quai de la Blanquière workshop or by appointment.' },
    it: { sp: 'Riparazione sul posto', spNote: `Nizza e comuni vicini (fino a ${c.baseKm} km dall'officina), di giorno.`,
          rem: 'Traino', remNote: 'Auto, moto o scooter. Distanza dal luogo del guasto al luogo di consegna (officina, garage, domicilio).',
          jusqua: km => `Fino a ${km} km`, de: (a, b) => `Da ${a} a ${b} km`, audela: km => `Oltre ${km} km`,
          sup: 'Supplementi', supNote: 'Comunicati prima della partenza, mai scoperti sul posto.',
          nuit: 'Notte (20 – 8), domenica e festivi', depl: `Spostamento oltre ${c.baseKm} km dall'officina`, sousSol: 'Uscita da parcheggio sotterraneo',
          util: 'Furgone o camper fino a 3,5\u00a0t', roue: 'Ruote bloccate (carrelli)', attente: 'Attesa dovuta al cliente, oltre 15 min', quart: 'ogni quarto d\'ora',
          aut: 'Altri servizi', autNote: 'Nella nostra officina del Quai de la Blanquière o su appuntamento.' },
  }[lang];
  const plus = n => `+ ${euro(n, lang)}`;
  return [
    { id: 'sur-place', titre: T.sp, note: T.spNote, lignes: surPlace.map(s => ({ id: s.id, nom: s.nom[lang], prix: prixTexte(s, lang) })) },
    { id: 'remorquage', titre: T.rem, note: T.remNote, lignes: [
      ...c.bandes.map(([km, p], i) => ({ nom: i === 0 ? T.jusqua(km) : T.de(c.bandes[i - 1][0], km), prix: euro(p, lang) })),
      { nom: T.audela(c.bandes[c.bandes.length - 1][0]), prix: `${euro(c.bandes[c.bandes.length - 1][1], lang)} + ${euro(c.kmSupp, lang)} ${l.par}` },
    ] },
    { id: 'supplements', titre: T.sup, note: T.supNote, lignes: [
      { nom: T.nuit, prix: plus(c.nuit) },
      { nom: T.depl, prix: `${euro(c.deplacementKm, lang)} ${l.par}` },
      { nom: T.sousSol, prix: plus(c.sousSol) },
      { nom: T.util, prix: plus(c.utilitaire) },
      { nom: T.roue, prix: plus(c.roueBloquee) },
      { nom: T.attente, prix: `${euro(c.attente, lang)} ${T.quart}` },
    ] },
    { id: 'autres', titre: T.aut, note: T.autNote, lignes: autres.map(s => ({ id: s.id, nom: s.nom[lang], prix: prixTexte(s, lang) })) },
  ];
}

// Prix « dès … » d'une prestation, pour les pages services.
function des(id, lang = 'fr') {
  const s = [...surPlace, ...autres].find(x => x.id === id);
  if (id === 'remorquage') return `${L[lang].des} ${euro(calcul.bandes[0][1], lang)}`;
  if (!s) throw new Error('prestation inconnue : ' + id);
  if (s.devis || s.texte || s.prix === 0) return prixTexte(s, lang);
  return `${L[lang].des} ${euro(s.prix, lang)}`;
}

module.exports = { calcul, surPlace, autres, paiement, principe, groupes, des, euro };
