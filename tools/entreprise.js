// =============================================
// INFORMATIONS LÉGALES DE L'ENTREPRISE — source unique.
//
// Utilisées par les mentions légales et les CGV (tools/build-pages.js).
// Chaque information ne s'affiche sur le site QUE si elle est remplie :
// aucun « à compléter » n'apparaît en ligne. Remplir puis « npm run build ».
//
// Ce qu'exige la loi (LCEN art. 6, Code de commerce, Code de la conso.) :
// forme juridique, SIRET, RCS ou RM, capital (sociétés), TVA, directeur
// de la publication, assurance professionnelle si elle est obligatoire,
// médiateur de la consommation.
// =============================================

module.exports = {
  nom: 'Dépannage Auto Nice',
  // Raison sociale si elle diffère du nom commercial (ex. « SASU DUPONT DÉPANNAGE »).
  raisonSociale: '',
  // Ex. « SASU », « SARL », « Entreprise individuelle (micro-entrepreneur) ».
  forme: '',
  // Sociétés uniquement, ex. « 1 000 € ».
  capital: '',
  // 14 chiffres, ex. « 123 456 789 00012 ».
  siret: '',
  // Ville du greffe pour une société (« Nice » → « RCS Nice 123 456 789 »).
  rcs: '',
  // Artisan immatriculé au Répertoire des métiers : ville ou département.
  rm: '',
  // regime : 'assujetti' (numéro FR…) ou 'franchise' (TVA non applicable,
  // art. 293 B du CGI). En franchise, les prix « TTC » du site doivent
  // aussi changer : voir A-COMPLETER.md.
  tva: { regime: '', numero: '' },
  // Nom et qualité, ex. « Dan Dupont, gérant ».
  directeur: '',
  email: '',
  adresse: ['Zone industrielle du Quai de la Blanquière', '06000 Nice, France'],
  // Assurance responsabilité civile professionnelle.
  assurance: { assureur: '', adresse: '', zone: '' },
  // Médiateur de la consommation (adhésion obligatoire pour vendre aux
  // particuliers). Nom, site internet, adresse postale.
  mediateur: { nom: '', site: '', adresse: '' },
  // Durée de conservation des demandes et factures, texte validé par le
  // gérant. Proposition dans notes/brouillon-mentions-legales.md.
  conservation: '',
};
