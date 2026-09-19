# Recherche de véhicule par plaque — mise en service

Le site sait remplir la marque, le modèle et l'année à partir d'une plaque
d'immatriculation, via l'API [Auto Ways](https://app.auto-ways.net/api-keys).
**Le relais est déployé et opérationnel.** Projet Vercel `depannage-plaque`,
point de terminaison `https://depannage-plaque.vercel.app/api/plaque`, déjà
renseigné dans `config.js`. Vider `plaqueEndpoint` remasque le bouton et remet
la saisie manuelle seule.

## Pourquoi un relais, et pas un appel direct

Auto Ways attend le jeton **dans l'URL** :

```
GET https://app.auto-ways.net/api/v1/fr?plaque=AB-123-CD&token=VOTRE_JETON&country=fr
```

Le site est statique, servi depuis un dépôt GitHub **public**. Un jeton placé
dans `config.js` serait donc :

- lisible par quiconque ouvre le dépôt, et retrouvable dans l'historique git
  même après suppression ;
- visible dans l'onglet réseau du navigateur de chaque visiteur ;
- ramassé en quelques minutes par les robots qui scannent GitHub.

La consommation étant facturée, le jeton ne doit jamais quitter le serveur.
`api/plaque.js` sert de relais : il détient le jeton, n'expose que la recherche
par plaque, et ne renvoie jamais l'URL amont au navigateur.

## Ce qui est déjà en place

Le relais a été déployé en *inline deployment* (l'intégration GitHub de Vercel
n'était pas installée sur le compte). Il ne contient que la fonction, pas le
site : celui-ci reste sur GitHub Pages.

Conséquence à connaître : **le déploiement n'est pas relié au dépôt**. Modifier
`api/plaque.js` ici ne met pas Vercel à jour automatiquement. Pour lier les
deux, installer l'app Vercel sur GitHub (<https://github.com/apps/vercel>) puis
importer le dépôt — les déploiements suivront alors chaque push.

Variables d'environnement déjà définies sur le projet :

| Nom | Valeur | État |
|---|---|---|
| `AUTOWAYS_TOKEN` | le jeton Auto Ways | défini, type « sensitive » (non relisible) |
| `ALLOWED_ORIGINS` | `https://nikka77.github.io,http://localhost:8123` | défini |
| `DEBUG_PLAQUE` | `0` | désactivé |

## Refaire le déploiement depuis zéro

1. **Importer le dépôt sur Vercel** — <https://vercel.com/new>, choisir
   `nikka77/depannageautonice`. Aucun réglage de build : le projet est statique,
   Vercel détecte seul le dossier `api/`.

2. **Déclarer les variables d'environnement** — Project → Settings →
   Environment Variables. Les valeurs vivent ici, jamais dans le dépôt :

   | Nom | Valeur | Obligatoire |
   |---|---|---|
   | `AUTOWAYS_TOKEN` | le jeton Auto Ways | oui |
   | `ALLOWED_ORIGINS` | `https://nikka77.github.io` | recommandé |
   | `DEBUG_PLAQUE` | `1` temporairement, voir plus bas | non |

   `ALLOWED_ORIGINS` accepte plusieurs origines séparées par des virgules.
   Toute requête venant d'ailleurs — ou sans origine, donc `curl` — est
   refusée avec un 403.

3. **Récupérer l'URL du relais**, de la forme
   `https://depannageautonice.vercel.app/api/plaque`.

4. **Renseigner `config.js`** dans le dépôt :

   ```js
   plaqueEndpoint: 'https://depannageautonice.vercel.app/api/plaque',
   ```

   Ce champ contient une simple URL publique, aucun secret : il peut être
   committé sans risque. Le bouton « Rechercher » apparaît dès ce moment.

## Le format réel d'Auto Ways

Vérifié en production. La réponse est enveloppée et **tous les champs sont
préfixés `AWN_`** :

```json
{ "code": 200, "error": false, "message": "Succès",
  "data": { "AWN_marque": "PEUGEOT", "AWN_modele": "EXPERT",
            "AWN_finition": "M ELECTRIQUE 136 PACK ASPHALT 50 KWH",
            "AWN_date_mise_en_circulation": "13-03-2023",
            "AWN_energie": "ÉLECTRICITÉ", "AWN_carrosserie": "FOURGON",
            "AWN_puissance_fiscale": "9", "AWN_puissance_chevaux": "136",
            "AWN_pneus": [{ "label": "155/65R14 75T", … }], … } }
```

Trois pièges, tous traités dans `normaliser()` :

- **Les champs inconnus ne sont pas vides** : Auto Ways écrit `"INCONNU"`, `"0"`
  ou `[]`. Sans filtrage, le client verrait s'afficher « INCONNU ».
- **Une plaque absente de la base ne donne pas un 404** mais un **500 avec une
  page HTML** d'erreur serveur. Le relais traite ce cas comme « véhicule
  introuvable » : pour le visiteur la suite est la même (saisie manuelle), et
  annoncer une panne de service serait faux la plupart du temps. Revers de la
  médaille : une vraie panne d'Auto Ways sera annoncée de la même façon.
- **`AWN_energie` et `AWN_energie_description` se contredisent** sur certains
  véhicules (une Clio dCi renvoie `GAZOLE` d'un côté, `ESSENCE` de l'autre).
  Seul `AWN_energie` est utilisé.

Pour réinspecter la réponse brute : mettre `DEBUG_PLAQUE=1`, redéployer, puis
appeler avec `&diag=1`. **Attention**, `DEBUG_PLAQUE=1` autorise aussi `?diag=1`
à contourner le filtre d'origine : à remettre à `0` et redéployer aussitôt après.

## Protections en place

- **Origine** : seules les origines de `ALLOWED_ORIGINS` sont servies ; un appel
  sans en-tête `Origin` est refusé.
- **Format** : la plaque est validée contre le format SIV (`AA-123-AA`) et
  l'ancien FNI avant tout appel payant.
- **Débit** : 8 recherches par minute et par adresse IP. C'est un garde-fou
  « au mieux », pas un rempart : chaque instance serverless a sa propre mémoire
  et Vercel peut en lancer plusieurs. **Définissez aussi un plafond de
  consommation côté Auto Ways**, c'est la seule limite réellement fiable.
- **Fuite** : le corps d'erreur amont n'est jamais relayé, car il peut contenir
  l'URL appelée, donc le jeton.

## Si le jeton a été exposé

S'il a été committé, publié, ou collé dans un outil tiers : le révoquer et en
générer un nouveau depuis <https://app.auto-ways.net/api-keys>. Retirer le
jeton d'un fichier ne suffit pas, l'historique git le conserve.

## Comment ça se présente au client

Aucun bouton à cliquer. Dès que la plaque saisie est complète et valide, la
recherche part seule après une demi-seconde de pause dans la frappe. Ce délai
n'est pas cosmétique : sans lui, chaque caractère tapé déclencherait un appel
facturé. Une frappe en cours annule la requête précédente, et une plaque déjà
interrogée n'est jamais redemandée.

Le résultat s'affiche en **fiche** plutôt qu'en remplissant les champs en
silence : nom du véhicule, finition, puis les faits utiles en pastilles —
année, énergie, carrosserie, puissance, nombre de portes, et monte de pneus
quand elle est connue. L'énergie et la carrosserie sont là pour une raison
opérationnelle : un électrique ne se remorque pas comme un thermique, et un
fourgon n'entre pas sur le même plateau.

Un lien « Ce n'est pas le bon » vide la fiche, les champs qu'elle avait
remplis, et le champ plaque. La saisie manuelle reprend aussitôt la main.

`js/plaque.js` est le composant partagé par les deux pages : même
comportement, même fiche, un seul endroit à modifier.

## Où c'est utilisé

- `diagnostic.html` — renseigne marque, modèle et année, et reporte la **monte
  de pneus d'origine** sur l'attestation quand Auto Ways la connaît. Ce que le
  client a tapé lui-même n'est jamais écrasé ; seuls les champs posés par une
  recherche précédente le sont.
- `demande.html` — étape « Détails ». Le véhicule identifié est joint au message
  envoyé au garage et rappelé sur l'écran de confirmation. La plaque est
  conservée même si le client clique « Passer », qui ne concerne que la
  description.
