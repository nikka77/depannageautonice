// =============================================
// DEPANNAGEAUTONICE.FR — js/plaque.js
// Recherche d'un véhicule à partir de sa plaque.
//
// N'appelle jamais Auto Ways directement : passe par le relais serveur
// (config.js → plaqueEndpoint), seul détenteur du jeton.
// Sans relais configuré, le module s'efface et la saisie manuelle reste.
//
// Principe d'interface : aucun bouton à cliquer. Dès que la plaque est
// complète, la recherche part toute seule et le résultat s'affiche sous
// forme de fiche, corrigeable d'un clic.
// =============================================

window.Plaque = (function () {
  const CFG = window.SITE_CONFIG || {};

  const SIV = /^[A-Z]{2}-?[0-9]{3}-?[A-Z]{2}$/;
  const FNI = /^[0-9]{1,4}-?[A-Z]{2,3}-?[0-9]{2}$/;

  // Délai après la dernière frappe avant de lancer la recherche. Assez
  // court pour paraître instantané, assez long pour ne pas déclencher
  // un appel payant sur une plaque encore en cours de correction.
  const DELAI_FRAPPE = 500;

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

  // Auto Ways crie tout en majuscules : « ÉLECTRICITÉ », « BERLINE À
  // HAYON ». On adoucit pour l'affichage sans toucher à la donnée.
  function joli(texte) {
    if (!texte) return '';
    const t = String(texte).trim();
    if (t !== t.toUpperCase()) return t;       // déjà en casse mixte
    if (t.length <= 3) return t;               // sigles : VP, SUV…
    return t.charAt(0) + t.slice(1).toLowerCase();
  }

  function echapper(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Les faits qui comptent pour un dépanneur : l'énergie (un électrique
  // ne se remorque pas comme un thermique) et la carrosserie (un fourgon
  // n'entre pas sur le même plateau).
  function faits(v) {
    return [
      v.annee,
      joli(v.energie),
      joli(v.carrosserie),
      v.puissanceCh ? `${v.puissanceCh} ch` : null,
      v.portes ? `${v.portes} portes` : null,
      v.pneu,
    ].filter(Boolean);
  }

  function nomComplet(v) {
    return [joli(v.marque), joli(v.modele)].filter(Boolean).join(' ');
  }

  function carteHTML(v, T) {
    const nom = nomComplet(v);
    // La finition n'est pas adoucie : « 1.5 DCI 90 INTENS », « 16V », « KWH »
    // sont des références techniques que la minuscule rendrait illisibles.
    const version = v.version || '';
    return `
      <div class="veh-tete">
        <svg class="veh-coche" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        <div class="veh-titre">
          <strong>${echapper(nom)}</strong>
          ${version ? `<span class="veh-version">${echapper(version)}</span>` : ''}
        </div>
        <button type="button" class="veh-effacer" aria-label="${echapper(T.pasMonVehicule)}">${echapper(T.pasLeBon)}</button>
      </div>
      ${faits(v).length ? `<ul class="veh-faits">${faits(v).map(f => `<li>${echapper(f)}</li>`).join('')}</ul>` : ''}
    `;
  }

  async function rechercher(plaque, signal) {
    if (!disponible()) throw new Error('non-configure');
    if (!valide(plaque)) throw new Error('format');

    const url = `${CFG.plaqueEndpoint}?plaque=${encodeURIComponent(normaliserSaisie(plaque))}`;
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (res.status === 404) throw new Error('introuvable');
    if (res.status === 429) throw new Error('trop-de-requetes');
    if (!res.ok) throw new Error('indisponible');
    const data = await res.json();
    if (!data || !data.vehicule) throw new Error('introuvable');
    return data.vehicule;
  }

  const MESSAGES = {
    'format':           'Format attendu : AA-123-AA',
    'introuvable':      'Véhicule introuvable — renseignez la marque et le modèle vous-même',
    'trop-de-requetes': 'Trop de recherches d\'affilée, patientez une minute',
    'indisponible':     'Recherche indisponible — renseignez la marque et le modèle vous-même',
    'delai':            'La recherche a pris trop de temps — renseignez les champs vous-même',
    'non-configure':    'Recherche automatique non disponible',
  };

  function message(erreur) {
    return MESSAGES[erreur && erreur.message] || MESSAGES['indisponible'];
  }

  // Câble un champ plaque à une zone d'affichage.
  //   champ   : <input> de la plaque
  //   carte   : conteneur où s'affiche la fiche du véhicule trouvé
  //   statut  : conteneur des messages (recherche en cours, erreur)
  //   onTrouve(vehicule) / onEfface() : notifient la page hôte
  //   textes  : traductions facultatives (fenêtre de demande en anglais…)
  function brancher({ champ, carte, statut, onTrouve, onEfface, textes }) {
    const T = Object.assign({ recherche: 'Recherche du véhicule…', pasLeBon: 'Ce n\'est pas le bon', pasMonVehicule: 'Ce n\'est pas mon véhicule' }, MESSAGES, textes || {});
    if (!champ) return null;
    if (!disponible()) return null;

    let minuteur = null;
    let enCours = null;      // AbortController de la requête en vol
    let derniereRecherche = '';
    let trouve = null;

    function afficherStatut(texte, type) {
      if (!statut) return;
      statut.textContent = texte || '';
      statut.hidden = !texte;
      statut.className = 'plaque-statut' + (type ? ' is-' + type : '');
    }

    function viderCarte() {
      if (!carte) return;
      carte.innerHTML = '';
      carte.hidden = true;
      carte.classList.remove('is-visible');
    }

    function effacer({ silencieux } = {}) {
      if (minuteur) clearTimeout(minuteur);
      if (enCours) { enCours.abort(); enCours = null; }
      derniereRecherche = '';
      trouve = null;
      viderCarte();
      afficherStatut('', null);
      champ.classList.remove('is-trouve');
      if (!silencieux && onEfface) onEfface();
    }

    function afficherCarte(v) {
      if (!carte) return;
      carte.innerHTML = carteHTML(v, T);
      carte.hidden = false;
      // Le passage de la classe après insertion déclenche la transition.
      requestAnimationFrame(() => carte.classList.add('is-visible'));
      const bouton = carte.querySelector('.veh-effacer');
      if (bouton) {
        bouton.addEventListener('click', () => {
          effacer();
          champ.value = '';
          champ.focus();
        });
      }
    }

    async function lancer() {
      const plaque = normaliserSaisie(champ.value);
      if (!valide(plaque) || plaque === derniereRecherche) return;

      derniereRecherche = plaque;
      if (enCours) enCours.abort();
      enCours = new AbortController();
      const monController = enCours;

      const expiration = setTimeout(() => monController.abort('delai'), CFG.plaqueTimeoutMs || 10000);
      champ.classList.add('is-recherche');
      afficherStatut(T.recherche, 'attente');

      try {
        const vehicule = await rechercher(plaque, monController.signal);
        if (monController !== enCours) return;   // une frappe plus récente a pris le relais
        trouve = vehicule;
        afficherStatut('', null);
        champ.classList.add('is-trouve');
        afficherCarte(vehicule);
        if (onTrouve) onTrouve(vehicule);
      } catch (e) {
        if (monController !== enCours) return;
        if (e.name === 'AbortError') {
          // Annulation provoquée par une nouvelle frappe : on ne dit rien.
          if (monController.signal.reason !== 'delai') return;
          afficherStatut(T.delai, 'erreur');
        } else {
          afficherStatut(T[e && e.message] || T.indisponible, 'erreur');
        }
        viderCarte();
        champ.classList.remove('is-trouve');
        if (onEfface) onEfface();
      } finally {
        clearTimeout(expiration);
        champ.classList.remove('is-recherche');
      }
    }

    champ.addEventListener('input', () => {
      champ.value = formater(champ.value);
      if (minuteur) clearTimeout(minuteur);

      // Toute modification invalide le résultat précédent.
      if (trouve) effacer();

      if (!valide(champ.value)) {
        afficherStatut('', null);
        return;
      }
      minuteur = setTimeout(lancer, DELAI_FRAPPE);
    });

    // Coller une plaque ou quitter le champ déclenche sans attendre.
    champ.addEventListener('blur', () => {
      if (minuteur) clearTimeout(minuteur);
      if (valide(champ.value)) lancer();
    });

    return {
      effacer,
      vehicule: () => trouve,
      plaque: () => champ.value.trim(),
    };
  }

  return { disponible, formater, valide, joli, nomComplet, rechercher, message, brancher };
})();
