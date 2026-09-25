// =============================================
// DÉPANNAGE AUTO NICE — js/mesure.js
// Mesure d'audience GoatCounter, sans cookie. Inactive tant que
// SITE_CONFIG.goatcounter est vide (voir config.js).
//
// Au-delà des pages vues, compte les gestes qui font un client :
//   appel/<endroit>, whatsapp/<endroit>, demande/<endroit>,
//   diagnostic/<endroit>, et demande/<étape|envoyee|whatsapp> (voir js/demande-rapide.js).
// <endroit> : titre, en-tete, barre-mobile, colonne, bandeau, encart, pied, page.
// =============================================

(function () {
  'use strict';
  const code = (window.SITE_CONFIG || {}).goatcounter;
  window.mesurer = function () {};          // sans code : ne fait rien
  if (!code) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  document.head.appendChild(s);

  // Événement nommé, tolérant au chargement pas encore terminé du script.
  const attente = [];
  window.mesurer = function (nom) {
    const envoyer = () => window.goatcounter.count({ path: nom, title: document.title, event: true });
    if (window.goatcounter && window.goatcounter.count) envoyer();
    else attente.push(envoyer);
  };
  s.addEventListener('load', () => { while (attente.length) try { attente.shift()(); } catch { /* ignoré */ } });

  const endroit = (el) =>
    el.closest('.hero, .intro') ? 'titre'
    : el.closest('.hd, .dem-header, .diag-header') ? 'en-tete'
    : el.closest('.bar') ? 'barre-mobile'
    : el.closest('.rail') ? 'colonne'
    : el.closest('.band') ? 'bandeau'
    : el.closest('.promo') ? 'encart'
    : el.closest('footer') ? 'pied'
    : 'page';

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const h = a.getAttribute('href');
    const type = h.startsWith('tel:') ? 'appel'
      : h.includes('wa.me/') ? 'whatsapp'
      : /(^|\/)demande\.html/.test(h) ? 'demande'
      : /(^|\/)diagnostic\.html/.test(h) ? 'diagnostic'
      : null;
    if (type) window.mesurer(`${type}/${endroit(a)}`);
  }, { capture: true });
})();
