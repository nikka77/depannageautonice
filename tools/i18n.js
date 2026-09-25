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
  fr: { accueil: 'index.html', services: 'services.html', tarifs: 'tarifs.html', zone: 'zone.html', faq: 'faq.html', 'a-propos': 'a-propos.html', contact: 'contact.html' },
  en: { accueil: 'en/index.html', services: 'en/services.html', tarifs: 'en/prices.html', zone: 'en/service-area.html', faq: 'en/faq.html', 'a-propos': 'en/about.html', contact: 'en/contact.html' },
  it: { accueil: 'it/index.html', services: 'it/servizi.html', tarifs: 'it/prezzi.html', zone: 'it/zona.html', faq: 'it/faq.html', 'a-propos': 'it/chi-siamo.html', contact: 'it/contatti.html' },
};

// Liens du menu principal, par langue. Les guides n'existent qu'en
// français : le menu anglais et italien garde « À propos » à la place.
const NAV = {
  fr: ['services', 'tarifs', 'zone', 'conseils', 'faq', 'contact'],
  en: ['services', 'tarifs', 'zone', 'faq', 'a-propos', 'contact'],
  it: ['services', 'tarifs', 'zone', 'faq', 'a-propos', 'contact'],
};
// Pages françaises sans traduction, mais présentes dans le menu.
const FR_SEULEMENT = { conseils: 'conseils.html' };

const LANGS = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'it', label: 'IT', name: 'Italiano' },
];

const T = {
  fr: {
    locale: 'fr_FR', inLang: 'fr-FR', skip: 'Aller au contenu', home: 'Accueil',
    brandSub: 'Remorquage &amp; dépannage · 7j/7 24h/24', menu: 'Menu', navAria: 'Navigation principale', langAria: 'Langue',
    nav: { services: 'Services', tarifs: 'Tarifs', zone: 'Zone', conseils: 'Conseils', faq: 'FAQ', 'a-propos': 'À propos', contact: 'Contact' },
    tel: '06 17 68 42 70', urgence: 'Urgence 24h/24', callAria: 'Appeler le', headCta: 'Demander',
    footAddr: 'Zone industrielle du Quai de la Blanquière, Nice.<br>Équipe niçoise depuis 2004, toutes assurances.',
    ftSite: 'Le site', ftAct: 'Agir',
    ftLinks: { accueil: 'Accueil', services: 'Nos services', tarifs: 'Tarifs', zone: "Zone d'intervention", conseils: 'Guides et conseils', faq: 'Questions fréquentes', 'a-propos': "À propos de l'équipe" },
    cgv: 'Conditions de vente',
    demande: 'Demander un dépannage', diag: 'Diagnostic pneus gratuit', contact: 'Contact', legal: 'Mentions légales',
    quick: 'Contact rapide', railCall: 'Appeler 24h/24', railDem: 'Demander un dépannage', top: 'Remonter en haut de page',
    barCall: 'Appeler', barDem: 'Demande', railName: 'colonne', barName: 'barre du bas',
    wa: "Bonjour, j'ai besoin d'un dépannage. Je suis à : ",
    noCookie: 'Site sans cookie ni pistage publicitaire',
    qr: {
      titre: 'Demander un dépannage', sous: 'Un technicien vous rappelle, 7j/7 24h/24.', fermer: 'Fermer',
      etapes: ['Lieu', 'Panne', 'Quand', 'Contact'], etapeSur: 'Étape {n} sur 4', suivant: 'Continuer', retour: 'Retour',
      ou: 'Où êtes-vous ?', gps: 'Me localiser', adresse: 'Adresse ou repère', adressePh: 'Ex. : 12 rue de France, Nice',
      placer: 'Placer sur la carte', carte: 'Carte de votre position', carteAide: 'Faites glisser le repère orange si la position n\'est pas exacte.',
      acces: 'Accès', sousSol: 'Parking souterrain', hauteur: 'Hauteur maximale affichée (m)', autoroute: 'Autoroute ou voie rapide',
      autorouteMsg: 'Sur autoroute, seul le dépanneur agréé peut intervenir : utilisez la borne orange ou le 112. Nous pouvons ensuite transporter le véhicule depuis son dépôt.',
      danger: 'Véhicule gênant ou dans une position dangereuse',
      quoi: 'Que se passe-t-il ?', types: { batterie: 'Batterie', pneu: 'Pneu crevé', carburant: 'Carburant', remorquage: 'Remorquage', moteur: 'Surchauffe', cles: 'Clés', accident: 'Accident', autre: 'Autre' },
      carbu: 'Quel problème de carburant ?', carbuOpts: { seche: 'Panne sèche', erreur: 'Erreur de carburant' },
      demarre: 'Le moteur a-t-il tourné depuis le plein ?', demarreMsg: 'Ne démarrez plus le moteur, ne mettez même pas le contact.',
      roue: 'Avez-vous une roue de secours ?', cles: 'Que se passe-t-il avec les clés ?', clesOpts: { enfermees: 'Enfermées dans le véhicule', perdues: 'Perdues ou volées', cassees: 'Cassées ou bloquées' },
      blesses: 'Y a-t-il des blessés ?', blessesMsg: 'Appelez d\'abord le 112 (ou le 15). Ne déplacez pas les blessés.', roule: 'Le véhicule peut-il encore rouler ?',
      oui: 'Oui', non: 'Non', nsp: 'Je ne sais pas',
      vehicule: 'Votre véhicule', categories: { voiture: 'Voiture', suv: 'SUV / 4x4', utilitaire: 'Utilitaire', campingcar: 'Camping-car', moto: 'Moto / scooter' },
      energie: 'Énergie', energies: { '': '—', essence: 'Essence', diesel: 'Diesel', electrique: 'Électrique', hybride: 'Hybride', gpl: 'GPL' },
      boite: 'Boîte automatique', plaque: 'Plaque d\'immatriculation', plaqueAide: 'Nous identifions le véhicule pour venir avec le bon matériel.',
      photo: 'Photo de la panne', photoAjout: 'Ajouter une photo', photoAide: 'Elle nous aide à préparer l\'intervention ; elle partira sur WhatsApp.', photoRetirer: 'Retirer la photo',
      details: 'Précisions', facultatif: 'facultatif', detailsPh: 'Ce que vous avez remarqué, voyants, bruits, accès…',
      quand: 'Quand ?', maintenant: 'Maintenant', plusTard: 'Plus tard', date: 'Date', creneau: 'Créneau',
      creneaux: ['Matin (8h – 12h)', 'Midi (12h – 14h)', 'Après-midi (14h – 18h)', 'Soir (18h – 21h)', 'Nuit (21h – 8h)'],
      dest: 'S\'il faut remorquer, où emmener le véhicule ?', dests: { atelier: 'Notre atelier (Nice)', garage: 'Mon garage', domicile: 'Mon domicile', decider: 'À décider ensemble' }, destAdresse: 'Adresse de destination',
      passagers: 'Personnes à emmener dans la dépanneuse', passagersOpts: ['Aucune', '1', '2', '3 ou plus'],
      assistance: 'Avez-vous une assistance ?', assistances: { non: 'Non / je ne sais pas', assurance: 'Mon assurance', loueur: 'Voiture de location', constructeur: 'Le constructeur' },
      assistanceMsg: 'Appelez-la d\'abord si vous voulez qu\'elle prenne l\'intervention en charge : elle peut nous missionner directement.',
      prenom: 'Prénom', tel: 'Téléphone', email: 'E-mail', emailAide: 'pour recevoir la facture',
      recap: 'Votre demande', estim: 'Estimation indicative', estimNote: 'Prix ferme annoncé au téléphone avant le départ, rien n\'est ajouté sur place.',
      rgpd: 'Vos informations servent uniquement à traiter la demande et à établir la facture.',
      envoyer: 'Envoyer la demande', ouAppel: 'Urgence ? Appelez le',
      js: { gpsEnCours: 'Localisation en cours…', gpsOk: 'Position GPS reçue', gpsKo: 'Position indisponible : indiquez une adresse ou un repère.',
            geoEnCours: 'Recherche de l\'adresse…', geoKo: 'Adresse introuvable sur la carte : précisez-la ou décrivez un repère.',
            dist: '{km} km de notre atelier', delai: 'délai estimé {d}',
            errLieu: 'Indiquez où vous êtes, ou touchez « Me localiser ».', errType: 'Choisissez ce qui se passe.', errTel: 'Indiquez un numéro de téléphone complet.',
            envoi: 'Envoi en cours…', okTitre: 'Demande transmise', okTexte: 'Un technicien vous rappelle au {tel}. Gardez votre téléphone à portée de main.',
            waTitre: 'Dernière étape', waTexte: 'Votre demande est rédigée : envoyez-la sur WhatsApp, ou appelez-nous directement.', waBtn: 'Envoyer sur WhatsApp',
            appel: 'Appeler', photo: 'Envoyez ensuite votre photo dans la conversation WhatsApp.', photoBtn: 'Partager la photo', photoShare: 'Envoyez d\'abord le message, puis partagez la photo dans notre conversation.',
            nouveau: 'Nouvelle demande', surDevis: 'Sur devis, annoncé au téléphone', des: 'dès', rdv: 'Rendez-vous', urgence: 'Dès maintenant',
            lieu: 'Lieu', panne: 'Panne', vehicule: 'Véhicule', quand: 'Quand', destination: 'Destination', vous: 'Vous', atelier: 'Notre atelier', position: 'Votre position' },
    },
  },
  en: {
    locale: 'en_GB', inLang: 'en-GB', skip: 'Skip to content', home: 'Home',
    brandSub: 'Towing &amp; roadside assistance · 24/7', menu: 'Menu', navAria: 'Main navigation', langAria: 'Language',
    nav: { services: 'Services', tarifs: 'Prices', zone: 'Area', faq: 'FAQ', 'a-propos': 'About', contact: 'Contact' },
    tel: '+33 6 17 68 42 70', urgence: 'Emergency 24/7', callAria: 'Call', headCta: 'Request',
    footAddr: 'Industrial zone, Quai de la Blanquière, Nice.<br>A Nice-based team since 2004, all insurers.',
    ftSite: 'This site', ftAct: 'Get help',
    ftLinks: { accueil: 'Home', services: 'Our services', tarifs: 'Prices', zone: 'Service area', faq: 'FAQ', 'a-propos': 'About the team' },
    cgv: 'Terms of sale (in French)',
    demande: 'Request assistance online', diag: 'Free tyre check (in French)', contact: 'Contact', legal: 'Legal notice (in French)',
    quick: 'Quick contact', railCall: 'Call 24/7', railDem: 'Request assistance', top: 'Back to top',
    barCall: 'Call', barDem: 'Form', railName: 'side column', barName: 'bottom bar',
    wa: 'Hello, I need roadside assistance. I am at: ',
    noCookie: 'No cookies, no advertising tracking',
    qr: {
      titre: 'Request roadside assistance', sous: 'A technician calls you back, 24/7.', fermer: 'Close',
      etapes: ['Location', 'Problem', 'When', 'Contact'], etapeSur: 'Step {n} of 4', suivant: 'Continue', retour: 'Back',
      ou: 'Where are you?', gps: 'Use my location', adresse: 'Address or landmark', adressePh: 'E.g. 12 rue de France, Nice',
      placer: 'Show on the map', carte: 'Map of your location', carteAide: 'Drag the orange pin if the position is not exact.',
      acces: 'Access', sousSol: 'Underground car park', hauteur: 'Maximum height shown (m)', autoroute: 'Motorway or expressway',
      autorouteMsg: 'On French motorways only the approved tow truck may come out: use an orange emergency box or dial 112. We can then transport the vehicle from its depot.',
      danger: 'Vehicle blocking traffic or in a dangerous spot',
      quoi: 'What happened?', types: { batterie: 'Battery', pneu: 'Flat tyre', carburant: 'Fuel', remorquage: 'Towing', moteur: 'Overheating', cles: 'Keys', accident: 'Accident', autre: 'Other' },
      carbu: 'What kind of fuel problem?', carbuOpts: { seche: 'Out of fuel', erreur: 'Wrong fuel' },
      demarre: 'Has the engine run since filling up?', demarreMsg: 'Do not start the engine again, do not even switch on the ignition.',
      roue: 'Do you have a spare wheel?', cles: 'What about the keys?', clesOpts: { enfermees: 'Locked in the vehicle', perdues: 'Lost or stolen', cassees: 'Broken or stuck' },
      blesses: 'Is anyone injured?', blessesMsg: 'Call 112 first. Do not move injured people.', roule: 'Can the vehicle still be driven?',
      oui: 'Yes', non: 'No', nsp: 'Not sure',
      vehicule: 'Your vehicle', categories: { voiture: 'Car', suv: 'SUV / 4x4', utilitaire: 'Van', campingcar: 'Motorhome', moto: 'Motorbike / scooter' },
      energie: 'Fuel type', energies: { '': '—', essence: 'Petrol', diesel: 'Diesel', electrique: 'Electric', hybride: 'Hybrid', gpl: 'LPG' },
      boite: 'Automatic gearbox', plaque: 'Number plate', plaqueAide: 'French plates are looked up automatically; for other plates, just type it.',
      photo: 'Photo of the problem', photoAjout: 'Add a photo', photoAide: 'It helps us prepare; it will be sent on WhatsApp.', photoRetirer: 'Remove the photo',
      details: 'Details', facultatif: 'optional', detailsPh: 'What you noticed, warning lights, noises, access…',
      quand: 'When?', maintenant: 'Now', plusTard: 'Later', date: 'Date', creneau: 'Time slot',
      creneaux: ['Morning (8 am – 12 pm)', 'Midday (12 – 2 pm)', 'Afternoon (2 – 6 pm)', 'Evening (6 – 9 pm)', 'Night (9 pm – 8 am)'],
      dest: 'If towing is needed, where should the vehicle go?', dests: { atelier: 'Our workshop (Nice)', garage: 'My garage', domicile: 'My home or hotel', decider: 'Decide together' }, destAdresse: 'Destination address',
      passagers: 'People to take in the tow truck', passagersOpts: ['None', '1', '2', '3 or more'],
      assistance: 'Do you have breakdown cover?', assistances: { non: 'No / not sure', assurance: 'My insurance', loueur: 'Rental car', constructeur: 'The manufacturer' },
      assistanceMsg: 'Call them first if you want them to pay: they can send us directly.',
      prenom: 'First name', tel: 'Phone', email: 'E-mail', emailAide: 'to receive the invoice',
      recap: 'Your request', estim: 'Indicative estimate', estimNote: 'Firm price given on the phone before we set off; nothing is added on arrival.',
      rgpd: 'Your details are only used to handle the request and issue the invoice.',
      envoyer: 'Send request', ouAppel: 'Emergency? Call',
      js: { gpsEnCours: 'Locating…', gpsOk: 'GPS location received', gpsKo: 'Location unavailable: please type an address or landmark.',
            geoEnCours: 'Looking up the address…', geoKo: 'Address not found on the map: add details or describe a landmark.',
            dist: '{km} km from our workshop', delai: 'estimated time {d}',
            errLieu: 'Tell us where you are, or tap "Use my location".', errType: 'Choose what happened.', errTel: 'Please enter a full phone number.',
            envoi: 'Sending…', okTitre: 'Request sent', okTexte: 'A technician will call you back on {tel}. Keep your phone at hand. Our team speaks French: WhatsApp is easiest for written messages.',
            waTitre: 'Last step', waTexte: 'Your request is written: send it on WhatsApp, or call us directly.', waBtn: 'Send on WhatsApp',
            appel: 'Call', photo: 'Then send your photo in the WhatsApp conversation.', photoBtn: 'Share the photo', photoShare: 'Send the message first, then share the photo in our conversation.',
            nouveau: 'New request', surDevis: 'On quotation, given on the phone', des: 'from', rdv: 'Appointment', urgence: 'Right now',
            lieu: 'Location', panne: 'Problem', vehicule: 'Vehicle', quand: 'When', destination: 'Destination', vous: 'You', atelier: 'Our workshop', position: 'Your location' },
    },
  },
  it: {
    locale: 'it_IT', inLang: 'it-IT', skip: 'Vai al contenuto', home: 'Home',
    brandSub: 'Soccorso stradale · 24 ore su 24', menu: 'Menu', navAria: 'Navigazione principale', langAria: 'Lingua',
    nav: { services: 'Servizi', tarifs: 'Prezzi', zone: 'Zona', faq: 'FAQ', 'a-propos': 'Chi siamo', contact: 'Contatti' },
    tel: '+33 6 17 68 42 70', urgence: 'Urgenze 24h/24', callAria: 'Chiama il', headCta: 'Richiedi',
    footAddr: 'Zona industriale del Quai de la Blanquière, Nizza.<br>Squadra nizzarda dal 2004, tutte le assicurazioni.',
    ftSite: 'Il sito', ftAct: 'Aiuto',
    ftLinks: { accueil: 'Home', services: 'I nostri servizi', tarifs: 'Prezzi', zone: "Zona d'intervento", faq: 'Domande frequenti', 'a-propos': 'Chi siamo' },
    cgv: 'Condizioni di vendita (in francese)',
    demande: 'Richiedere un soccorso online', diag: 'Diagnosi pneumatici (in francese)', contact: 'Contatti', legal: 'Note legali (in francese)',
    quick: 'Contatto rapido', railCall: 'Chiama 24h/24', railDem: 'Richiedere un soccorso', top: 'Torna su',
    barCall: 'Chiama', barDem: 'Modulo', railName: 'colonna', barName: 'barra in basso',
    wa: 'Buongiorno, ho bisogno di un soccorso stradale. Mi trovo a: ',
    noCookie: 'Nessun cookie, nessun tracciamento pubblicitario',
    qr: {
      titre: 'Richiedere un soccorso', sous: 'Un tecnico vi richiama, 24 ore su 24.', fermer: 'Chiudi',
      etapes: ['Luogo', 'Guasto', 'Quando', 'Contatto'], etapeSur: 'Passo {n} di 4', suivant: 'Continua', retour: 'Indietro',
      ou: 'Dove vi trovate?', gps: 'Usa la mia posizione', adresse: 'Indirizzo o punto di riferimento', adressePh: 'Es.: 12 rue de France, Nizza',
      placer: 'Mostra sulla mappa', carte: 'Mappa della vostra posizione', carteAide: 'Trascinate il segnaposto arancione se la posizione non è esatta.',
      acces: 'Accesso', sousSol: 'Parcheggio sotterraneo', hauteur: 'Altezza massima indicata (m)', autoroute: 'Autostrada o superstrada',
      autorouteMsg: 'Sulle autostrade francesi può intervenire solo il carro attrezzi autorizzato: usate la colonnina SOS arancione o il 112. Possiamo poi trasportare il veicolo dal suo deposito.',
      danger: 'Veicolo che blocca il traffico o in posizione pericolosa',
      quoi: 'Cosa è successo?', types: { batterie: 'Batteria', pneu: 'Foratura', carburant: 'Carburante', remorquage: 'Traino', moteur: 'Surriscaldamento', cles: 'Chiavi', accident: 'Incidente', autre: 'Altro' },
      carbu: 'Che problema di carburante?', carbuOpts: { seche: 'Senza carburante', erreur: 'Carburante sbagliato' },
      demarre: 'Il motore ha girato dopo il rifornimento?', demarreMsg: 'Non avviate più il motore, non girate nemmeno la chiave.',
      roue: 'Avete una ruota di scorta?', cles: 'Cosa succede con le chiavi?', clesOpts: { enfermees: 'Chiuse nel veicolo', perdues: 'Perse o rubate', cassees: 'Rotte o bloccate' },
      blesses: 'Ci sono feriti?', blessesMsg: 'Chiamate prima il 112. Non spostate i feriti.', roule: 'Il veicolo può ancora circolare?',
      oui: 'Sì', non: 'No', nsp: 'Non so',
      vehicule: 'Il vostro veicolo', categories: { voiture: 'Auto', suv: 'SUV / 4x4', utilitaire: 'Furgone', campingcar: 'Camper', moto: 'Moto / scooter' },
      energie: 'Alimentazione', energies: { '': '—', essence: 'Benzina', diesel: 'Diesel', electrique: 'Elettrica', hybride: 'Ibrida', gpl: 'GPL' },
      boite: 'Cambio automatico', plaque: 'Targa', plaqueAide: 'Le targhe francesi vengono riconosciute; per le altre, scrivetela semplicemente.',
      photo: 'Foto del guasto', photoAjout: 'Aggiungi una foto', photoAide: 'Ci aiuta a preparare l\'intervento; verrà inviata su WhatsApp.', photoRetirer: 'Rimuovi la foto',
      details: 'Dettagli', facultatif: 'facoltativo', detailsPh: 'Cosa avete notato, spie, rumori, accesso…',
      quand: 'Quando?', maintenant: 'Adesso', plusTard: 'Più tardi', date: 'Data', creneau: 'Fascia oraria',
      creneaux: ['Mattina (8 – 12)', 'Mezzogiorno (12 – 14)', 'Pomeriggio (14 – 18)', 'Sera (18 – 21)', 'Notte (21 – 8)'],
      dest: 'Se serve il traino, dove portare il veicolo?', dests: { atelier: 'La nostra officina (Nizza)', garage: 'Il mio garage', domicile: 'Casa o hotel', decider: 'Da decidere insieme' }, destAdresse: 'Indirizzo di destinazione',
      passagers: 'Persone da portare nel carro attrezzi', passagersOpts: ['Nessuna', '1', '2', '3 o più'],
      assistance: 'Avete un\'assistenza stradale?', assistances: { non: 'No / non so', assurance: 'La mia assicurazione', loueur: 'Auto a noleggio', constructeur: 'Il costruttore' },
      assistanceMsg: 'Chiamatela prima se volete che paghi lei: può inviarci direttamente.',
      prenom: 'Nome', tel: 'Telefono', email: 'E-mail', emailAide: 'per ricevere la fattura',
      recap: 'La vostra richiesta', estim: 'Stima indicativa', estimNote: 'Prezzo fisso comunicato al telefono prima della partenza; nulla viene aggiunto sul posto.',
      rgpd: 'I vostri dati servono solo a gestire la richiesta e a emettere la fattura.',
      envoyer: 'Invia la richiesta', ouAppel: 'Urgenza? Chiamate il',
      js: { gpsEnCours: 'Localizzazione…', gpsOk: 'Posizione GPS ricevuta', gpsKo: 'Posizione non disponibile: indicate un indirizzo o un punto di riferimento.',
            geoEnCours: 'Ricerca dell\'indirizzo…', geoKo: 'Indirizzo non trovato sulla mappa: precisatelo o descrivete un punto di riferimento.',
            dist: '{km} km dalla nostra officina', delai: 'tempo stimato {d}',
            errLieu: 'Indicate dove vi trovate, o toccate «Usa la mia posizione».', errType: 'Scegliete cosa è successo.', errTel: 'Inserite un numero di telefono completo.',
            envoi: 'Invio in corso…', okTitre: 'Richiesta inviata', okTexte: 'Un tecnico vi richiamerà al {tel}. Tenete il telefono a portata di mano. La squadra parla francese: WhatsApp è il più semplice per i messaggi scritti.',
            waTitre: 'Ultimo passo', waTexte: 'La richiesta è pronta: inviatela su WhatsApp, o chiamateci direttamente.', waBtn: 'Invia su WhatsApp',
            appel: 'Chiama', photo: 'Poi inviate la foto nella conversazione WhatsApp.', photoBtn: 'Condividi la foto', photoShare: 'Inviate prima il messaggio, poi condividete la foto nella nostra conversazione.',
            nouveau: 'Nuova richiesta', surDevis: 'Su preventivo, comunicato al telefono', des: 'da', rdv: 'Appuntamento', urgence: 'Adesso',
            lieu: 'Luogo', panne: 'Guasto', vehicule: 'Veicolo', quand: 'Quando', destination: 'Destinazione', vous: 'Voi', atelier: 'La nostra officina', position: 'La vostra posizione' },
    },
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

// Questions de la page Tarifs, traduites.
const FAQX = {
  tarifs: {
    en: [
      ['Why a "from" price rather than an exact price online?', `<p>The final price depends on the distance, the time of day, access (underground car park, locked wheels) and the vehicle. Give us your location and what happened: the firm price is given on the phone before we set off.</p>`],
      ['Can the price change on arrival?', `<p>No. Only if the situation turns out to be different from the one described (an underground car park that was not mentioned, for example) do we give you a new price before touching the vehicle, and you are free to refuse it.</p>`],
      ['I have a rental car or breakdown cover. What should I do?', `<p>Call the rental company or your insurer's assistance line first: the call-out may be covered. If they send us, you pay nothing or only the part that is not covered.</p>`],
      ['How can I pay?', `<p>By bank card, Apple Pay, Google Pay or cash, at the end of the job. You get an itemised invoice.</p>`],
    ],
    it: [
      ['Perché un prezzo «da» e non un prezzo esatto online?', `<p>Il prezzo finale dipende dalla distanza, dall'orario, dall'accesso (parcheggio sotterraneo, ruote bloccate) e dal veicolo. Diteci dove siete e cosa è successo: il prezzo fisso vi viene comunicato al telefono prima della partenza.</p>`],
      ['Il prezzo può cambiare sul posto?', `<p>No. Solo se la situazione reale è diversa da quella descritta (un parcheggio sotterraneo non segnalato, per esempio) vi comunichiamo un nuovo prezzo prima di toccare il veicolo, e siete liberi di rifiutarlo.</p>`],
      ["Ho un'auto a noleggio o un'assistenza stradale. Cosa faccio?", `<p>Chiamate prima il noleggiatore o l'assistenza della vostra assicurazione: l'intervento può essere coperto. Se ci mandano loro, non pagate nulla o solo la parte non coperta.</p>`],
      ['Come posso pagare?', `<p>Con carta, Apple Pay, Google Pay o contanti, a fine intervento. Ricevete una fattura dettagliata.</p>`],
    ],
  },
};

// ── Titres et descriptions des pages traduites ─
const META = {
  en: {
    accueil: { title: 'Breakdown & towing in Nice, 24/7 | +33 6 17 68 42 70', desc: 'Tow truck in Nice within 30–60 min, 24/7. Roadside repair, towing and vehicle transport across the Alpes-Maritimes. Price given before we set off, from €70.' },
    services: { title: 'Our services — Breakdown & towing in Nice', desc: 'Towing, roadside repair, wrong fuel, flat tyre, battery, overheating: diagnosis on the spot and price given before any work. 24/7 in Nice and the Alpes-Maritimes.', crumb: 'Our services' },
    zone: { title: 'Service area: all of the Alpes-Maritimes — Breakdown in Nice', desc: '30–60 min in Nice and the neighbouring towns, and across the whole Alpes-Maritimes: Cannes, Antibes, Menton, Grasse. Arrival time given before we set off.', crumb: 'Service area' },
    faq: { title: 'FAQ — Breakdown & towing in Nice', desc: 'Arrival time, price, insurance, motorways, vehicles, language: what drivers ask most before calling a breakdown service in Nice.', crumb: 'FAQ' },
    'a-propos': { title: 'About us — a Nice-based team | Breakdown in Nice', desc: 'A local team, not a platform: workshop at Quai de la Blanquière in Nice, breakdown and towing 24/7 across the Alpes-Maritimes.', crumb: 'About' },
    tarifs: { title: 'Prices — Breakdown & towing in Nice, from €70', desc: 'Published price list: roadside repair and towing in Nice from €70, per-kilometre towing rates, night and underground extras, and a price estimator. Card, Apple Pay, Google Pay or cash.', crumb: 'Prices' },
    contact: { title: 'Contact — Breakdown & towing in Nice | +33 6 17 68 42 70', desc: 'Broken down now: call +33 6 17 68 42 70, 24/7, or message us on WhatsApp with your location. Workshop at Quai de la Blanquière, Nice.', crumb: 'Contact' },
  },
  it: {
    accueil: { title: 'Soccorso stradale a Nizza, 24 ore su 24 | +33 6 17 68 42 70', desc: 'Carro attrezzi a Nizza in 30–60 minuti, 24 ore su 24. Riparazione sul posto, traino e trasporto in tutte le Alpi Marittime. Prezzo comunicato prima della partenza, da 70 €.' },
    services: { title: 'I nostri servizi — Soccorso stradale a Nizza', desc: 'Traino, riparazione sul posto, carburante sbagliato, pneumatico, batteria, surriscaldamento: diagnosi sul posto e prezzo comunicato prima di intervenire.', crumb: 'I nostri servizi' },
    zone: { title: "Zona d'intervento: tutte le Alpi Marittime — Soccorso a Nizza", desc: '30–60 minuti a Nizza e nei comuni vicini, e in tutte le Alpi Marittime: Cannes, Antibes, Mentone, Grasse. Tempo di arrivo comunicato prima della partenza.', crumb: "Zona d'intervento" },
    faq: { title: 'Domande frequenti — Soccorso stradale a Nizza', desc: "Tempi, prezzo, assicurazione, autostrada, veicoli, lingua: le domande più frequenti prima di chiamare un soccorso stradale a Nizza.", crumb: 'Domande frequenti' },
    'a-propos': { title: 'Chi siamo — una squadra nizzarda | Soccorso a Nizza', desc: 'Una squadra locale, non una piattaforma: officina al Quai de la Blanquière a Nizza, soccorso e traino 24 ore su 24 in tutte le Alpi Marittime.', crumb: 'Chi siamo' },
    tarifs: { title: 'Prezzi — Soccorso stradale a Nizza, da 70 €', desc: 'Listino pubblico: soccorso e traino a Nizza da 70 €, tariffe di traino al km, supplementi notte e parcheggi sotterranei, e uno stimatore di prezzo. Carta, Apple Pay, Google Pay o contanti.', crumb: 'Prezzi' },
    contact: { title: 'Contatti — Soccorso stradale a Nizza | +33 6 17 68 42 70', desc: 'In panne adesso: chiamate il +33 6 17 68 42 70, 24 ore su 24, o scriveteci su WhatsApp con la vostra posizione. Officina al Quai de la Blanquière, Nizza.', crumb: 'Contatti' },
  },
};

module.exports = { ROUTES, NAV, FR_SEULEMENT, LANGS, T, NOMS, nomVille, delai, DELAI_NICE, FAQ, FAQX, META };
