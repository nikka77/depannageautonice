// =============================================
// SERVICES — une page par prestation (tools/build-services.js).
//
// Chaque service : ce qu'on fait, comment ça se passe, quoi faire en
// attendant, prix « dès … » (lu dans tarifs.js), questions fréquentes et
// guides liés. Pour ajouter un service : ajouter une entrée ici, puis
// « npm run build ». Ne jamais promettre un délai garanti ni un résultat
// qu'on ne maîtrise pas (ex. ouverture « sans aucun dégât » dans 100 % des cas).
// =============================================

const { des } = require('./tarifs');

// Catégories, dans l'ordre d'affichage de la page Services.
const CATS = [
  { id: 'urgence', titre: 'Urgences sur place', sub: 'Le technicien vient à vous et vous remet en route quand c\'est possible.' },
  { id: 'remorquage', titre: 'Remorquage et transport', sub: 'Quand le véhicule ne peut pas repartir, ou doit aller loin.' },
  { id: 'cles', titre: 'Clés et accès au véhicule', sub: 'Clés enfermées, perdues ou cassées, direction bloquée.' },
  { id: 'vehicules', titre: 'Tous les véhicules', sub: 'Deux-roues, utilitaires, camping-cars, électriques et hybrides.' },
  { id: 'atelier', titre: 'Après la panne et à l\'atelier', sub: 'Quai de la Blanquière, à Nice, sur rendez-vous.' },
];

const S = [
  // ── Urgences sur place ──────────────────────
  {
    slug: 'depannage-batterie-nice', cat: 'urgence', ic: 'battery', presta: 'batterie', type: 'batterie',
    nom: 'Batterie à plat', h1: 'Batterie à plat à Nice&nbsp;: démarrage ou remplacement sur place',
    titre: 'Dépannage batterie à Nice 24h/24 — démarrage dès 70 €',
    desc: 'Batterie à plat à Nice : démarrage au booster dès 70 €, test de charge et remplacement sur place (AGM, EFB, Start & Stop). 7j/7 24h/24.',
    resume: 'Démarrage au booster, test de la batterie et de l\'alternateur, remplacement sur place.',
    intro: 'C\'est la panne la plus fréquente, été comme hiver&nbsp;: la chaleur de la Côte d\'Azur use les batteries autant que le froid. Nous redémarrons le véhicule au booster, puis nous vérifions si la batterie tient la charge avant de vous conseiller quoi que ce soit.',
    etapes: ['Démarrage au booster professionnel, sans risque pour l\'électronique du véhicule.', 'Test de la batterie et de la charge de l\'alternateur.', 'Si la batterie est hors d\'usage&nbsp;: remplacement sur place par une batterie adaptée (classique, EFB ou AGM pour les véhicules Start &amp; Stop).', 'Reprise de l\'ancienne batterie pour recyclage.'],
    attente: ['Coupez tous les consommateurs (phares, radio, clim).', 'Ne tentez pas de démarrer en boucle&nbsp;: vous videz ce qui reste.', 'Si vous entendez un «&nbsp;clic&nbsp;» ou que rien ne s\'allume, c\'est très probablement la batterie.'],
    faq: [
      ['Combien coûte un dépannage batterie&nbsp;?', 'Le démarrage au booster coûte 70&nbsp;€ sur Nice, de jour. Si la batterie doit être remplacée, s\'ajoute le prix de la batterie, annoncé avant la pose selon le modèle de votre véhicule.'],
      ['Pouvez-vous changer une batterie Start &amp; Stop&nbsp;?', 'Oui. Les véhicules Start &amp; Stop demandent une batterie EFB ou AGM de la bonne capacité&nbsp;; sur certains modèles, elle doit aussi être déclarée au calculateur, ce que nous faisons avec la valise de diagnostic.'],
    ],
    guides: ['guide-batterie-a-plat', 'guide-voiture-ne-demarre-pas'],
  },
  {
    slug: 'pneu-creve-nice', cat: 'urgence', ic: 'wheel', presta: 'roue', type: 'pneu',
    nom: 'Pneu crevé', h1: 'Pneu crevé à Nice&nbsp;: roue de secours, réparation ou remorquage',
    titre: 'Pneu crevé à Nice — dépannage 24h/24 dès 70 €',
    desc: 'Crevaison à Nice : pose de la roue de secours dès 70 €, réparation par mèche dès 80 €, remorquage si le pneu est éclaté. 7j/7 24h/24, tous véhicules.',
    resume: 'Pose de la roue de secours, réparation par mèche, remorquage vers un pneumaticien.',
    intro: 'Crevaison sur la Promenade, clou ramassé sur un chantier, pneu déchiré sur une bordure&nbsp;: nous posons la roue de secours, réparons le pneu quand la réparation est possible, ou emmenons le véhicule chez un pneumaticien.',
    etapes: ['Mise en sécurité du véhicule et contrôle du pneu.', 'Pose de votre roue de secours, ou réparation par mèche si la perforation est sur la bande de roulement.', 'Pas de roue de secours ni de réparation possible&nbsp;: remorquage vers le pneumaticien ou l\'atelier.', 'Écrou antivol perdu&nbsp;: nous le débloquons (<a href="perte-cle-voiture-nice.html">clés et antivol</a>).'],
    attente: ['Arrêtez-vous dès que possible, hors de la chaussée&nbsp;: rouler à plat détruit le pneu et parfois la jante.', 'Gilet, warnings, triangle si c\'est sans danger&nbsp;; sur voie rapide, restez derrière la glissière.', 'Une roue galette ne se roule qu\'à 80&nbsp;km/h au maximum et sur une courte distance.'],
    faq: [
      ['Un pneu crevé se répare-t-il toujours&nbsp;?', 'Non. Une perforation sur la bande de roulement se répare souvent&nbsp;; un flanc coupé ou un pneu roulé à plat doit être remplacé. Nous vous le disons avant toute intervention.'],
      ['Je n\'ai pas de roue de secours, seulement un kit anti-crevaison.', 'Le kit dépanne pour une petite perforation. S\'il ne suffit pas, nous réparons sur place quand c\'est possible ou nous remorquons jusqu\'à un pneumaticien.'],
    ],
    guides: ['guide-pneu-creve', 'guide-que-faire-en-cas-de-panne'],
  },
  {
    slug: 'panne-seche-nice', cat: 'urgence', ic: 'fuel', presta: 'panne-seche', type: 'carburant',
    nom: 'Panne sèche', h1: 'Panne sèche à Nice&nbsp;: livraison de carburant',
    titre: 'Panne sèche à Nice — livraison de carburant dès 70 €',
    desc: 'Panne d\'essence ou de gazole à Nice : livraison de carburant et redémarrage, 70 € + le carburant. Voiture électrique à plat : remorquage vers une borne. 7j/7 24h/24.',
    resume: 'Nous apportons de quoi rejoindre la station et redémarrons le moteur.',
    intro: 'La jauge a menti, la station était fermée&nbsp;: nous apportons de quoi rejoindre la station la plus proche et redémarrons le moteur. Sur un diesel récent, il faut parfois réamorcer le circuit&nbsp;: c\'est prévu.',
    etapes: ['Livraison de quelques litres d\'essence ou de gazole.', 'Réamorçage du circuit si nécessaire (moteurs diesel).', 'Redémarrage et vérification.', 'Voiture électrique ou GPL vide&nbsp;: remorquage vers une borne ou une station adaptée.'],
    attente: ['Ne vous arrêtez pas dans un virage ou un tunnel&nbsp;: profitez de l\'élan pour gagner un endroit sûr.', 'Ne tentez pas de redémarrer un diesel en boucle&nbsp;: vous déchargez la batterie.'],
    faq: [
      ['Combien coûte une panne sèche&nbsp;?', '70&nbsp;€ sur Nice, de jour, plus le carburant livré, au prix de la pompe.'],
      ['Livrez-vous de l\'électricité pour une voiture électrique&nbsp;?', 'Non&nbsp;: une recharge sur la route serait trop lente pour être utile. Nous emmenons le véhicule sur plateau jusqu\'à la borne ou l\'adresse de votre choix.'],
    ],
    guides: ['guide-voiture-electrique-en-panne', 'guide-que-faire-en-cas-de-panne'],
  },
  {
    slug: 'erreur-carburant-nice', cat: 'urgence', ic: 'fuel', presta: 'carburant', type: 'carburant',
    nom: 'Erreur de carburant', h1: 'Erreur de carburant à Nice&nbsp;: vidange du réservoir sur place',
    titre: 'Erreur de carburant à Nice — vidange sur place dès 150 €',
    desc: 'Essence dans un diesel ou gazole dans une essence à Nice : ne démarrez pas. Vidange du réservoir et rinçage sur place dès 150 €, 7j/7 24h/24.',
    resume: 'Vidange du réservoir, rinçage du circuit et remise en route, sans démarrer le moteur.',
    intro: 'Essence dans un diesel, gazole dans une essence, AdBlue dans le réservoir&nbsp;: tant que le moteur n\'a pas tourné, la réparation se limite à une vidange. Chaque tour de moteur envoie le mauvais carburant vers la pompe et les injecteurs.',
    etapes: ['Aucun démarrage&nbsp;: le véhicule est poussé ou chargé si nécessaire.', 'Vidange complète du réservoir par pompe, récupération du carburant souillé.', 'Rinçage du circuit, remplissage avec le bon carburant.', 'Contrôle au démarrage. Si le moteur a tourné longtemps&nbsp;: diagnostic à l\'atelier.'],
    attente: ['Ne mettez pas le contact&nbsp;: sur beaucoup de véhicules, la pompe démarre dès le contact.', 'Si vous avez déjà roulé, arrêtez-vous dès que possible et coupez le moteur.', 'Mettez le véhicule au point mort et poussez-le hors de la piste si la station vous le demande.'],
    faq: [
      ['Combien coûte la vidange du réservoir&nbsp;?', 'Dès 150&nbsp;€ sur Nice, de jour, carburant souillé récupéré. Le prix ferme est annoncé avant le départ selon le volume du réservoir.'],
      ['J\'ai mis de l\'AdBlue dans le réservoir de carburant.', 'Ne démarrez surtout pas&nbsp;: l\'AdBlue attaque le circuit. Appelez-nous, la vidange est la même mais le rinçage doit être plus soigné.'],
    ],
    guides: ['guide-erreur-de-carburant'],
  },
  {
    slug: 'surchauffe-moteur-nice', cat: 'urgence', ic: 'thermo', presta: 'diagnostic', type: 'moteur',
    nom: 'Surchauffe moteur', h1: 'Moteur en surchauffe à Nice&nbsp;: diagnostic et remorquage',
    titre: 'Surchauffe moteur à Nice — dépannage 24h/24',
    desc: 'Voyant de température rouge, vapeur sous le capot à Nice : arrêtez-vous, coupez le moteur. Diagnostic sur place, remorquage si nécessaire, 7j/7 24h/24.',
    resume: 'Diagnostic sur place (fuite, ventilateur, courroie, thermostat), remorquage si le moteur ne doit pas tourner.',
    intro: 'Bouchons de l\'été sur la Promenade, montée vers l\'arrière-pays, clim à fond&nbsp;: la surchauffe est une panne typique de la Côte d\'Azur. Rouler avec un moteur trop chaud peut détruire le joint de culasse&nbsp;; s\'arrêter à temps limite la facture.',
    etapes: ['Recherche de la cause&nbsp;: fuite de liquide, ventilateur, courroie, thermostat, pompe à eau.', 'Réparation sur place quand c\'est possible (appoint, durite, relais de ventilateur).', 'Sinon, remorquage vers l\'atelier ou votre garage&nbsp;: le moteur ne doit pas retourner.'],
    attente: ['Arrêtez-vous dès que le voyant passe au rouge et coupez le moteur.', 'N\'ouvrez jamais le vase d\'expansion moteur chaud&nbsp;: le liquide est sous pression et brûle.', 'Laissez le capot fermé s\'il y a de la vapeur, éloignez-vous du véhicule.'],
    faq: [
      ['Puis-je rouler jusqu\'au garage si le moteur a refroidi&nbsp;?', 'Rarement une bonne idée&nbsp;: la cause est toujours là et la température remonte en quelques minutes. Faites vérifier avant de repartir.'],
      ['Combien coûte l\'intervention&nbsp;?', 'Le diagnostic sur place coûte 60&nbsp;€ sur Nice, de jour. Si un remorquage est nécessaire, il est calculé selon la distance, dès 70&nbsp;€.'],
    ],
    guides: ['guide-surchauffe-moteur', 'guide-voyants-tableau-de-bord'],
  },

  // ── Remorquage et transport ──────────────────
  {
    slug: 'remorquage-voiture-nice', cat: 'remorquage', ic: 'truck', presta: 'remorquage', type: 'remorquage', estim: 'type=remorquage',
    nom: 'Remorquage', h1: 'Remorquage de voiture à Nice, dès 70&nbsp;€',
    titre: 'Remorquage voiture à Nice 24h/24 — dès 70 € | Dépanneuse',
    desc: 'Remorquage de voiture à Nice et dans le 06 : dès 70 € jusqu\'à 10 km, prix au km publié, dépose à l\'atelier, chez votre garagiste ou à domicile. 7j/7 24h/24.',
    resume: 'Chargement sur plateau et dépose à l\'atelier, chez votre garagiste ou à l\'adresse de votre choix.',
    intro: 'Véhicule qui ne démarre plus, accidenté ou trop abîmé pour rouler&nbsp;: nous le chargeons sur plateau et le déposons où vous voulez. Le prix dépend de la distance de remorquage et il est annoncé avant le départ&nbsp;: 70&nbsp;€ jusqu\'à 10&nbsp;km dans Nice.',
    etapes: ['Prix ferme annoncé au téléphone selon la distance et l\'accès.', 'Chargement sur plateau, arrimage aux roues, état visuel du véhicule avec vous.', 'Dépose à notre atelier du Quai de la Blanquière, chez votre garagiste, chez un concessionnaire ou à domicile.', 'Vous pouvez monter dans la cabine dans la limite des places disponibles&nbsp;: dites-le à l\'appel.'],
    attente: ['Retirez les objets de valeur et vos papiers du véhicule.', 'Préparez le nom et l\'adresse du garage de destination.', 'Boîte automatique ou frein de parking électrique bloqué&nbsp;: signalez-le, nous venons avec les chariots porte-roues.'],
    faq: [
      ['Combien coûte un remorquage à Nice&nbsp;?', '70&nbsp;€ jusqu\'à 10&nbsp;km, 95&nbsp;€ jusqu\'à 20&nbsp;km, 120&nbsp;€ jusqu\'à 30&nbsp;km, puis selon la <a href="tarifs.html">grille publiée</a>. Nuit, dimanche et jour férié&nbsp;: +40&nbsp;€.'],
      ['Puis-je choisir le garage où va ma voiture&nbsp;?', 'Oui, toujours. Nous pouvons aussi la garder à l\'atelier en attendant votre rendez-vous&nbsp;: les 48 premières heures de gardiennage sont offertes.'],
    ],
    guides: ['guide-que-faire-en-cas-de-panne', 'guide-choisir-un-depanneur'],
  },
  {
    slug: 'depannage-accident-nice', cat: 'remorquage', ic: 'alert', presta: 'remorquage', type: 'accident', estim: 'type=remorquage',
    nom: 'Accident', h1: 'Après un accident à Nice&nbsp;: remorquage du véhicule accidenté',
    titre: 'Dépannage après accident à Nice — remorquage 24h/24',
    desc: 'Accident à Nice ou dans le 06 : remorquage du véhicule accidenté vers le garage, le carrossier ou l\'expert, roues bloquées comprises. Aide pour le constat. 7j/7 24h/24.',
    resume: 'Enlèvement du véhicule accidenté, roues bloquées comprises, vers le garage, le carrossier ou l\'expert.',
    intro: 'Après un choc, le véhicule gêne souvent la circulation et ne peut plus rouler. Une fois les secours passés si besoin, nous dégageons la voie, chargeons le véhicule même roues bloquées et l\'emmenons là où l\'expert pourra le voir.',
    etapes: ['Mise en sécurité de la zone avec vous (et la police si elle est présente).', 'Chargement du véhicule, avec chariots porte-roues si une roue est bloquée.', 'Balayage des débris de la chaussée.', 'Dépose chez votre garagiste, votre carrossier, à l\'atelier ou au lieu indiqué par votre assurance.'],
    attente: ['Blessés&nbsp;: appelez d\'abord le 112 (ou le 15, le 17, le 18), sans déplacer les personnes.', 'Gilet, warnings, et mettez-vous à l\'abri derrière la glissière ou sur le trottoir.', 'Remplissez le constat amiable et prenez des photos avant que les véhicules ne soient déplacés.'],
    faq: [
      ['Mon assurance paie-t-elle le remorquage&nbsp;?', 'Si votre contrat comprend une assistance, appelez-la d\'abord&nbsp;: elle peut nous missionner et vous n\'avancez rien. Sinon, notre facture est à joindre à votre déclaration de sinistre.'],
      ['Où va mon véhicule accidenté&nbsp;?', 'Où vous le décidez. Si vous ne savez pas encore, nous le gardons à l\'atelier&nbsp;: 48 heures offertes, le temps que l\'expert passe ou que vous choisissiez un carrossier.'],
    ],
    guides: ['guide-accident-constat-amiable', 'guide-assurance-assistance'],
  },
  {
    slug: 'depannage-parking-souterrain-nice', cat: 'remorquage', ic: 'parking', presta: 'remorquage', type: 'remorquage', estim: 'type=remorquage',
    nom: 'Parking souterrain', h1: 'Panne en parking souterrain à Nice',
    titre: 'Dépannage en parking souterrain à Nice — sortie de sous-sol',
    desc: 'Voiture en panne dans un parking souterrain à Nice : dépanneuse adaptée à la hauteur limitée, chariots porte-roues, sortie de sous-sol +30 €. 7j/7 24h/24.',
    resume: 'Matériel adapté aux hauteurs limitées, chariots porte-roues, sortie de sous-sol.',
    intro: 'Parkings publics, résidences, parkings d\'hôtel et de centres commerciaux&nbsp;: à Nice, beaucoup de voitures dorment en sous-sol, où une dépanneuse classique ne passe pas. Nous venons avec le matériel qui convient à la hauteur et aux rampes.',
    etapes: ['Vous nous donnez l\'adresse, le niveau, le numéro de place et la hauteur maximale affichée à l\'entrée.', 'Dépannage sur place quand c\'est possible (batterie, roue).', 'Sinon, sortie du véhicule avec chariots porte-roues ou treuil, puis chargement à l\'extérieur.', 'Supplément de sortie de sous-sol&nbsp;: +30&nbsp;€, annoncé avant le départ.'],
    attente: ['Notez la hauteur limite affichée à l\'entrée du parking.', 'Prévoyez le badge, le code ou le contact du gardien pour l\'accès.', 'Au sous-sol, le réseau passe mal&nbsp;: remontez pour nous appeler si besoin.'],
    faq: [
      ['Pouvez-vous sortir une voiture d\'un parking à hauteur limitée&nbsp;?', 'Oui, dans la grande majorité des cas. Donnez-nous la hauteur affichée à l\'entrée&nbsp;: nous venons avec le matériel adapté ou nous vous disons honnêtement si l\'accès est impossible.'],
      ['Combien coûte une sortie de sous-sol&nbsp;?', 'Le remorquage selon la distance, dès 70&nbsp;€, plus 30&nbsp;€ de sortie de sous-sol.'],
    ],
    guides: ['guide-batterie-a-plat', 'guide-voiture-ne-demarre-pas'],
  },
  {
    slug: 'depannage-aeroport-nice', cat: 'remorquage', ic: 'plane', presta: 'batterie', type: 'batterie',
    nom: 'Aéroport et gares', h1: 'Panne à l\'aéroport Nice Côte d\'Azur ou en gare',
    titre: 'Dépannage aéroport de Nice et gares — 24h/24',
    desc: 'Voiture qui ne démarre plus au retour de voyage, au parking de l\'aéroport Nice Côte d\'Azur ou d\'une gare : batterie, roue, remorquage. 7j/7 24h/24.',
    resume: 'Batterie à plat au retour de voyage, crevaison, remorquage depuis les parkings de l\'aéroport et des gares.',
    intro: 'Une semaine de vacances, et la batterie ne suit plus au retour&nbsp;: c\'est l\'appel classique des parkings de l\'aéroport Nice Côte d\'Azur et des gares. L\'aéroport est à quelques minutes de l\'atelier.',
    etapes: ['Vous nous indiquez le parking, le niveau et le numéro de place.', 'Démarrage au booster ou pose de la roue de secours sur place.', 'Si le véhicule ne repart pas, remorquage vers l\'atelier ou votre garage.', 'Voiture de location&nbsp;: appelez d\'abord le loueur, son assistance peut couvrir l\'intervention.'],
    attente: ['Photographiez le numéro de place et le niveau pour nous guider.', 'Parkings à hauteur limitée&nbsp;: notez la hauteur affichée à l\'entrée.', 'Gardez le ticket de parking&nbsp;: il faudra sortir.'],
    faq: [
      ['Intervenez-vous dans les parkings de l\'aéroport&nbsp;?', 'Oui, dans les parkings accessibles au public. Certaines zones réservées demandent l\'accord du gestionnaire&nbsp;: dites-nous où est le véhicule, nous organisons l\'accès.'],
      ['C\'est une voiture de location.', 'Appelez d\'abord le numéro d\'assistance du loueur (souvent sur le porte-clés ou le pare-brise)&nbsp;: une intervention non autorisée par lui peut rester à votre charge.'],
    ],
    guides: ['guide-voiture-de-location-en-panne', 'guide-batterie-a-plat'],
  },
  {
    slug: 'transport-vehicule-nice', cat: 'remorquage', ic: 'route', presta: 'longue', type: 'remorquage', quand: true,
    nom: 'Transport longue distance', h1: 'Transport de véhicule depuis Nice&nbsp;: Monaco, Italie, toute la France',
    titre: 'Transport de véhicule depuis Nice — Monaco, Italie, France',
    desc: 'Transport de voiture sur plateau depuis Nice : garage à garage, achat d\'un véhicule, collection, rapatriement, Monaco et Italie. Sur devis, sur rendez-vous.',
    resume: 'Transport sur plateau, sur rendez-vous&nbsp;: garage à garage, achat, collection, rapatriement, Monaco, Italie.',
    intro: 'Vous achetez une voiture à Marseille, vous rapatriez un véhicule tombé en panne en Italie, vous déménagez, ou vous confiez une voiture de collection à un restaurateur&nbsp;: nous la transportons sur plateau, arrimée, sur rendez-vous.',
    etapes: ['Devis gratuit selon le trajet, le véhicule et la date.', 'Enlèvement à l\'heure convenue, état du véhicule photographié avec vous.', 'Transport sur plateau, véhicule arrimé aux roues.', 'Livraison à l\'adresse prévue, contre signature.'],
    attente: ['Préparez l\'adresse exacte de départ et d\'arrivée, et un contact sur place.', 'Véhicule non roulant&nbsp;: précisez-le, le chargement se prépare.', 'Pour l\'étranger&nbsp;: gardez le certificat d\'immatriculation avec le véhicule.'],
    faq: [
      ['Allez-vous à Monaco et en Italie&nbsp;?', 'Oui, sur devis&nbsp;: Monaco, Vintimille, San Remo et au-delà. Le prix dépend de la distance et des péages.'],
      ['Transportez-vous des voitures de collection&nbsp;?', 'Oui, sur plateau, arrimées aux roues. Dites-nous la valeur du véhicule à la demande de devis.'],
    ],
    guides: ['guide-choisir-un-depanneur'],
  },
  {
    slug: 'treuillage-vehicule-embourbe-nice', cat: 'remorquage', ic: 'anchor', presta: 'treuillage', type: 'autre',
    nom: 'Treuillage, véhicule embourbé', h1: 'Véhicule embourbé, dans un fossé ou en contrebas&nbsp;: treuillage',
    titre: 'Treuillage de véhicule embourbé ou en fossé — Nice et arrière-pays',
    desc: 'Voiture embourbée, dans un fossé ou en contrebas dans le 06 : treuillage et relevage, sur devis. Arrière-pays niçois, chemins, terrains. 7j/7 24h/24.',
    resume: 'Treuillage et relevage d\'un véhicule embourbé, dans un fossé ou en contrebas, sur devis.',
    intro: 'Chemin de terre après l\'orage, roue dans le fossé en redescendant de l\'arrière-pays, voiture glissée d\'un talus&nbsp;: un treuillage demande du matériel et de la méthode pour ne pas abîmer davantage le véhicule. Chaque situation est différente, d\'où un devis.',
    etapes: ['Vous nous envoyez des photos par WhatsApp&nbsp;: position du véhicule, pente, accès.', 'Devis annoncé avant le départ.', 'Treuillage ou relevage, en protégeant le véhicule.', 'Contrôle&nbsp;: repartir sur place ou remorquage.'],
    attente: ['Ne forcez pas en accélérant&nbsp;: les roues creusent et la boîte chauffe.', 'Si le véhicule penche ou menace de glisser, sortez-en et éloignez-vous.', 'Envoyez des photos&nbsp;: elles nous font gagner du temps et évitent de venir sans le bon matériel.'],
    faq: [
      ['Pourquoi un devis et pas un prix fixe&nbsp;?', 'Parce qu\'un treuillage peut prendre dix minutes ou deux heures selon la pente, le terrain et le poids. Avec les photos, nous vous donnons un prix ferme avant de partir.'],
    ],
    guides: ['guide-que-faire-en-cas-de-panne'],
  },

  // ── Clés et accès ────────────────────────────
  {
    slug: 'ouverture-porte-voiture-nice', cat: 'cles', ic: 'lock', presta: 'ouverture', type: 'cles',
    nom: 'Clés enfermées', h1: 'Clés enfermées dans la voiture à Nice&nbsp;: ouverture de porte',
    titre: 'Ouverture de porte de voiture à Nice — clés enfermées, dès 90 €',
    desc: 'Clés oubliées dans la voiture ou porte bloquée à Nice : ouverture par technique non destructive dès 90 €, sur présentation des papiers. 7j/7 24h/24.',
    resume: 'Ouverture par technique non destructive, sur présentation des papiers du véhicule.',
    intro: 'Clés restées sur le siège, coffre refermé avec les clés dedans, batterie de la télécommande vide&nbsp;: nous ouvrons le véhicule avec des outils prévus pour ne pas abîmer la carrosserie ni les joints. Pour votre sécurité, nous vérifions que le véhicule est bien le vôtre.',
    etapes: ['Vérification de votre droit sur le véhicule&nbsp;: certificat d\'immatriculation et pièce d\'identité (ils sont peut-être dans la voiture&nbsp;: nous les vérifions après ouverture, en votre présence).', 'Ouverture par technique non destructive, dans la très grande majorité des cas sans aucune trace.', 'Si les clés sont perdues et non enfermées&nbsp;: voir la <a href="perte-cle-voiture-nice.html">reproduction de clé</a>.'],
    attente: ['Vérifiez toutes les portes et le coffre&nbsp;: une porte mal fermée arrive souvent.', 'Un enfant ou un animal enfermé au soleil&nbsp;: appelez le 112 sans attendre.', 'Si vous avez un double chez vous, il est parfois plus rapide et moins cher de le faire apporter.'],
    faq: [
      ['Combien coûte une ouverture de porte&nbsp;?', 'Dès 90&nbsp;€ sur Nice, de jour. Le prix ferme est annoncé avant le départ.'],
      ['Allez-vous abîmer la voiture&nbsp;?', 'Nos outils sont faits pour ouvrir sans casse, et c\'est le cas dans la très grande majorité des interventions. Sur certains véhicules très verrouillés, nous vous présentons les options avant toute manipulation.'],
    ],
    guides: ['guide-cles-perdues-ou-enfermees'],
  },
  {
    slug: 'perte-cle-voiture-nice', cat: 'cles', ic: 'key', presta: 'neiman', type: 'cles',
    nom: 'Clé perdue ou cassée', h1: 'Clé de voiture perdue, cassée ou direction bloquée à Nice',
    titre: 'Clé de voiture perdue à Nice — reproduction, carte, antivol',
    desc: 'Clé de voiture perdue ou cassée à Nice : reproduction de clé, de carte ou de télécommande sur devis, déblocage de direction ou d\'écrou antivol dès 90 €. 7j/7.',
    resume: 'Reproduction de clé, de carte ou de télécommande, clé cassée, direction bloquée, écrou antivol.',
    intro: 'Plus aucune clé, une clé cassée dans le contacteur, une carte main libre qui ne répond plus, une direction bloquée ou un écrou antivol dont la douille a disparu&nbsp;: selon le véhicule, nous réglons le problème sur place ou nous emmenons la voiture là où la clé pourra être refaite.',
    etapes: ['Identification du véhicule et du type de clé (clé à transpondeur, télécommande, carte main libre).', 'Déblocage de la direction ou de l\'écrou antivol sur place&nbsp;: dès 90&nbsp;€.', 'Reproduction de clé ou de carte&nbsp;: devis selon le modèle, parfois sur place, sinon à l\'atelier ou chez le concessionnaire.', 'Justificatifs obligatoires&nbsp;: certificat d\'immatriculation et pièce d\'identité.'],
    attente: ['Refaites le chemin et appelez les derniers lieux visités&nbsp;: beaucoup de clés sont retrouvées.', 'Clé volée avec les papiers&nbsp;: déclarez-le à la police, le véhicule peut être visé.', 'Gardez le certificat d\'immatriculation à portée&nbsp;: sans lui, aucune clé ne peut être refaite.'],
    faq: [
      ['Pouvez-vous refaire une clé sans l\'original&nbsp;?', 'Sur beaucoup de modèles, oui, par programmation. Sur certains véhicules récents, seul le constructeur peut le faire&nbsp;: nous vous le disons dès l\'appel et nous emmenons le véhicule chez le concessionnaire si besoin.'],
      ['J\'ai perdu la clé de mon écrou antivol.', 'Nous débloquons l\'écrou sur place (dès 90&nbsp;€) pour changer la roue ou faire réparer le pneu, puis nous le remplaçons par un écrou standard si vous le souhaitez.'],
    ],
    guides: ['guide-cles-perdues-ou-enfermees'],
  },

  // ── Véhicules ────────────────────────────────
  {
    slug: 'depannage-moto-scooter-nice', cat: 'vehicules', ic: 'bike', presta: 'remorquage', type: 'autre', estim: 'type=remorquage',
    nom: 'Moto et scooter', h1: 'Dépannage moto et scooter à Nice',
    titre: 'Dépannage moto et scooter à Nice — remorquage dès 70 €',
    desc: 'Moto ou scooter en panne ou accidenté à Nice : dépannage sur place, remorquage sur plateau avec rail et sangles, dès 70 €. 7j/7 24h/24.',
    resume: 'Dépannage sur place ou transport sur plateau, deux-roues calé sur rail et sanglé.',
    intro: 'À Nice, le deux-roues est partout&nbsp;: scooters en ville, motos sur les routes de l\'arrière-pays. Une moto se transporte debout, calée dans un rail et sanglée, jamais couchée&nbsp;: c\'est ce que nous faisons.',
    etapes: ['Dépannage sur place quand c\'est possible&nbsp;: batterie, crevaison, panne sèche.', 'Sinon, chargement sur plateau&nbsp;: roue avant dans le rail, sangles aux points d\'ancrage.', 'Dépose chez votre concessionnaire, votre garage deux-roues ou à domicile.'],
    attente: ['Mettez le deux-roues sur la béquille, hors de la chaussée si vous pouvez.', 'Après une chute&nbsp;: ne redémarrez pas s\'il y a une fuite d\'essence ou d\'huile.', 'Gardez votre casque et vos gants&nbsp;: vous en aurez besoin si le transport se fait sans vous.'],
    faq: [
      ['Combien coûte le remorquage d\'une moto&nbsp;?', 'La même grille que pour une voiture&nbsp;: 70&nbsp;€ jusqu\'à 10&nbsp;km, puis selon la distance.'],
      ['Transportez-vous les gros cubes et les maxi-scooters&nbsp;?', 'Oui, toutes cylindrées. Précisez le modèle à l\'appel pour que nous venions avec le bon rail.'],
    ],
    guides: ['guide-que-faire-en-cas-de-panne', 'guide-accident-constat-amiable'],
  },
  {
    slug: 'depannage-utilitaire-camping-car-nice', cat: 'vehicules', ic: 'truck', presta: 'remorquage', prixTxt: 'dès 100\u00a0€', type: 'remorquage', estim: 'type=remorquage',
    nom: 'Utilitaire, camping-car, poids lourd', h1: 'Dépannage d\'utilitaire, de camping-car et de poids lourd',
    titre: 'Dépannage utilitaire et camping-car à Nice — 24h/24',
    desc: 'Utilitaire, fourgon ou camping-car en panne à Nice et dans le 06 : dépannage sur place, remorquage jusqu\'à 3,5 t (+30 €), camping-cars et poids lourds sur devis.',
    resume: 'Utilitaires et fourgons jusqu\'à 3,5 t, camping-cars et véhicules plus lourds sur devis.',
    intro: 'Artisans, livreurs, vacanciers en camping-car&nbsp;: un utilitaire immobilisé, c\'est souvent une journée de travail perdue. Nous dépannons sur place quand c\'est possible et remorquons les véhicules jusqu\'à 3,5&nbsp;t&nbsp;; au-delà, nous étudions la faisabilité et vous faisons un devis.',
    etapes: ['Dépannage sur place&nbsp;: batterie, roue, panne sèche, diagnostic.', 'Remorquage des utilitaires jusqu\'à 3,5&nbsp;t&nbsp;: grille habituelle +30&nbsp;€.', 'Camping-cars et véhicules de plus de 3,5&nbsp;t&nbsp;: devis selon le poids, les dimensions et l\'accès.'],
    attente: ['Donnez-nous le modèle, le poids total (sur la carte grise, case F.2) et la hauteur.', 'Camping-car&nbsp;: coupez le gaz avant le remorquage.', 'Chargement lourd&nbsp;: dites-le, il peut falloir décharger.'],
    faq: [
      ['Remorquez-vous les camping-cars&nbsp;?', 'Oui, sur devis&nbsp;: tout dépend du poids et de la longueur. Envoyez-nous la carte grise en photo par WhatsApp pour un prix rapide.'],
      ['Et les poids lourds&nbsp;?', 'Sur devis, selon le tonnage et les moyens disponibles&nbsp;: nous vous confirmons la faisabilité dès l\'appel.'],
    ],
    guides: ['guide-que-faire-en-cas-de-panne'],
  },
  {
    slug: 'depannage-voiture-electrique-nice', cat: 'vehicules', ic: 'bolt', presta: 'remorquage', type: 'autre', estim: 'type=remorquage',
    nom: 'Électrique et hybride', h1: 'Dépannage de voiture électrique ou hybride à Nice',
    titre: 'Dépannage voiture électrique et hybride à Nice — plateau 24h/24',
    desc: 'Voiture électrique ou hybride en panne à Nice : batterie 12 V, remorquage sur plateau (jamais roues au sol), dépose à une borne ou chez le concessionnaire. 7j/7 24h/24.',
    resume: 'Batterie 12 V, transport sur plateau obligatoire, dépose à une borne ou chez le concessionnaire.',
    intro: 'Une voiture électrique «&nbsp;chargée&nbsp;» qui refuse de démarrer souffre souvent de sa petite batterie 12&nbsp;V, comme une thermique. Et quand elle doit être déplacée, c\'est sur plateau&nbsp;: remorquer une électrique roues au sol peut endommager le moteur.',
    etapes: ['Diagnostic&nbsp;: batterie 12&nbsp;V, message d\'erreur, niveau de charge.', 'Démarrage de la batterie 12&nbsp;V quand c\'est la cause.', 'Sinon, transport sur plateau vers une borne de recharge, votre domicile ou le concessionnaire.', 'Véhicule accidenté&nbsp;: précautions spécifiques liées à la batterie haute tension.'],
    attente: ['Notez le message affiché au tableau de bord.', 'Ne tentez pas de pousser ou de tracter le véhicule.', 'Après un choc, odeur ou fumée&nbsp;: éloignez-vous et appelez le 112.'],
    faq: [
      ['Peut-on remorquer une voiture électrique avec une barre&nbsp;?', 'Non, sauf mention contraire du constructeur&nbsp;: les roues entraînent le moteur, qui produit du courant. Le transport se fait sur plateau.'],
      ['Ma voiture est à 0&nbsp;%, pouvez-vous la recharger sur place&nbsp;?', 'Non&nbsp;: nous l\'emmenons jusqu\'à la borne de votre choix ou à votre domicile.'],
    ],
    guides: ['guide-voiture-electrique-en-panne', 'guide-batterie-a-plat'],
  },

  // ── Après la panne, atelier ──────────────────
  {
    slug: 'enlevement-epave-nice', cat: 'atelier', ic: 'recycle', presta: 'epave', type: 'autre', quand: true,
    nom: 'Enlèvement d\'épave', h1: 'Enlèvement d\'épave gratuit à Nice et dans le 06',
    titre: 'Enlèvement d\'épave gratuit à Nice — certificat de destruction',
    desc: 'Enlèvement gratuit de votre épave à Nice et dans le 06 : véhicule complet, remis à un centre VHU agréé, certificat de destruction et déclaration de cession. Sur rendez-vous.',
    resume: 'Gratuit pour un véhicule complet&nbsp;: remise à un centre VHU agréé et certificat de destruction.',
    intro: 'Voiture qui ne passera plus le contrôle technique, épave dans un garage ou une copropriété&nbsp;: nous l\'enlevons gratuitement si elle est complète et que vous en êtes le titulaire. Elle est remise à un centre VHU agréé, qui délivre le certificat de destruction et déclare la cession pour vous.',
    etapes: ['Rendez-vous à la date qui vous convient.', 'Documents&nbsp;: certificat d\'immatriculation, pièce d\'identité du titulaire, certificat de situation administrative de moins de 15 jours (gratuit sur le site de l\'ANTS).', 'Enlèvement et remise au centre VHU agréé.', 'Certificat de destruction&nbsp;: il met fin à votre responsabilité et à l\'assurance du véhicule.'],
    attente: ['Videz le véhicule de vos affaires et retirez les plaques si le centre vous le demande.', 'Ne résiliez l\'assurance qu\'après la remise du certificat de destruction.', 'Pas de carte grise&nbsp;? Dites-le nous&nbsp;: une procédure existe, mais elle demande des justificatifs.'],
    faq: [
      ['L\'enlèvement est-il vraiment gratuit&nbsp;?', 'Oui pour un véhicule complet (moteur, pots, roues) accessible avec notre matériel. Un véhicule incomplet ou difficile d\'accès fait l\'objet d\'un devis.'],
      ['Puis-je faire enlever une épave dont je ne suis pas le titulaire&nbsp;?', 'Non&nbsp;: seul le titulaire (ou son héritier, avec justificatifs) peut céder le véhicule à un centre VHU. Pour une épave abandonnée sur votre terrain, il faut passer par la mairie ou la police.'],
    ],
    guides: ['guide-epave-demarches'],
  },
  {
    slug: 'gardiennage-vehicule-nice', cat: 'atelier', ic: 'box', presta: 'gardiennage', type: 'autre', quand: true,
    nom: 'Gardiennage', h1: 'Gardiennage de véhicule à Nice',
    titre: 'Gardiennage de véhicule à Nice — 48 h offertes',
    desc: 'Gardiennage de véhicule en panne ou accidenté à Nice, dans un lieu fermé : 48 h offertes, puis 10 € par jour. En attendant l\'expert, le garage ou une pièce.',
    resume: 'Lieu fermé à l\'atelier&nbsp;: 48 h offertes, puis 10&nbsp;€ par jour.',
    intro: 'Le garage ne peut pas prendre la voiture avant lundi, l\'expert passe dans trois jours, la pièce est commandée&nbsp;: plutôt que de laisser le véhicule dans la rue, nous le gardons à l\'atelier du Quai de la Blanquière, dans un lieu fermé.',
    etapes: ['Remorquage jusqu\'à l\'atelier, ou dépôt de votre part.', 'Gardiennage en lieu fermé&nbsp;: 48 premières heures offertes, puis 10&nbsp;€ par jour.', 'Accès pour l\'expert ou votre garagiste sur rendez-vous.', 'Livraison au garage choisi quand il est prêt.'],
    attente: ['Retirez les objets de valeur.', 'Prévenez votre assurance si un expert doit passer&nbsp;: donnez-lui notre adresse.'],
    faq: [
      ['Combien coûte le gardiennage&nbsp;?', 'Les 48 premières heures sont offertes, puis 10&nbsp;€ par jour.'],
      ['L\'expert de mon assurance peut-il voir le véhicule chez vous&nbsp;?', 'Oui, sur rendez-vous, pendant les heures d\'ouverture de l\'atelier.'],
    ],
    guides: ['guide-accident-constat-amiable', 'guide-assurance-assistance'],
  },
  {
    slug: 'diagnostic-electronique-nice', cat: 'atelier', ic: 'gauge', presta: 'diag-atelier', type: 'moteur',
    nom: 'Diagnostic électronique', h1: 'Diagnostic électronique à Nice&nbsp;: lecture des codes défauts',
    titre: 'Diagnostic électronique voiture à Nice — dès 49 €',
    desc: 'Voyant moteur allumé, perte de puissance à Nice : diagnostic électronique à la valise multimarque, dès 49 € à l\'atelier, 60 € sur place. Explication claire des codes défauts.',
    resume: 'Valise multimarque, lecture et explication des codes défauts&nbsp;: 49&nbsp;€ à l\'atelier, 60&nbsp;€ sur place.',
    intro: 'Voyant moteur orange, mode dégradé, message d\'erreur&nbsp;: la valise de diagnostic lit ce que le calculateur a enregistré. Nous vous expliquons ce que signifient les codes, ce qui est urgent et ce qui peut attendre, avant de parler réparation.',
    etapes: ['Branchement à la prise de diagnostic (OBD) et lecture des calculateurs.', 'Interprétation des codes défauts et vérification des causes probables.', 'Explication claire&nbsp;: rouler, ne pas rouler, réparer quoi.', 'Effacement des codes après réparation.'],
    attente: ['Voyant rouge ou clignotant&nbsp;: arrêtez-vous et ne roulez pas.', 'Voyant orange fixe&nbsp;: roulez doucement jusqu\'au rendez-vous.', 'Notez quand le problème apparaît (à froid, en montée, à l\'accélération).'],
    faq: [
      ['Le diagnostic suffit-il à réparer&nbsp;?', 'Non&nbsp;: il indique où chercher. Un code «&nbsp;sonde&nbsp;» peut venir de la sonde, du câblage ou d\'un autre défaut. Nous vérifions avant de remplacer quoi que ce soit.'],
    ],
    guides: ['guide-voyants-tableau-de-bord', 'guide-voiture-ne-demarre-pas'],
  },
  {
    slug: 'recharge-climatisation-nice', cat: 'atelier', ic: 'snow', presta: 'clim', type: 'autre', quand: true,
    nom: 'Recharge de climatisation', h1: 'Recharge de climatisation à Nice',
    titre: 'Recharge de climatisation auto à Nice — dès 50 €',
    desc: 'Clim qui ne refroidit plus à Nice : contrôle d\'étanchéité et recharge de climatisation à l\'atelier, dès 50 €. Sur rendez-vous.',
    resume: 'Contrôle d\'étanchéité et recharge à l\'atelier, dès 50&nbsp;€, sur rendez-vous.',
    intro: 'Sur la Côte d\'Azur, une clim qui souffle tiède n\'est pas un luxe à réparer. Une climatisation perd naturellement un peu de gaz chaque année&nbsp;; si elle en perd beaucoup, c\'est une fuite, et recharger sans la chercher, c\'est payer pour rien.',
    etapes: ['Contrôle de pression et recherche de fuite.', 'Tirage au vide et recharge à la quantité prévue par le constructeur.', 'Contrôle de la température de soufflage.', 'Fuite importante&nbsp;: devis de réparation avant toute recharge.'],
    attente: ['Notez depuis quand la clim faiblit.', 'Une odeur désagréable à la mise en route indique souvent un filtre d\'habitacle à changer.'],
    faq: [
      ['Combien coûte une recharge de clim&nbsp;?', 'Dès 50&nbsp;€ pour les véhicules au gaz R134a. Les véhicules récents au gaz R1234yf sont sur devis, ce gaz étant nettement plus cher.'],
    ],
    guides: ['guide-surchauffe-moteur'],
  },
  {
    slug: 'reparation-mecanique-nice', cat: 'atelier', ic: 'wrench', presta: 'diag-atelier', prixTxt: 'Sur devis', type: 'autre', quand: true,
    nom: 'Réparations mécaniques', h1: 'Réparations mécaniques à l\'atelier de Nice',
    titre: 'Réparation mécanique à Nice — atelier Quai de la Blanquière',
    desc: 'Réparations mécaniques courantes à l\'atelier du Quai de la Blanquière, à Nice : démarreur, alternateur, freins, courroie, échappement, batterie. Sur devis, sur rendez-vous.',
    resume: 'Démarreur, alternateur, freins, courroies, échappement, entretien&nbsp;: sur devis, sur rendez-vous.',
    intro: 'Quand la panne ne se règle pas sur le bord de la route, le véhicule vient à l\'atelier du Quai de la Blanquière. Nous réparons ce qui peut l\'être rapidement et vous proposons toujours un devis avant d\'engager une réparation.',
    etapes: ['Diagnostic à l\'atelier, dès 49&nbsp;€.', 'Devis détaillé&nbsp;: pièces, main-d\'œuvre, délai.', 'Réparation après votre accord.', 'Restitution ou livraison du véhicule.'],
    attente: ['Si le véhicule roule, prenez rendez-vous en ligne («&nbsp;plus tard&nbsp;»).', 'S\'il ne roule pas, nous le remorquons jusqu\'à l\'atelier.'],
    faq: [
      ['Réparez-vous toutes les marques&nbsp;?', 'Oui pour les réparations courantes. Pour les interventions qui exigent un outil constructeur, nous vous orientons vers le concessionnaire et nous pouvons y transporter le véhicule.'],
    ],
    guides: ['guide-voyants-tableau-de-bord', 'guide-choisir-un-depanneur'],
  },
];

// Prix « dès … » calculé depuis la grille : jamais saisi à la main ici.
for (const s of S) s.prix = s.prixTxt || des(s.presta);

module.exports = { CATS, SERVICES: S };
