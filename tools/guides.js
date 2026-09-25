// =============================================
// GUIDES ET CONSEILS — une page par guide (tools/build-guides.js),
// plus la page d'accueil des guides (conseils.html).
//
// Règles de rédaction : informations générales vérifiables (Code de la
// route, Code des assurances, pratiques d'atelier), aucun chiffre qui
// change chaque année (tarif réglementé autoroute, montants d'amende),
// aucune promesse de délai. Les espaces avant « ? : ! ; » sont rendues
// insécables automatiquement au moment de la génération.
// =============================================

const MAJ = '2026-09-25';

const CATS = [
  { id: 'urgence', titre: 'En pleine panne', sub: 'Les bons réflexes, là, maintenant.' },
  { id: 'diagnostic', titre: 'Comprendre la panne', sub: 'Ce qui se passe, ce qu\'on peut faire soi-même, quand appeler.' },
  { id: 'demarches', titre: 'Assurance et démarches', sub: 'Qui paie, quels papiers, comment éviter les mauvaises surprises.' },
];

const G = [
  {
    slug: 'guide-que-faire-en-cas-de-panne', cat: 'urgence', ic: 'alert', min: 4,
    titre: 'Panne de voiture : les bons réflexes pour rester en sécurité',
    title: 'Que faire en cas de panne de voiture ? Les 6 bons réflexes',
    desc: 'Panne sur la route à Nice ou ailleurs : se garer, gilet, warnings, triangle, s\'abriter, appeler. Et ce qu\'il faut dire au dépanneur pour qu\'il arrive vite avec le bon matériel.',
    essentiel: ['Garez-vous le plus à droite possible, warnings allumés.', 'Enfilez le gilet avant de sortir, sortez côté trottoir.', 'Mettez tout le monde à l\'abri, loin de la circulation.', 'Appelez : 112 s\'il y a un danger, sinon le dépanneur.'],
    services: ['remorquage-voiture-nice', 'depannage-batterie-nice', 'pneu-creve-nice'],
    corps: `
<h2>1. Se mettre hors de la circulation</h2>
<p>Dès les premiers signes (bruit, voyant rouge, perte de puissance), allumez les feux de détresse et rangez-vous le plus à droite possible : accotement, parking, entrée de chemin. Évitez de vous arrêter dans un virage, en haut d'une côte, sur un pont ou dans un tunnel si le véhicule peut encore avancer de quelques mètres.</p>
<h2>2. Gilet d'abord, puis sortir du bon côté</h2>
<p>Le gilet haute visibilité doit être à portée de main sans sortir du véhicule : enfilez-le avant d'ouvrir la portière, et sortez côté trottoir ou accotement. Faites sortir les passagers du même côté, enfants et animaux compris.</p>
<h2>3. Le triangle, si c'est sans danger</h2>
<p>En ville et sur route, placez le triangle de présignalisation à au moins 30 mètres en amont du véhicule, en marchant sur l'accotement. <strong>Sur autoroute et voie rapide, ne le posez pas</strong> : traverser ou longer la voie est trop dangereux. Voir notre guide <a href="guide-panne-autoroute-a8.html">panne sur l'A8</a>.</p>
<h2>4. Se mettre à l'abri</h2>
<p>Ne restez pas dans le véhicule ni devant, ni derrière : un choc arrière est le principal danger d'une panne. Éloignez-vous sur le trottoir, derrière la glissière ou dans un endroit dégagé.</p>
<h2>5. Appeler la bonne personne</h2>
<ul>
<li><strong>112</strong> : blessé, incendie, véhicule dangereusement placé. Il fonctionne sans crédit et depuis toute l'Europe.</li>
<li><strong>Votre assistance</strong> (assurance, loueur, constructeur) si votre contrat en comprend une : elle peut prendre en charge le dépannage. Voir <a href="guide-assurance-assistance.html">assurance et assistance</a>.</li>
<li><strong>Un dépanneur</strong> dans les autres cas : à Nice, le <a href="tel:+33617684270">06 17 68 42 70</a>, 24h/24.</li>
</ul>
<h2>6. Ce qu'il faut dire au dépanneur</h2>
<p>Plus l'appel est précis, plus l'intervention est rapide et le prix juste :</p>
<ul>
<li>où vous êtes : adresse, numéro de sortie, repère visible, ou votre position GPS (sur WhatsApp, « Partager la position ») ;</li>
<li>le véhicule : modèle, boîte automatique ou manuelle, électrique ou non ;</li>
<li>ce qui s'est passé : bruit, voyant, fumée, crevaison, clés enfermées… ;</li>
<li>l'accès : parking souterrain (hauteur limite), rue étroite, roue bloquée ;</li>
<li>où vous voulez que le véhicule aille s'il doit être remorqué.</li>
</ul>
<p>Demandez le prix avant le départ de la dépanneuse. Un professionnel sérieux vous le donne sans difficulté.</p>`,
    faq: [
      ['Le gilet et le triangle sont-ils obligatoires ?', 'Oui : chaque véhicule doit avoir un gilet de haute visibilité à portée du conducteur et un triangle de présignalisation. Le gilet se porte dès qu\'on sort du véhicule immobilisé sur la chaussée ou ses abords.'],
      ['Faut-il appeler son assurance avant le dépanneur ?', 'Si votre contrat comprend une assistance, oui : c\'est elle qui doit organiser le dépannage pour le prendre en charge. Sinon, appelez directement un dépanneur.'],
    ],
  },
  {
    slug: 'guide-panne-autoroute-a8', cat: 'urgence', ic: 'route', min: 3,
    titre: 'Panne sur l\'autoroute A8 : qui appeler, combien ça coûte',
    title: 'Panne sur l\'autoroute A8 : borne orange, dépanneur agréé, tarif',
    desc: 'En panne sur l\'A8 entre Nice, Cannes et Menton : derrière la glissière, borne d\'appel orange ou 112. Seul le dépanneur agréé peut intervenir, au tarif réglementé. Et après ?',
    essentiel: ['Warnings, gilet, sortez côté droit et passez derrière la glissière.', 'Ne posez pas le triangle sur autoroute.', 'Appelez depuis une borne orange (tous les 2 km environ) ou le 112.', 'Seul le dépanneur agréé du secteur peut intervenir.'],
    services: ['remorquage-voiture-nice', 'gardiennage-vehicule-nice'],
    corps: `
<h2>Les gestes, dans l'ordre</h2>
<ol>
<li>Rangez-vous sur la bande d'arrêt d'urgence, le plus à droite possible, roues braquées vers l'extérieur. Allumez les feux de détresse.</li>
<li>Enfilez le gilet dans le véhicule, sortez côté droit, faites sortir tout le monde du même côté.</li>
<li>Passez <strong>derrière la glissière de sécurité</strong> et éloignez-vous du véhicule. Ne restez jamais dans l'habitacle.</li>
<li>Ne posez pas le triangle : le long d'une autoroute, marcher vers l'amont est trop dangereux.</li>
<li>Appelez depuis une <strong>borne d'appel d'urgence orange</strong>, en marchant derrière la glissière (des flèches indiquent la plus proche), ou composez le <strong>112</strong>.</li>
</ol>
<h2>Pourquoi nous ne pouvons pas venir vous chercher</h2>
<p>Sur les autoroutes concédées comme l'A8, le dépannage est réservé aux dépanneurs agréés pour chaque secteur, qui interviennent à la demande du centre d'exploitation. C'est une règle de sécurité : ils connaissent les accès, les interdistances et les procédures de balisage. Un dépanneur non agréé n'a pas le droit d'intervenir, même si vous l'appelez directement.</p>
<h2>Combien ça coûte ?</h2>
<p>Le prix du dépannage et du remorquage sur autoroute est <strong>réglementé</strong> : il est fixé chaque année par arrêté ministériel, selon le poids du véhicule, et majoré la nuit, le week-end et les jours fériés. Le dépanneur agréé doit l'afficher et vous remettre une facture. Si votre contrat comprend une assistance, contactez-la : elle rembourse souvent ce dépannage.</p>
<h2>Et après ?</h2>
<p>Le dépanneur agréé sort le véhicule de l'autoroute et le dépose à son dépôt, généralement proche de la sortie. Si vous voulez ensuite le faire transporter chez votre garagiste ou à notre atelier de Nice, nous pouvons prendre le relais depuis ce dépôt : c'est alors un <a href="remorquage-voiture-nice.html">remorquage classique</a>, au prix de notre grille.</p>
<h2>Voies rapides et tunnels</h2>
<p>Sur certaines voies rapides et dans les grands tunnels, l'intervention passe aussi par l'exploitant de la voie. En cas de doute, le 112 vous oriente. Voir <a href="guide-panne-tunnel.html">panne dans un tunnel</a>.</p>`,
    faq: [
      ['Puis-je appeler mon propre dépanneur sur l\'autoroute ?', 'Non : sur les autoroutes concédées, seul le dépanneur agréé du secteur peut intervenir. Vous pouvez en revanche faire transporter le véhicule par le dépanneur de votre choix une fois qu\'il est sorti de l\'autoroute.'],
      ['Mon assurance rembourse-t-elle le dépannage sur autoroute ?', 'Si votre contrat comprend une assistance, en général oui, sur présentation de la facture. Appelez-la dès que possible pour connaître la marche à suivre.'],
    ],
  },
  {
    slug: 'guide-panne-tunnel', cat: 'urgence', ic: 'alert', min: 3,
    titre: 'Panne dans un tunnel : les réflexes qui sauvent',
    title: 'Panne dans un tunnel (Nice, Monaco, A8) : que faire ?',
    desc: 'Tunnels de la Côte d\'Azur, de Monaco ou de l\'A8 : warnings, se garer, couper le moteur, rejoindre une niche de sécurité. Et en cas de fumée, évacuer à pied sans attendre.',
    essentiel: ['Warnings, rangez-vous à droite ou dans une zone d\'arrêt, coupez le moteur.', 'Laissez la clé sur le contact, prenez votre téléphone.', 'Rejoignez à pied une niche de sécurité et appelez depuis son téléphone d\'urgence.', 'Fumée ou feu : sortez par l\'issue de secours la plus proche.'],
    services: ['remorquage-voiture-nice', 'surchauffe-moteur-nice'],
    corps: `
<h2>Si le véhicule peut encore rouler</h2>
<p>Essayez de sortir du tunnel : une panne à l'air libre est beaucoup plus sûre. Sinon, rejoignez une zone d'arrêt d'urgence ou la bande de droite, feux de détresse allumés.</p>
<h2>Une fois arrêté</h2>
<ol>
<li>Coupez le moteur, <strong>laissez la clé sur le contact</strong> (les secours doivent pouvoir déplacer le véhicule) et le véhicule déverrouillé.</li>
<li>Enfilez le gilet, sortez côté paroi, prenez votre téléphone.</li>
<li>Rejoignez à pied la <strong>niche de sécurité</strong> la plus proche : signalée par un panneau, elle comporte un téléphone d'urgence relié à l'exploitant du tunnel et un extincteur.</li>
<li>Appelez depuis ce téléphone : l'exploitant sait où vous êtes et peut protéger la zone. Sinon, composez le 112.</li>
</ol>
<h2>En cas de fumée ou de feu</h2>
<p>N'attendez pas : laissez le véhicule, clé sur le contact, et marchez vers l'<strong>issue de secours</strong> la plus proche (panneaux verts), dans le sens opposé à la fumée. Ne faites jamais demi-tour en voiture dans un tunnel.</p>
<h2>Qui intervient ?</h2>
<p>Dans les tunnels d'autoroute et de certaines voies rapides, c'est l'exploitant qui organise l'intervention, avec un dépanneur agréé. Dans un tunnel urbain, le 112 ou l'exploitant vous indique la marche à suivre ; une fois le véhicule sorti du tunnel, nous pouvons le <a href="remorquage-voiture-nice.html">remorquer</a> jusqu'à l'atelier ou votre garage.</p>`,
  },
  {
    slug: 'guide-accident-constat-amiable', cat: 'urgence', ic: 'file', min: 5,
    titre: 'Accident de voiture : sécurité, constat amiable, remorquage',
    title: 'Accident de voiture : que faire ? Constat amiable et délais',
    desc: 'Après un accident : protéger, alerter, secourir, puis remplir le constat amiable, prendre des photos et déclarer le sinistre sous 5 jours ouvrés. Et que faire du véhicule qui ne roule plus.',
    essentiel: ['Blessé : 112, ne déplacez pas la personne.', 'Protégez la zone : warnings, gilets, triangle hors autoroute.', 'Constat amiable rempli et signé par les deux conducteurs, photos.', 'Déclaration à l\'assureur dans les 5 jours ouvrés.'],
    services: ['depannage-accident-nice', 'gardiennage-vehicule-nice'],
    corps: `
<h2>Protéger, alerter, secourir</h2>
<ul>
<li><strong>Protéger</strong> : feux de détresse, gilets pour tous, triangle à 30 m en amont (sauf sur autoroute), passagers à l'abri.</li>
<li><strong>Alerter</strong> : le <strong>112</strong> s'il y a un blessé, un risque d'incendie ou une fuite de carburant (ou le 15 SAMU, le 17 police, le 18 pompiers ; le 114 par SMS pour les personnes sourdes ou malentendantes).</li>
<li><strong>Secourir</strong> : ne déplacez pas un blessé, sauf danger immédiat ; ne retirez pas le casque d'un motard.</li>
</ul>
<h2>Le constat amiable</h2>
<p>S'il n'y a que des dégâts matériels, remplissez un constat amiable avec l'autre conducteur, sur place, avant de déplacer les véhicules si c'est sans danger :</p>
<ul>
<li>un seul constat pour deux véhicules, chacun garde un exemplaire ;</li>
<li>cochez les cases qui décrivent les circonstances et <strong>indiquez leur nombre</strong> en bas de colonne ;</li>
<li>faites le croquis : position des véhicules, sens de circulation, signalisation ;</li>
<li>ne signez pas un constat avec lequel vous n'êtes pas d'accord : notez vos observations dans la case prévue ;</li>
<li>il existe aussi un constat en ligne (e-constat auto) sur smartphone.</li>
</ul>
<p>Prenez des photos : les véhicules, les dégâts, la plaque de l'autre véhicule, la signalisation, la route. Notez les coordonnées d'éventuels témoins.</p>
<h2>Déclarer le sinistre</h2>
<p>Le Code des assurances vous laisse <strong>5 jours ouvrés</strong> pour déclarer l'accident à votre assureur (2 jours ouvrés en cas de vol). Envoyez-lui votre exemplaire du constat et vos photos.</p>
<h2>Le véhicule ne roule plus</h2>
<p>Si votre contrat comprend une assistance, appelez-la : elle organise et paie souvent le remorquage. Sinon, nous enlevons le véhicule, même roues bloquées, et le déposons chez votre garagiste, votre carrossier ou à notre atelier, où il peut attendre l'expert : les <a href="gardiennage-vehicule-nice.html">48 premières heures de gardiennage</a> sont offertes.</p>`,
    faq: [
      ['Combien de temps pour envoyer le constat à l\'assurance ?', '5 jours ouvrés à compter de l\'accident, selon le Code des assurances. Mieux vaut le faire dès le lendemain.'],
      ['L\'autre conducteur refuse de remplir le constat.', 'Relevez sa plaque d\'immatriculation, prenez des photos, notez les témoins et remplissez le constat seul. Prévenez votre assureur ; en cas de délit de fuite, portez plainte.'],
    ],
  },
  {
    slug: 'guide-voiture-de-location-en-panne', cat: 'urgence', ic: 'car', min: 3,
    titre: 'Voiture de location en panne sur la Côte d\'Azur',
    title: 'Voiture de location en panne à Nice : qui appeler en premier ?',
    desc: 'Vacances sur la Côte d\'Azur, voiture de location en panne : appelez d\'abord l\'assistance du loueur. Pourquoi, et que faire si elle ne répond pas ou tarde trop.',
    essentiel: ['Appelez d\'abord le numéro d\'assistance du loueur.', 'Il figure souvent sur le porte-clés, le pare-brise ou le contrat.', 'Une intervention qu\'il n\'a pas autorisée peut rester à vos frais.', 'Gardez photos, factures et noms des interlocuteurs.'],
    services: ['depannage-aeroport-nice', 'ouverture-porte-voiture-nice', 'erreur-carburant-nice'],
    corps: `
<h2>Le loueur d'abord</h2>
<p>Le contrat de location comprend presque toujours une assistance. Le loueur veut choisir qui intervient sur son véhicule et où il est emmené. Si vous appelez un dépanneur de votre côté sans son accord, il peut refuser de payer et, dans certains cas, vous facturer des frais. Le numéro est souvent sur le porte-clés, un autocollant du pare-brise ou le contrat (et dans l'application du loueur).</p>
<h2>Les pannes que l'assistance ne couvre pas toujours</h2>
<ul>
<li><strong>Erreur de carburant</strong> : fréquente avec un véhicule inconnu (diesel au lieu d'essence). Elle est souvent exclue ou facturée. Ne démarrez pas et prévenez le loueur. Voir <a href="guide-erreur-de-carburant.html">erreur de carburant</a>.</li>
<li><strong>Clés perdues ou enfermées</strong> : souvent à votre charge.</li>
<li><strong>Crevaison</strong> : selon les options souscrites.</li>
</ul>
<h2>Si l'assistance ne répond pas ou tarde</h2>
<p>Demandez-lui par écrit (SMS, e-mail, application) l'autorisation de faire appel à un dépanneur local et de vous faire rembourser sur facture. Avec cet accord, nous intervenons et vous remettons une facture détaillée.</p>
<h2>Vous ne parlez pas français ?</h2>
<p>Écrivez-nous sur <a href="https://wa.me/33617684270" rel="noopener">WhatsApp</a> : votre position, une photo et quelques mots suffisent, et un message écrit se traduit facilement. Pages en <a href="en/">anglais</a> et en <a href="it/">italien</a>.</p>`,
  },

  // ── Comprendre la panne ─────────────────────
  {
    slug: 'guide-voiture-ne-demarre-pas', cat: 'diagnostic', ic: 'key', min: 5,
    titre: 'Ma voiture ne démarre pas : trouver la cause en 5 questions',
    title: 'Voiture qui ne démarre pas : causes et solutions en 5 questions',
    desc: 'Rien ne s\'allume, un clic, le démarreur tourne mais le moteur ne part pas : chaque symptôme oriente vers une cause. Batterie, démarreur, carburant, antidémarrage.',
    essentiel: ['Rien ne s\'allume ou un « clic » : presque toujours la batterie.', 'Le démarreur tourne mais le moteur ne part pas : carburant, allumage ou antidémarrage.', 'Ne démarrez pas en boucle : vous videz la batterie.', 'Voyant clé ou antidémarrage : essayez le double de la clé.'],
    services: ['depannage-batterie-nice', 'diagnostic-electronique-nice', 'panne-seche-nice'],
    corps: `
<h2>1. Le tableau de bord s'allume-t-il ?</h2>
<p><strong>Rien du tout</strong> : batterie complètement vide, borne de batterie desserrée ou oxydée. <strong>Les voyants s'allument puis s'éteignent quand vous tournez la clé</strong> : batterie trop faible pour lancer le démarreur.</p>
<h2>2. Qu'entendez-vous en tournant la clé ?</h2>
<ul>
<li><strong>Un clic, ou une série de clics</strong> : batterie faible dans la plupart des cas, parfois le démarreur.</li>
<li><strong>Le démarreur tourne lentement</strong> : batterie fatiguée, souvent après une nuit froide ou une semaine sans rouler.</li>
<li><strong>Le démarreur tourne normalement, le moteur ne part pas</strong> : ce n'est pas la batterie. Pensez carburant (jauge, erreur à la pompe), allumage, pompe à carburant ou antidémarrage.</li>
<li><strong>Aucun bruit, voyants normaux</strong> : démarreur, contacteur, ou sécurité (levier pas sur P ou N en boîte automatique, pédale d'embrayage ou de frein pas assez enfoncée).</li>
</ul>
<h2>3. Un voyant en forme de clé ou de voiture avec un cadenas ?</h2>
<p>C'est l'<strong>antidémarrage</strong> : la voiture ne reconnaît pas la clé (pile de télécommande vide, clé abîmée). Essayez le double. Sur beaucoup de modèles « mains libres », poser la clé contre la zone indiquée par le manuel permet de démarrer même avec une pile vide.</p>
<h2>4. Que s'est-il passé avant ?</h2>
<ul>
<li>Plusieurs jours sans rouler, phares ou plafonnier restés allumés : batterie.</li>
<li>Plein fait juste avant : <a href="guide-erreur-de-carburant.html">erreur de carburant</a> possible, ne réessayez pas.</li>
<li>Voyant de batterie allumé en roulant la veille : alternateur, la batterie ne se recharge plus.</li>
</ul>
<h2>5. Que pouvez-vous faire sans risque ?</h2>
<ul>
<li>Coupez tout (phares, clim, radio) et attendez une minute avant un nouvel essai.</li>
<li>Pas plus de trois essais de quelques secondes : au-delà, vous videz la batterie et chauffez le démarreur.</li>
<li>Démarrage avec des câbles : possible, en respectant l'ordre de branchement (voir <a href="guide-batterie-a-plat.html">batterie à plat</a>).</li>
</ul>
<p>Si rien ne fonctionne, un dépanneur équipé d'un booster et d'une valise de diagnostic trouve la cause en quelques minutes, dans la rue comme en <a href="depannage-parking-souterrain-nice.html">parking souterrain</a>.</p>`,
  },
  {
    slug: 'guide-batterie-a-plat', cat: 'diagnostic', ic: 'battery', min: 5,
    titre: 'Batterie à plat : redémarrer, recharger ou changer ?',
    title: 'Batterie de voiture à plat : câbles, booster, quand la changer',
    desc: 'Batterie à plat : comment brancher des câbles sans risque, que vaut un booster, comment savoir si la batterie est morte, combien de temps elle dure et laquelle choisir (Start & Stop).',
    essentiel: ['Câbles : + sur +, puis − sur une masse métallique, jamais l\'inverse.', 'Une batterie dure en général 4 à 6 ans, moins avec la chaleur.', 'Start & Stop : batterie EFB ou AGM obligatoire.', 'Une batterie qui se vide à répétition cache souvent un autre problème.'],
    services: ['depannage-batterie-nice', 'diagnostic-electronique-nice'],
    corps: `
<h2>Pourquoi une batterie se décharge</h2>
<p>Phares ou plafonnier oubliés, véhicule qui ne roule pas pendant une ou deux semaines, petits trajets en ville qui ne laissent pas le temps de recharger, et surtout l'âge : une batterie perd de sa capacité chaque année. Sur la Côte d'Azur, la chaleur de l'été l'use autant que le froid, même si c'est souvent au premier matin frais que la panne se déclare.</p>
<h2>Démarrer avec des câbles, dans le bon ordre</h2>
<ol>
<li>Les deux moteurs coupés, véhicules sans contact.</li>
<li>Pince rouge sur la borne + de la batterie à plat, puis sur la borne + de la batterie qui aide.</li>
<li>Pince noire sur la borne − de la batterie qui aide, puis sur une <strong>partie métallique nue du moteur</strong> du véhicule en panne, loin de la batterie (pas sur sa borne −).</li>
<li>Démarrez le véhicule qui aide, attendez deux minutes, puis démarrez le véhicule en panne.</li>
<li>Débranchez dans l'ordre inverse et roulez au moins 30 minutes.</li>
</ol>
<p>Ne le faites pas si la batterie est gonflée, fissurée ou si elle fuit, ni sur certains véhicules hybrides ou électriques dont le manuel l'interdit.</p>
<h2>Le booster</h2>
<p>Un booster (batterie portable) remplace le second véhicule. Les modèles professionnels démarrent les gros diesels sans risque pour l'électronique. C'est ce que nous utilisons.</p>
<h2>Recharger ou changer ?</h2>
<p>Une batterie qui a été vidée une fois se recharge. En revanche, si elle ne tient plus la charge après une nuit, si elle a plus de 5 ou 6 ans, ou si le démarrage est paresseux tous les matins, elle est à remplacer. Un test de charge (et de l'alternateur) tranche en deux minutes : une batterie neuve ne sert à rien si l'alternateur ne la recharge pas.</p>
<h2>Quelle batterie choisir ?</h2>
<ul>
<li>Respectez la capacité (Ah) et le courant de démarrage (A) indiqués par le constructeur, et le format.</li>
<li><strong>Start & Stop</strong> : batterie <strong>EFB</strong> ou <strong>AGM</strong> obligatoire (celle d'origine l'indique). Une batterie classique y meurt en quelques mois.</li>
<li>Sur certains véhicules, la nouvelle batterie doit être déclarée au calculateur, avec une valise de diagnostic.</li>
</ul>
<h2>L'ancienne batterie</h2>
<p>Elle contient du plomb et de l'acide : elle se rapporte chez un professionnel ou en déchetterie, jamais à la poubelle. Quand nous remplaçons une batterie, nous reprenons l'ancienne.</p>`,
    faq: [
      ['Combien de temps dure une batterie de voiture ?', 'En général 4 à 6 ans. La chaleur, les petits trajets et les longues périodes sans rouler réduisent cette durée.'],
      ['Peut-on démarrer une voiture Start & Stop avec des câbles ?', 'Oui dans la plupart des cas, en suivant le manuel : certains modèles imposent un point de branchement précis sous le capot.'],
    ],
  },
  {
    slug: 'guide-pneu-creve', cat: 'diagnostic', ic: 'wheel', min: 5,
    titre: 'Pneu crevé : réparer, changer la roue ou appeler ?',
    title: 'Pneu crevé : réparable ou non ? Roue galette, kit, mèche',
    desc: 'Pneu crevé : quand il se répare, quand il faut le changer, les limites d\'une roue galette et d\'un kit anti-crevaison, et comment changer une roue en sécurité.',
    essentiel: ['Arrêtez-vous vite : rouler à plat détruit le pneu.', 'Réparable : petite perforation sur la bande de roulement.', 'À remplacer : flanc coupé, pneu roulé à plat, grosse déchirure.', 'Roue galette : 80 km/h au maximum, pour rejoindre un pneumaticien.'],
    services: ['pneu-creve-nice', 'perte-cle-voiture-nice'],
    corps: `
<h2>Reconnaître la crevaison</h2>
<p>Volant qui tire d'un côté, vibrations, bruit sourd, voyant de pression des pneus : ralentissez sans freiner brutalement et arrêtez-vous en sécurité. Chaque kilomètre roulé à plat abîme la carcasse du pneu, qui ne pourra plus être réparé, et parfois la jante.</p>
<h2>Réparable ou pas ?</h2>
<ul>
<li><strong>Souvent réparable</strong> : un clou ou une vis sur la bande de roulement (la partie qui touche la route), perforation de quelques millimètres, pneu qui n'a pas roulé à plat.</li>
<li><strong>À remplacer</strong> : coupure ou hernie sur le flanc, déchirure, pneu roulé à plat (marques à l'intérieur), pneu déjà réparé au même endroit.</li>
</ul>
<p>La <strong>mèche</strong> posée de l'extérieur est une réparation de dépannage. Un pneumaticien la remplacera de préférence par une réparation par l'intérieur (champignon), après avoir démonté le pneu pour vérifier qu'il n'est pas abîmé.</p>
<h2>Roue de secours, galette, kit</h2>
<ul>
<li><strong>Roue de secours normale</strong> : vous repartez normalement, faites réparer le pneu crevé rapidement.</li>
<li><strong>Roue galette</strong> (plus étroite) : 80 km/h au maximum, sur une courte distance, le temps de rejoindre un pneumaticien.</li>
<li><strong>Kit anti-crevaison</strong> (bombe + compresseur) : efficace pour une petite perforation sur la bande de roulement ; inutile sur un flanc coupé. Le pneu doit ensuite être vu par un professionnel.</li>
<li><strong>Pneus « runflat »</strong> : ils permettent de rouler quelques dizaines de kilomètres à vitesse réduite (voir le manuel) jusqu'à un professionnel.</li>
</ul>
<h2>Changer la roue en sécurité</h2>
<ol>
<li>Sol plat et dur, loin de la circulation, frein à main serré, première ou P engagée.</li>
<li>Desserrez légèrement les écrous <strong>avant</strong> de lever la voiture.</li>
<li>Placez le cric au point prévu (voir le manuel), levez, dévissez, changez la roue.</li>
<li>Serrez en croix, reposez la voiture, resserrez fermement.</li>
</ol>
<p>Sur autoroute ou voie rapide, ne changez pas la roue vous-même côté circulation. Écrou antivol sans sa clé : nous le débloquons (voir <a href="perte-cle-voiture-nice.html">clés et antivol</a>).</p>`,
    faq: [
      ['Faut-il changer les deux pneus d\'un même essieu ?', 'Si le pneu neuf est très différent de l\'autre (usure, modèle), c\'est recommandé : deux pneus d\'un même essieu doivent être de même dimension et de même type, et une usure trop différente dégrade la tenue de route.'],
      ['La réparation par mèche est-elle légale ?', 'Oui comme dépannage. Pour une réparation durable, un pneumaticien démonte le pneu et le répare par l\'intérieur.'],
    ],
  },
  {
    slug: 'guide-erreur-de-carburant', cat: 'diagnostic', ic: 'fuel', min: 4,
    titre: 'Erreur de carburant : essence, gazole ou AdBlue, que faire ?',
    title: 'Erreur de carburant : essence dans un diesel, que faire ?',
    desc: 'Essence dans un diesel, gazole dans une essence, AdBlue dans le réservoir : ne démarrez pas. Ce qui se passe, ce que coûte une vidange et ce que couvre l\'assurance.',
    essentiel: ['Ne démarrez pas, ne mettez même pas le contact.', 'Déjà démarré : arrêtez-vous tout de suite et coupez le moteur.', 'Une vidange du réservoir suffit si le moteur n\'a pas tourné.', 'AdBlue dans le carburant : ne démarrez surtout pas.'],
    services: ['erreur-carburant-nice'],
    corps: `
<h2>Pourquoi il ne faut pas démarrer</h2>
<p>Dès le contact (et sur beaucoup de voitures dès l'ouverture de la portière), la pompe envoie du carburant vers le moteur. Sur un diesel moderne, l'<strong>essence</strong> prive la pompe haute pression de la lubrification que lui apporte le gazole : quelques minutes suffisent à l'abîmer, avec les injecteurs. Tant que rien n'a circulé, vider le réservoir suffit.</p>
<h2>Les trois cas</h2>
<ul>
<li><strong>Essence dans un diesel</strong> : le plus fréquent et le plus coûteux s'il roule. Ne démarrez pas.</li>
<li><strong>Gazole dans une essence</strong> : plus rare (pistolet plus gros), le moteur cale ou fume. Ne démarrez pas non plus.</li>
<li><strong>AdBlue dans le réservoir de carburant</strong> : l'AdBlue est corrosif pour le circuit. Aucun démarrage, aucun contact.</li>
</ul>
<h2>Vous avez déjà roulé ?</h2>
<p>Si le moteur a des ratés, fume ou perd de la puissance après le plein, arrêtez-vous dès que possible et coupez le moteur. Après la vidange, un contrôle du circuit (et parfois des filtres) sera nécessaire.</p>
<h2>Ce qu'on fait sur place</h2>
<ol>
<li>Le véhicule est poussé à l'écart si la station le demande, sans démarrer.</li>
<li>Le réservoir est vidé par pompe, le carburant souillé récupéré pour être traité.</li>
<li>Le circuit est rincé, le bon carburant mis, le moteur redémarré et contrôlé.</li>
</ol>
<h2>Qui paie ?</h2>
<p>L'erreur de carburant est souvent exclue des contrats d'assurance et des assistances, ou couverte par une option. Vérifiez votre contrat. Avec une voiture de location, prévenez le loueur. Voir <a href="guide-assurance-assistance.html">assurance et assistance</a>.</p>`,
    faq: [
      ['J\'ai mis un peu d\'essence dans mon diesel, je peux rouler ?', 'Ne prenez pas le risque : même un faible pourcentage d\'essence peut abîmer la pompe haute pression d\'un diesel récent. Une vidange coûte bien moins cher qu\'une pompe et des injecteurs.'],
    ],
  },
  {
    slug: 'guide-panne-seche', cat: 'diagnostic', ic: 'fuel', min: 3,
    titre: 'Panne sèche : que faire quand il n\'y a plus de carburant',
    title: 'Panne sèche : que faire, combien de km sur la réserve ?',
    desc: 'Plus d\'essence ou de gazole : se mettre en sécurité, ne pas insister sur le démarreur, se faire livrer du carburant. Autonomie sur la réserve et cas des voitures électriques.',
    essentiel: ['Profitez de l\'élan pour vous garer hors de la circulation.', 'N\'insistez pas sur le démarreur, surtout en diesel.', 'Sur autoroute : borne orange ou 112, dépanneur agréé.', 'Électrique à 0 % : remorquage sur plateau jusqu\'à une borne.'],
    services: ['panne-seche-nice', 'depannage-voiture-electrique-nice'],
    corps: `
<h2>Les signes</h2>
<p>Le moteur a des à-coups, perd de la puissance, puis s'arrête, alors que la jauge était basse. Profitez de l'élan pour sortir de la voie : parking, accotement, bretelle. Warnings, gilet, sortie côté trottoir.</p>
<h2>Combien de kilomètres sur la réserve ?</h2>
<p>Cela dépend entièrement du modèle : souvent quelques dizaines de kilomètres quand le voyant s'allume, parfois moins. L'autonomie affichée par l'ordinateur de bord baisse très vite en montée et dans les bouchons. Sur les routes de l'arrière-pays niçois, les stations sont rares : faites le plein avant de monter.</p>
<h2>Ce qu'il ne faut pas faire</h2>
<ul>
<li>Insister sur le démarreur : vous videz la batterie, et un diesel peut aspirer de l'air dans le circuit.</li>
<li>Marcher sur une voie rapide pour rejoindre une station.</li>
<li>Remplir un jerricane non homologué.</li>
</ul>
<h2>La solution</h2>
<p>Un dépanneur vous livre quelques litres, réamorce le circuit si c'est un diesel récent et redémarre le moteur : vous rejoignez ensuite la station la plus proche. Sur autoroute, seul le dépanneur agréé peut intervenir (<a href="guide-panne-autoroute-a8.html">voir l'A8</a>).</p>
<h2>Voiture électrique ou hybride rechargeable</h2>
<p>Une électrique à 0 % ne se recharge pas utilement au bord de la route : elle est transportée sur plateau jusqu'à une borne ou à votre domicile. Voir <a href="guide-voiture-electrique-en-panne.html">voiture électrique en panne</a>.</p>`,
  },
  {
    slug: 'guide-surchauffe-moteur', cat: 'diagnostic', ic: 'thermo', min: 4,
    titre: 'Surchauffe moteur et canicule : protéger sa voiture l\'été',
    title: 'Surchauffe moteur : que faire ? Voiture et canicule sur la Côte d\'Azur',
    desc: 'Voyant de température rouge, vapeur sous le capot : s\'arrêter, couper le moteur, ne pas ouvrir le vase d\'expansion. Et comment préparer sa voiture aux étés de la Côte d\'Azur.',
    essentiel: ['Voyant rouge : arrêtez-vous et coupez le moteur.', 'N\'ouvrez jamais le vase d\'expansion moteur chaud.', 'En attendant de pouvoir s\'arrêter : chauffage à fond, clim coupée.', 'Avant l\'été : niveau de liquide, ventilateur, batterie, pression des pneus.'],
    services: ['surchauffe-moteur-nice', 'recharge-climatisation-nice'],
    corps: `
<h2>Pourquoi l'été est à risque</h2>
<p>Bouchons sur la Promenade et l'A8, montées vers l'arrière-pays, climatisation à fond, 35 °C à l'ombre : le circuit de refroidissement travaille à sa limite. Une petite fuite, un ventilateur qui ne se déclenche plus ou un thermostat bloqué suffisent alors à faire grimper la température.</p>
<h2>Les signes</h2>
<p>Aiguille de température qui monte, voyant rouge (thermomètre dans un liquide), vapeur blanche sous le capot, odeur sucrée de liquide de refroidissement.</p>
<h2>Que faire</h2>
<ol>
<li>Coupez la climatisation et mettez <strong>le chauffage à fond</strong>, ventilation au maximum : c'est désagréable, mais cela évacue de la chaleur du moteur le temps de trouver où s'arrêter.</li>
<li>Arrêtez-vous en sécurité et <strong>coupez le moteur</strong>.</li>
<li>N'ouvrez pas le capot s'il sort de la vapeur. N'ouvrez <strong>jamais</strong> le bouchon du vase d'expansion moteur chaud : le liquide est sous pression et peut provoquer de graves brûlures.</li>
<li>Attendez au moins 30 minutes avant de vérifier le niveau. Ne versez pas d'eau froide dans un moteur brûlant.</li>
</ol>
<p>Rouler malgré la surchauffe peut déformer la culasse : la réparation se compte alors en centaines, voire en milliers d'euros. Faites vérifier la cause avant de repartir.</p>
<h2>Préparer sa voiture pour l'été</h2>
<ul>
<li>Niveau de liquide de refroidissement, à froid, entre les repères.</li>
<li>Ventilateur : il doit se déclencher moteur chaud à l'arrêt.</li>
<li>Pression des pneus, à froid : la chaleur et la charge des vacances augmentent l'usure.</li>
<li>Batterie : la chaleur l'use, faites-la tester si elle a plus de 4 ans.</li>
<li>Climatisation : si elle faiblit, une <a href="recharge-climatisation-nice.html">recharge</a> avec recherche de fuite.</li>
<li>Freins : dans les longues descentes de l'arrière-pays, utilisez le frein moteur (rapport inférieur) pour éviter qu'ils ne chauffent.</li>
</ul>`,
  },
  {
    slug: 'guide-voyants-tableau-de-bord', cat: 'diagnostic', ic: 'gauge', min: 5,
    titre: 'Voyants du tableau de bord : lesquels imposent de s\'arrêter',
    title: 'Voyants du tableau de bord : rouge, orange, que faire ?',
    desc: 'Voyant rouge : arrêt immédiat. Voyant orange : anomalie à faire vérifier. Huile, température, freins, batterie, moteur, airbag, pression des pneus : la conduite à tenir pour chacun.',
    essentiel: ['Rouge : arrêtez-vous dès que possible, en sécurité.', 'Orange : anomalie, faites vérifier rapidement.', 'Voyant moteur orange clignotant : ralentissez et arrêtez-vous.', 'Le manuel du véhicule fait foi pour chaque symbole.'],
    services: ['diagnostic-electronique-nice', 'surchauffe-moteur-nice'],
    corps: `
<h2>Le code couleur</h2>
<ul>
<li><strong>Rouge</strong> : danger ou panne grave. Arrêtez-vous dès que possible, en sécurité, et coupez le moteur.</li>
<li><strong>Orange</strong> : anomalie. Vous pouvez en général rouler prudemment, mais faites vérifier rapidement.</li>
<li><strong>Vert ou bleu</strong> : simple information (feux, régulateur).</li>
</ul>
<h2>Les voyants rouges</h2>
<ul>
<li><strong>Pression d'huile</strong> (burette) : arrêt immédiat. Un moteur sans pression d'huile peut casser en quelques minutes.</li>
<li><strong>Température</strong> (thermomètre) : arrêt, moteur coupé. Voir <a href="guide-surchauffe-moteur.html">surchauffe</a>.</li>
<li><strong>Freins</strong> (cercle avec un point d'exclamation) : frein à main serré, niveau de liquide bas ou défaut du circuit. Si ce n'est pas le frein à main, ne roulez pas.</li>
<li><strong>Charge de la batterie</strong> (batterie) : l'alternateur ne recharge plus. Le véhicule roulera encore un peu, puis s'arrêtera : coupez tout ce qui consomme et allez au plus près en sécurité, ou arrêtez-vous.</li>
<li><strong>Direction assistée</strong> (volant) : direction très dure, roulez au pas jusqu'à un endroit sûr.</li>
</ul>
<h2>Les voyants orange</h2>
<ul>
<li><strong>Moteur</strong> (bloc moteur) : défaut antipollution ou capteur. <strong>Fixe</strong> : roulez doucement jusqu'au garage. <strong>Clignotant</strong> : ratés d'allumage, risque pour le catalyseur, réduisez la vitesse et arrêtez-vous.</li>
<li><strong>Préchauffage</strong> (spirale, diesel) qui clignote en roulant : défaut moteur, faites vérifier.</li>
<li><strong>Pression des pneus</strong> : vérifiez les quatre pneus à la prochaine station ; une crevaison lente est possible.</li>
<li><strong>ABS</strong> : les freins fonctionnent, sans antiblocage. Prudence.</li>
<li><strong>Airbag</strong> : les airbags peuvent ne pas se déclencher. À faire vérifier sans attendre.</li>
<li><strong>Filtre à particules</strong> : souvent après des petits trajets, un trajet sur voie rapide suffit parfois ; sinon, garage.</li>
<li><strong>AdBlue</strong> : niveau bas. Au-delà d'une certaine distance, le moteur refusera de redémarrer.</li>
</ul>
<h2>Et ensuite ?</h2>
<p>La <a href="diagnostic-electronique-nice.html">valise de diagnostic</a> lit les codes enregistrés et dit précisément ce qui a déclenché le voyant. C'est souvent plus simple (et moins cher) qu'on ne le craint.</p>`,
  },
  {
    slug: 'guide-voiture-electrique-en-panne', cat: 'diagnostic', ic: 'bolt', min: 4,
    titre: 'Voiture électrique ou hybride en panne : ce qu\'il faut savoir',
    title: 'Voiture électrique en panne : batterie 12 V, remorquage sur plateau',
    desc: 'Voiture électrique « chargée » qui ne démarre pas, batterie vide, accident : la batterie 12 V, le remorquage sur plateau obligatoire et les précautions liées à la haute tension.',
    essentiel: ['Une électrique chargée qui ne démarre pas : souvent la batterie 12 V.', 'Jamais de remorquage roues au sol, sauf indication du constructeur.', 'À 0 % : transport sur plateau jusqu\'à une borne.', 'Après un choc, fumée ou odeur : éloignez-vous et appelez le 112.'],
    services: ['depannage-voiture-electrique-nice', 'depannage-batterie-nice'],
    corps: `
<h2>La petite batterie 12 V</h2>
<p>Comme une thermique, une voiture électrique ou hybride a une batterie 12 V qui alimente l'électronique, l'ouverture des portes et la mise en route du système. Si elle est vide, la voiture reste « morte » même avec une grosse batterie de traction pleine. C'est une panne fréquente, surtout après une période sans rouler, et elle se règle souvent sur place.</p>
<h2>Pourquoi le plateau est obligatoire</h2>
<p>Sur la plupart des électriques, les roues motrices sont reliées en permanence au moteur. Tracter la voiture roues au sol fait tourner le moteur, qui produit du courant et chauffe : cela peut l'endommager. Le transport se fait donc sur plateau, sauf si le manuel autorise explicitement autre chose (mode « neutre » ou « transport »).</p>
<h2>Batterie de traction vide</h2>
<p>Une recharge de dépannage au bord de la route serait trop lente pour être utile. Le véhicule est transporté jusqu'à une borne, votre domicile ou le concessionnaire. Pour éviter la situation : gardez une marge, surtout en montée vers l'arrière-pays et l'hiver, et repérez les bornes à l'avance.</p>
<h2>Après un accident</h2>
<p>La batterie haute tension peut être endommagée même sans dégât visible. Au moindre doute (fumée, odeur, bruit, chaleur), éloignez-vous et appelez le 112. Le véhicule est ensuite transporté avec des précautions spécifiques et stocké à l'écart.</p>
<h2>Hybrides</h2>
<p>Les hybrides, rechargeables ou non, suivent les mêmes règles : batterie 12 V fréquente, transport sur plateau conseillé.</p>`,
  },
  {
    slug: 'guide-pannes-frequentes-cote-d-azur', cat: 'diagnostic', ic: 'pin', min: 4,
    titre: 'Les pannes les plus fréquentes sur la Côte d\'Azur',
    title: 'Pannes de voiture les plus fréquentes à Nice et sur la Côte d\'Azur',
    desc: 'Chaleur, bouchons, routes de montagne, parkings souterrains, voitures de location : les pannes que nous rencontrons le plus souvent à Nice et dans le 06, et comment les éviter.',
    essentiel: ['Batterie : la chaleur et les petits trajets l\'usent.', 'Surchauffe : bouchons d\'été et montées vers l\'arrière-pays.', 'Freins : utilisez le frein moteur dans les descentes.', 'Parkings souterrains : batterie à plat au retour de vacances.'],
    services: ['depannage-batterie-nice', 'surchauffe-moteur-nice', 'depannage-parking-souterrain-nice'],
    corps: `
<h2>1. La batterie</h2>
<p>La première cause d'appel, toute l'année. La chaleur accélère l'usure, les trajets courts en ville ne la rechargent pas, et beaucoup de voitures restent des semaines au parking. <a href="guide-batterie-a-plat.html">Tout sur la batterie</a>.</p>
<h2>2. La crevaison</h2>
<p>Bordures, rails de tramway, chantiers, cailloux des routes de l'arrière-pays. <a href="guide-pneu-creve.html">Réparer ou changer</a>.</p>
<h2>3. La surchauffe</h2>
<p>Bouchons sur la Promenade et l'A8 en été, montées vers Vence, Grasse ou la vallée de la Vésubie, climatisation à fond. <a href="guide-surchauffe-moteur.html">Que faire</a>.</p>
<h2>4. Les freins dans les descentes</h2>
<p>Les longues descentes (Col de Vence, route de Gréolières, moyenne corniche) font chauffer les freins si on les sollicite en continu : la pédale devient molle, une odeur apparaît. Rétrogradez pour utiliser le frein moteur, et arrêtez-vous pour les laisser refroidir si besoin.</p>
<h2>5. Les parkings souterrains</h2>
<p>Batterie à plat au retour de vacances, crevaison, sortie impossible : en sous-sol, il faut un matériel adapté aux hauteurs limitées. <a href="depannage-parking-souterrain-nice.html">Notre service en sous-sol</a>.</p>
<h2>6. L'erreur de carburant</h2>
<p>Particulièrement avec les voitures de location et les véhicules empruntés : diesel ou essence, on se trompe au premier plein. <a href="guide-erreur-de-carburant.html">Ne démarrez pas</a>.</p>
<h2>7. Les clés</h2>
<p>Enfermées dans le coffre sur un parking de plage, perdues en balade, carte main libre sans pile. <a href="guide-cles-perdues-ou-enfermees.html">Clés perdues ou enfermées</a>.</p>
<h2>8. Les deux-roues</h2>
<p>Scooters immobilisés en ville, motos en panne sur les routes de montagne : ils se transportent debout, sanglés. <a href="depannage-moto-scooter-nice.html">Dépannage moto et scooter</a>.</p>`,
  },

  // ── Assurance et démarches ──────────────────
  {
    slug: 'guide-assurance-assistance', cat: 'demarches', ic: 'shield', min: 5,
    titre: 'Assurance et assistance : qui paie le dépannage ?',
    title: 'Dépannage : l\'assurance rembourse-t-elle ? Assistance 0 km',
    desc: 'Assistance incluse ou non, franchise kilométrique, assistance 0 km, faut-il appeler l\'assurance avant le dépanneur, comment se faire rembourser : ce qu\'il faut vérifier dans son contrat.',
    essentiel: ['L\'assistance n\'est pas toujours incluse : vérifiez votre contrat.', 'Franchise kilométrique : pas de prise en charge près de chez vous.', 'Assistance 0 km : prise en charge même devant chez vous.', 'Pour être pris en charge, l\'assistance doit en général organiser le dépannage.'],
    services: ['remorquage-voiture-nice', 'depannage-accident-nice'],
    corps: `
<h2>Assurance et assistance, deux choses différentes</h2>
<p>L'<strong>assurance</strong> couvre les dommages (accident, vol, incendie…). L'<strong>assistance</strong> organise et paie l'aide immédiate : dépannage, remorquage, parfois véhicule de remplacement, taxi ou hôtel. Elle peut être incluse dans votre contrat auto, vendue en option, liée à votre carte bancaire ou offerte par le constructeur pendant la garantie.</p>
<h2>Ce qu'il faut vérifier dans le contrat</h2>
<ul>
<li><strong>La franchise kilométrique</strong> : beaucoup de contrats ne prennent en charge une panne qu'à partir d'une certaine distance du domicile (souvent 25 ou 50 km). Une panne devant chez vous n'est alors pas couverte.</li>
<li><strong>L'assistance « 0 km »</strong> : elle intervient même devant votre domicile. C'est l'option qui compte le plus en ville.</li>
<li><strong>Panne ou seulement accident</strong> : certaines assistances ne couvrent que l'accident.</li>
<li><strong>Les exclusions</strong> : erreur de carburant, perte de clés, crevaison sont parfois exclues ou plafonnées.</li>
<li><strong>Les plafonds</strong> : distance de remorquage prise en charge, montant maximal.</li>
</ul>
<h2>Appeler l'assistance avant le dépanneur ?</h2>
<p>Oui, si vous comptez sur elle : la plupart des contrats ne prennent en charge que les interventions qu'elle a organisées. Elle vous envoie un dépanneur (ce peut être nous) et règle directement. Si vous faites appel à un dépanneur de votre côté, demandez-lui d'abord son accord, par écrit si possible.</p>
<h2>Se faire rembourser</h2>
<p>Gardez la facture détaillée (elle est obligatoire pour une prestation de service à partir de 25 € TTC), les photos et, en cas d'accident, le constat. Envoyez-les à votre assureur avec votre numéro de contrat.</p>
<h2>Sans assistance</h2>
<p>Vous payez le dépannage vous-même. Raison de plus pour demander le prix avant le départ de la dépanneuse : chez nous, il est annoncé au téléphone et publié sur la page <a href="tarifs.html">tarifs</a>.</p>`,
    faq: [
      ['Qu\'est-ce que l\'assistance 0 km ?', 'Une assistance qui intervient quel que soit l\'endroit de la panne, y compris devant votre domicile, sans franchise kilométrique.'],
      ['Faut-il avancer les frais ?', 'Pas si l\'assistance organise le dépannage : elle règle directement le dépanneur. Sinon, vous payez puis demandez le remboursement sur facture, si votre contrat le prévoit.'],
    ],
  },
  {
    slug: 'guide-cles-perdues-ou-enfermees', cat: 'demarches', ic: 'key', min: 4,
    titre: 'Clés de voiture perdues, enfermées ou cassées : que faire ?',
    title: 'Clé de voiture perdue ou enfermée : que faire ? Double, carte',
    desc: 'Clés enfermées dans la voiture, perdues, volées ou cassées : les bons réflexes, les papiers à prévoir, refaire une clé ou une carte sans l\'original, ce que couvre l\'assurance.',
    essentiel: ['Enfermées : vérifiez toutes les portes et le coffre, pensez au double.', 'Enfant ou animal enfermé au soleil : 112 sans attendre.', 'Perdues : refaites le chemin, puis préparez carte grise et pièce d\'identité.', 'Volées avec les papiers : déclarez-le à la police.'],
    services: ['ouverture-porte-voiture-nice', 'perte-cle-voiture-nice'],
    corps: `
<h2>Clés enfermées dans la voiture</h2>
<ul>
<li>Faites le tour : une portière ou le coffre est parfois resté ouvert.</li>
<li>Un double chez vous ? Le faire apporter est souvent le plus rapide et le moins cher.</li>
<li>Un enfant ou un animal enfermé au soleil : appelez le <strong>112</strong> sans attendre, la chaleur monte très vite dans un habitacle fermé.</li>
<li>Sinon, un professionnel ouvre le véhicule avec des outils non destructifs. Il vous demandera de prouver que le véhicule est le vôtre (papiers vérifiés après ouverture s'ils sont à l'intérieur).</li>
</ul>
<h2>Clés perdues</h2>
<p>Refaites le chemin et appelez les derniers endroits visités (commerces, plage, restaurant) : beaucoup de clés sont retrouvées. Si elles sont perdues pour de bon, il faudra faire reproduire une clé.</p>
<h2>Refaire une clé sans l'original</h2>
<p>Les clés modernes contiennent une puce (transpondeur) que la voiture doit reconnaître. Selon le modèle, une clé peut être programmée par un professionnel équipé, ou seulement par le constructeur. Dans tous les cas, il faut le <strong>certificat d'immatriculation</strong> et une <strong>pièce d'identité</strong> du titulaire. Pour la sécurité, faites effacer la clé perdue de la mémoire du véhicule.</p>
<h2>Clé cassée, carte qui ne répond plus</h2>
<ul>
<li>Clé cassée dans la serrure ou le contacteur : ne forcez pas, l'extraction se fait avec un outil adapté.</li>
<li>Carte ou télécommande sans réaction : souvent la pile. Beaucoup de modèles démarrent en posant la carte sur un emplacement précis (voir le manuel).</li>
<li>Direction bloquée (neiman) : tournez légèrement le volant en tournant la clé.</li>
</ul>
<h2>Vol et assurance</h2>
<p>Si les clés ont été volées, surtout avec les papiers ou près du véhicule, déclarez-le à la police : le véhicule peut être visé. Certaines assurances couvrent la perte ou le vol des clés (option) : vérifiez votre contrat.</p>`,
  },
  {
    slug: 'guide-epave-demarches', cat: 'demarches', ic: 'recycle', min: 4,
    titre: 'Se débarrasser d\'une épave : démarches et certificat de destruction',
    title: 'Épave de voiture : démarches VHU, certificat de destruction',
    desc: 'Faire détruire une voiture hors d\'usage : centre VHU agréé, documents à fournir, certificat de destruction, gratuité, résiliation de l\'assurance, épave sans carte grise ou abandonnée.',
    essentiel: ['Seul un centre VHU agréé peut détruire un véhicule.', 'Documents : carte grise, pièce d\'identité, certificat de situation administrative.', 'Le certificat de destruction met fin à votre responsabilité.', 'Résiliez l\'assurance après l\'avoir reçu, pas avant.'],
    services: ['enlevement-epave-nice'],
    corps: `
<h2>Le principe</h2>
<p>Un véhicule hors d'usage (VHU) ne peut être détruit que par un <strong>centre VHU agréé</strong> par la préfecture. Il dépollue le véhicule (huiles, batterie, fluides), recycle ce qui peut l'être et vous remet un <strong>certificat de destruction</strong>. Il enregistre aussi la cession dans le système d'immatriculation : vous n'êtes plus responsable du véhicule.</p>
<h2>Les documents</h2>
<ul>
<li>le <strong>certificat d'immatriculation</strong> (carte grise), barré avec la mention « vendu le … pour destruction », daté et signé ;</li>
<li>une <strong>pièce d'identité</strong> du titulaire ;</li>
<li>un <strong>certificat de situation administrative</strong> de moins de 15 jours, qui prouve l'absence de gage ou d'opposition. Il s'obtient gratuitement en ligne sur le site officiel de l'administration.</li>
</ul>
<p>Si le titulaire est décédé, l'héritier fournit en plus les justificatifs de succession. Sans carte grise, une procédure existe : parlez-en avant l'enlèvement.</p>
<h2>Est-ce gratuit ?</h2>
<p>La reprise d'un véhicule complet (moteur, pots, roues, sans déchets ajoutés) par un centre VHU est en principe gratuite. L'enlèvement l'est souvent aussi, selon l'accès et l'état. Chez nous, il est <a href="enlevement-epave-nice.html">gratuit pour un véhicule complet</a>.</p>
<h2>Et l'assurance ?</h2>
<p>Un véhicule immatriculé doit rester assuré tant qu'il n'est pas détruit, même immobile. Résiliez le contrat <strong>après</strong> avoir reçu le certificat de destruction, en l'envoyant à votre assureur.</p>
<h2>Une épave abandonnée chez vous</h2>
<p>Vous ne pouvez pas faire détruire le véhicule d'un autre, même abandonné sur votre terrain. Adressez-vous à la mairie ou à la police : une procédure de mise en fourrière existe.</p>`,
  },
  {
    slug: 'guide-choisir-un-depanneur', cat: 'demarches', ic: 'check', min: 4,
    titre: 'Choisir un dépanneur et éviter les arnaques',
    title: 'Choisir un dépanneur : 7 conseils pour éviter les arnaques',
    desc: 'Numéros surtaxés, plateformes qui revendent l\'appel, prix gonflés sur place : comment reconnaître un dépanneur sérieux et ce que vous êtes en droit de demander.',
    essentiel: ['Demandez le prix avant le départ de la dépanneuse.', 'Vérifiez qui intervient : entreprise locale ou plateforme.', 'Exigez une facture détaillée.', 'Payez par un moyen traçable si possible.'],
    services: ['remorquage-voiture-nice'],
    corps: `
<h2>1. Le prix avant le départ</h2>
<p>Un dépanneur sérieux vous annonce le prix au téléphone, en fonction de ce que vous décrivez. Méfiez-vous d'un « on verra sur place » : c'est sur place, quand vous êtes bloqué, que les prix gonflent. Demandez une confirmation par SMS si vous le souhaitez.</p>
<h2>2. Savoir qui vient</h2>
<p>Beaucoup de sites qui s'affichent en tête des recherches sont des <strong>plateformes</strong> : elles prennent votre appel, parfois à l'autre bout de la France, puis le confient au dépanneur disponible, en prenant une commission. Ce n'est pas illégal, mais le prix et le délai annoncés ne sont pas toujours ceux du dépanneur qui vient. Cherchez une adresse locale réelle et un nom d'entreprise.</p>
<h2>3. Vérifier l'entreprise</h2>
<p>Le numéro SIRET et l'adresse doivent figurer dans les mentions légales du site. Vous pouvez les vérifier gratuitement sur l'annuaire officiel des entreprises (annuaire-entreprises.data.gouv.fr). Lisez aussi les avis récents, en vous méfiant des notes parfaites sans commentaire.</p>
<h2>4. Se méfier des promesses trop belles</h2>
<p>« 15 minutes garanties partout », compteurs « d'équipes disponibles » en direct, prix d'appel très bas sans détail : un délai dépend du trafic, et un prix sans conditions cache souvent des suppléments.</p>
<h2>5. La facture</h2>
<p>Pour une prestation de service à partir de 25 € TTC, une note (facture) détaillée est obligatoire. Elle doit indiquer l'entreprise, la date, le détail des prestations et leur prix. Elle vous servira pour l'assurance.</p>
<h2>6. Le paiement</h2>
<p>Préférez la carte bancaire ou le paiement mobile, traçables. Les paiements en espèces sont plafonnés par la loi.</p>
<h2>7. Sur l'autoroute</h2>
<p>N'appelez pas un dépanneur trouvé sur internet : seul le dépanneur agréé peut intervenir, au tarif réglementé. <a href="guide-panne-autoroute-a8.html">Panne sur l'A8</a>.</p>
<h2>En cas de litige</h2>
<p>Adressez d'abord une réclamation écrite à l'entreprise. Sans réponse satisfaisante, vous pouvez saisir gratuitement le médiateur de la consommation dont elle relève, ou signaler le problème à la DGCCRF sur la plateforme SignalConso.</p>`,
  },
];

module.exports = { CATS, GUIDES: G, MAJ };
