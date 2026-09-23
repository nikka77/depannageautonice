// =============================================
// DEPANNAGEAUTONICE.FR — config.js
// Réglages d'exploitation du site. Seul fichier à modifier
// pour changer la réception des demandes ou les numéros.
// =============================================

window.SITE_CONFIG = {

  // ── Réception des demandes par e-mail ─────────────────────
  // Le site est hébergé en statique (GitHub Pages) : il ne peut pas
  // envoyer d'e-mail lui-même. Web3Forms sert de relais.
  //
  // POUR ACTIVER (5 min, gratuit) :
  //   1. Aller sur https://web3forms.com
  //   2. Saisir l'adresse e-mail qui doit recevoir les demandes
  //   3. Copier la clé d'accès reçue par e-mail et la coller ci-dessous
  //
  // Tant que cette clé est vide, aucune demande n'est transmise
  // automatiquement : le site le dit clairement au client et le bascule
  // sur WhatsApp ou l'appel direct.
  formAccessKey: '',
  formEndpoint: 'https://api.web3forms.com/submit',

  // Délai max d'attente de la réponse du relais, en ms.
  // Au-delà, on n'immobilise pas le client : bascule sur WhatsApp.
  formTimeoutMs: 8000,

  // ── Recherche de véhicule par plaque ──────────────────────
  // Adresse du relais serveur, PAS l'API Auto Ways directement.
  // Le jeton Auto Ways ne doit jamais figurer ici : ce fichier est
  // public (dépôt public + servi à chaque visiteur). Il vit dans les
  // variables d'environnement Vercel, lu par api/plaque.js.
  //
  // Le relais est déployé et opérationnel (projet Vercel
  // « depannage-plaque »). Vider cette valeur remasque le bouton de
  // recherche et remet la saisie manuelle seule.
  plaqueEndpoint: 'https://depannage-plaque.vercel.app/api/plaque',
  plaqueTimeoutMs: 10000,

  // ── Mesure d'audience (GoatCounter) ───────────────────────
  // Sans cookie ni donnée personnelle : pas de bandeau de consentement.
  // Compte les pages vues ET chaque clic sur Appeler / WhatsApp /
  // Demander, avec l'endroit du clic (titre, barre mobile, colonne…).
  //
  // POUR ACTIVER (3 min, gratuit) :
  //   1. Créer un compte sur https://www.goatcounter.com/signup
  //   2. Choisir un code, par exemple « depannageautonice »
  //   3. Le coller ci-dessous. Les statistiques seront sur
  //      https://depannageautonice.goatcounter.com
  //
  // Tant que ce code est vide, rien n'est chargé ni mesuré.
  goatcounter: '',

  // ── Contact ───────────────────────────────────────────────
  whatsappNumber: '33617684270',  // format international, sans "+"
  phoneDisplay: '06 17 68 42 70',
  phoneHref: '+33617684270',
};
