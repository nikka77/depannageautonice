# À compléter avant publication

Trois points bloquent une mise en ligne commerciale propre. Aucun ne peut être
réglé depuis le code : il faut des informations que vous seul détenez.

---

## 1. Le domaine `depannageautonice.fr` n'existe pas — BLOQUANT

Vérifié par interrogation DNS : ce domaine n'a **aucun enregistrement**, ni NS,
ni A, ni MX. Il n'est pas enregistré.

Conséquence directe : l'adresse **`contact@depannageautonice.fr`**, affichée
dans vos mentions légales et proposée pour l'exercice des droits RGPD, ne
reçoit rien. Tout message envoyé là rebondit. Un visiteur qui vous écrit croit
vous avoir contacté ; vous ne recevez jamais rien.

Deux solutions, au choix :

- **Acheter le domaine** (une dizaine d'euros par an chez OVH, Gandi,
  Infomaniak) et créer la boîte `contact@`. C'est la solution recommandée :
  vous gagnez aussi une adresse de site mémorisable au téléphone, bien plus
  crédible que `nikka77.github.io/depannageautonice`.
- **Utiliser une adresse qui existe déjà** (votre Gmail professionnel par
  exemple) et la substituer partout.

Dites-moi laquelle et je répercute l'adresse dans tout le site.

En attendant, j'ai désamorcé le piège le plus grave : le formulaire de contact
n'ouvre plus un e-mail vers cette adresse morte, il bascule sur WhatsApp.

---

## 2. Mentions légales incomplètes — BLOQUANT

Les mentions actuelles omettent des éléments **obligatoires** pour un
professionnel français (article 6 III-1 de la LCEN, et article L616-1 du Code
de la consommation pour la médiation).

Je ne les ai pas ajoutées avec des « à compléter » visibles : une page légale
trouée est pire que rien aux yeux d'un client comme d'un contrôleur.
Donnez-moi ces valeurs et j'intègre le texte définitif en quelques minutes.

| Information | Où la trouver |
|---|---|
| **Forme juridique** (SARL, SASU, auto-entrepreneur…) | extrait Kbis / avis de situation INSEE |
| **SIRET** (14 chiffres) | avis de situation INSEE, annuaire-entreprises.data.gouv.fr |
| **RCS + ville d'immatriculation** | Kbis (sauf auto-entrepreneur non commerçant) |
| **Capital social** | Kbis, si société |
| **N° TVA intracommunautaire** | `FR` + clé + SIREN, ou « TVA non applicable, art. 293 B du CGI » si franchise en base |
| **Assurance RC professionnelle** | nom de l'assureur et étendue géographique de la garantie |
| **Médiateur de la consommation** | nom et site du médiateur auquel vous adhérez |

La **médiation de la consommation** est le point le plus souvent oublié : tout
professionnel vendant à des particuliers doit adhérer à un médiateur agréé et
en indiquer les coordonnées sur son site. L'absence est passible d'amende
administrative.

### Affichage des prix

Le site annonce « à partir de 70 € » sans préciser TTC ou HT. Pour une
clientèle de particuliers, le prix doit être affiché **TTC** (article L112-1 du
Code de la consommation). Confirmez-moi votre situation :

- assujetti à la TVA → j'écris « 70 € TTC » ;
- franchise en base → j'écris « 70 € — TVA non applicable, art. 293 B du CGI ».

---

## 3. Réception des demandes par e-mail — IMPORTANT

`config.js` a `formAccessKey: ''`, donc aucune demande ne vous arrive
automatiquement. Le tunnel le dit honnêtement au client et le bascule sur
WhatsApp, mais vous perdez tout client qui n'utilise pas WhatsApp.

Cinq minutes suffisent : créer une clé gratuite sur <https://web3forms.com>
avec l'adresse qui doit recevoir les demandes, puis la coller dans
`config.js`. Cette clé est prévue pour être publique, elle peut être commitée
sans risque — contrairement à la clé Auto Ways.

---

## Affirmations à confirmer

Ces chiffres sont invérifiables depuis l'extérieur. S'ils sont exacts, rien à
faire ; sinon il faut les corriger, une publicité trompeuse se retournant
contre vous.

- **« 10 000+ interventions réalisées »** sur la page d'accueil.
- **« Depuis 2004 »**, repris aussi en `foundingDate` dans les données
  structurées lues par Google.
- **« Intervention en 30 min à 1h »** — présenté comme un délai estimé, ce qui
  est la bonne formulation, mais il doit rester réaliste aux heures de pointe.

---

## Page « À propos » — ce que je n'ai pas écrit

`a-propos.html` existe et est complète sur tout ce que le site affirmait déjà :
zone, services, horaires, atelier, tarif de départ, assurances, déroulé d'une
intervention, limites. Je n'y ai **rien inventé**.

Manquent donc les éléments qu'on attend d'une page « qui sommes-nous » et que
vous seul connaissez. Donnez-les-moi et je les intègre :

| Élément | Pourquoi ça compte |
|---|---|
| **Année de création réelle** | la page ne dit pas « depuis 2004 » tant que ce n'est pas confirmé (voir ci-dessus) |
| **Qui tient l'entreprise** | un prénom, un parcours en deux phrases. C'est ce qui distingue un artisan d'une plateforme anonyme |
| **Taille de l'équipe et du parc** | « 2 camions plateau » est plus crédible qu'un chiffre rond |
| **Agréments / certifications** | agrément préfectoral, conventions d'assurance, qualifications mécaniques |
| **Une photo de l'atelier ou du camion** | la page n'a aucune image ; une vraie photo vaut mieux qu'une banque d'images |

Trois affirmations de la page sont à vérifier de votre côté, parce qu'elles
sont reprises du reste du site et qu'elles vous engagent :
« pas d'intervention sur autoroute », « pas de carrosserie », « pas de
désincarcération ». Si l'une est fausse, dites-le-moi : elle envoie
actuellement des clients ailleurs.
