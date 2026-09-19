// =============================================
// DEPANNAGEAUTONICE.FR — js/plaque.js
// Recherche d'un véhicule à partir de sa plaque.
//
// N'appelle jamais Auto Ways directement : passe par le relais serveur
// (config.js → plaqueEndpoint), seul détenteur du jeton.
// Sans relais configuré, le module s'efface et la saisie manuelle reste.
// =============================================

window.Plaque = (function () {
  const CFG = window.SITE_CONFIG || {};

  const SIV = /^[A-Z]{2}-?[0-9]{3}-?[A-Z]{2}$/;
  const FNI = /^[0-9]{1,4}-?[A-Z]{2,3}-?[0-9]{2}$/;

  function disponible() {
    return Boolean(CFG.plaqueEndpoint);
  }

  function normaliserSaisie(valeur) {
    return String(valeur || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  // Met la plaque au format lisible AA-123-AA au fil de la frappe.
  function formater(valeur) {
    const v = normaliserSaisie(valeur).slice(0, 9);
    const m = v.match(/^([A-Z]{0,2})([0-9]{0,3})([A-Z]{0,2})$/);
    if (!m) return v;
    return [m[1], m[2], m[3]].filter(Boolean).join('-');
  }

  function valide(valeur) {
    const v = normaliserSaisie(valeur);
    return SIV.test(v) || FNI.test(v);
  }

  async function rechercher(plaque) {
    if (!disponible()) throw new Error('non-configure');
    if (!valide(plaque)) throw new Error('format');

    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), CFG.plaqueTimeoutMs || 10000);

    try {
      const url = `${CFG.plaqueEndpoint}?plaque=${encodeURIComponent(normaliserSaisie(plaque))}`;
      const res = await fetch(url, { signal: controleur.signal, headers: { Accept: 'application/json' } });
      if (res.status === 404) throw new Error('introuvable');
      if (res.status === 429) throw new Error('trop-de-requetes');
      if (!res.ok) throw new Error('indisponible');
      const data = await res.json();
      if (!data || !data.vehicule) throw new Error('introuvable');
      return data.vehicule;
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('delai');
      throw e;
    } finally {
      clearTimeout(minuteur);
    }
  }

  const MESSAGES = {
    'format':           'Format attendu : AA-123-AA',
    'introuvable':      'Véhicule introuvable — saisissez la marque et le modèle à la main',
    'trop-de-requetes': 'Trop de recherches, patientez une minute',
    'indisponible':     'Recherche indisponible — saisissez la marque et le modèle à la main',
    'delai':            'La recherche a pris trop de temps — saisissez à la main',
    'non-configure':    'Recherche automatique non disponible',
  };

  function message(erreur) {
    return MESSAGES[erreur && erreur.message] || MESSAGES['indisponible'];
  }

  // Câble un champ plaque + un bouton de recherche.
  // onSucces(vehicule) reçoit les données ; onEtat(texte, type) affiche le retour.
  function brancher({ champ, bouton, onSucces, onEtat }) {
    if (!champ || !bouton) return;

    // Le bouton est masqué dans le HTML par défaut : sans relais configuré,
    // il ne doit jamais apparaître, et la saisie manuelle reste seule.
    if (!disponible()) {
      bouton.hidden = true;
      return;
    }
    bouton.hidden = false;

    champ.addEventListener('input', () => {
      champ.value = formater(champ.value);
      bouton.disabled = !valide(champ.value);
      if (onEtat) onEtat('', null);
    });

    bouton.disabled = !valide(champ.value);

    bouton.addEventListener('click', async () => {
      const libelle = bouton.textContent;
      bouton.disabled = true;
      bouton.textContent = 'Recherche…';
      if (onEtat) onEtat('Recherche du véhicule…', 'attente');

      try {
        const vehicule = await rechercher(champ.value);
        const nom = [vehicule.marque, vehicule.modele, vehicule.version].filter(Boolean).join(' ');
        if (onEtat) onEtat(nom ? `Véhicule trouvé : ${nom}` : 'Véhicule trouvé', 'ok');
        if (onSucces) onSucces(vehicule);
      } catch (e) {
        if (onEtat) onEtat(message(e), 'erreur');
      } finally {
        bouton.textContent = libelle;
        bouton.disabled = !valide(champ.value);
      }
    });
  }

  return { disponible, formater, valide, rechercher, message, brancher };
})();
