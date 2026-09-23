# Référencement local — ce qui est fait, ce qu'il reste à faire

Ce fichier note l'état du référencement du site et les actions qui ne peuvent
pas être faites depuis le code.

## Fait dans le site

- **Données structurées** `LocalBusiness` + `AutomotiveBusiness` + `EmergencyService`
  sur l'accueil (adresse, téléphone, horaires 24h/24, zone desservie, tarif de départ).
- **Une page par sujet** — services & tarifs, zone, FAQ, à propos, contact —
  chacune avec son titre, sa description, son `canonical` et son `BreadcrumbList`.
- **`FAQPage`** sur la page FAQ et chaque page ville : rend
  les questions éligibles à l'affichage enrichi dans les résultats Google. Le
  texte affiché et le balisage viennent de la même source dans
  `tools/build-pages.js`, ils ne peuvent pas diverger.
- **Pages locales** pour Cannes, Antibes, Menton, Cagnes-sur-Mer et Grasse.
  Chacune a son propre contenu (accès, pannes fréquentes sur place, quartiers,
  délai réel depuis Nice), son `BreadcrumbList` et son `Service` géolocalisé.
- **Sitemap** (14 URL) et `robots.txt` pointant dessus.
- **Image de partage** `img/og-cover.jpg` au format 1200×630 attendu par
  Facebook, WhatsApp et X.

## À faire hors du site — par ordre d'impact

### 1. Fiche Google Business Profile — le plus important

Pour « dépannage auto Nice », c'est la fiche Google, pas le site, qui remporte
l'essentiel des appels. Elle est gratuite.

1. Créer la fiche sur <https://business.google.com>, catégorie principale
   **« Service de dépannage automobile »**.
2. Faire valider l'adresse (courrier postal avec code, ou vidéo selon les cas).
3. Renseigner : horaires **24h/24 7j/7**, téléphone **06 17 68 42 70**,
   site web, zone desservie (toutes les communes du 06 où vous intervenez).
4. Ajouter au moins 10 photos réelles : camions, atelier, interventions.
   Les fiches avec photos récentes sortent devant.
5. **Demander systématiquement un avis** après chaque intervention réussie.
   C'est le premier critère de classement local. Un SMS avec le lien direct
   vers la fiche, envoyé le jour même, fonctionne mieux qu'une demande orale.
6. Répondre à tous les avis, y compris les négatifs.

N'achetez jamais d'avis : Google les détecte et peut suspendre la fiche.

### 2. Annuaires et cohérence des coordonnées

Le nom, l'adresse et le téléphone doivent être **écrits exactement pareil**
partout, sinon Google ne recoupe pas les sources :

```
Dépannage Auto Nice
Zone industrielle du Quai de la Blanquière, 06000 Nice
06 17 68 42 70
```

À inscrire sur : Pages Jaunes, Yelp, Apple Plans (Apple Business Connect),
Bing Places, et les annuaires de dépanneurs du 06.

### 3. Search Console

Déclarer le site sur <https://search.google.com/search-console>, soumettre
`sitemap.xml`, puis surveiller les requêtes qui amènent du trafic. C'est ce
qui dira quelles villes méritent une page supplémentaire.

### 4. Nom de domaine

Le site est publié sur `nikka77.github.io/depannageautonice`. Un vrai domaine
(`depannageautonice.fr`) inspire nettement plus confiance et se retient au
téléphone. Après l'achat, il faudra remplacer l'adresse de base dans
`tools/villes.json` (clé `site.base`), relancer les deux générateurs, et mettre
à jour les `canonical` et `og:url` de `demande.html`, `diagnostic.html` et
`mentions-legales.html`, qui ne sont pas générées.

## Modifier un texte du site

Les pages `index`, `services`, `zone`, `faq`, `a-propos` et `contact` sont
**générées** : le contenu vit dans `tools/pages/`, l'en-tête, le pied de page
et les questions fréquentes dans `tools/build-pages.js`. Après modification :

```bash
node tools/build-pages.js
```

Ne pas éditer ces fichiers HTML à la main, ils sont écrasés.

## Ajouter une ville

Le contenu des pages locales vit dans `tools/villes.json`. Pour ajouter une
commune, y ajouter une entrée puis relancer :

```bash
node tools/build-villes.js
node tools/build-pages.js   # met à jour le tableau des délais et le pied de page
```

Les fichiers `ville-*.html` et `sitemap.xml` sont **générés** : ne pas les
modifier à la main, ils sont écrasés à chaque exécution.

Une mise en garde : une page ville n'apporte quelque chose que si elle dit des
choses vraies et spécifiques à la commune. Dupliquer un même texte en changeant
le nom de la ville est traité par Google comme une page satellite et peut
pénaliser l'ensemble du site. Mieux vaut cinq bonnes pages que vingt vides.
