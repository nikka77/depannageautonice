# Recherche de véhicule par plaque — mise en service

Le site sait remplir la marque, le modèle et l'année à partir d'une plaque
d'immatriculation, via l'API [Auto Ways](https://app.auto-ways.net/api-keys).
La fonctionnalité est **inactive tant que le relais n'est pas déployé** : le
bouton « Rechercher » reste masqué et la saisie manuelle fonctionne comme avant.

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

## Déploiement (une seule fois)

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

## Ajuster la correspondance des champs

Le nom exact des champs renvoyés par Auto Ways n'a pas pu être vérifié à
l'écriture du code : `normaliser()` dans `api/plaque.js` essaie donc plusieurs
noms probables (`marque`/`make`/`brand`, etc.).

Après le premier déploiement, mettre `DEBUG_PLAQUE=1`, faire une recherche,
et regarder le champ `brut` de la réponse : il contient la réponse d'Auto Ways
telle quelle. Compléter alors les listes de `normaliser()` avec les vrais noms,
puis **remettre `DEBUG_PLAQUE` à vide** — cette réponse brute n'a pas à être
exposée en permanence.

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

## Où c'est utilisé

- `diagnostic.html` — remplit marque, modèle et année du formulaire véhicule.
  Les champs restent modifiables : la base officielle se trompe parfois sur la
  finition.
- `demande.html` — étape « Détails ». Le véhicule identifié est joint au message
  envoyé au garage, pour partir avec le bon matériel.
