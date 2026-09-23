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

- **« Depuis 2004 »** — le nouveau design l'affiche dans le bandeau de
  l'accueil **et dans le pied de page de toutes les pages**, et il est repris
  en `foundingDate` dans les données structurées lues par Google.
- **« Disponible maintenant — un technicien décroche »** (accueil) : c'est une
  promesse qu'un humain répond, y compris à 3 h du matin. À garder seulement
  si c'est vrai toutes les nuits.
- **« Une dépanneuse à Nice en 30 à 60 minutes »** (titre de l'accueil) : le
  titre l'énonce comme une certitude. Le bandeau juste dessous dit « délai
  estimé », ce qui couvre juridiquement, mais le délai doit rester tenable
  aux heures de pointe.

Le « 10 000+ interventions » et le défilé de logos d'assureurs présentés
comme « partenaires » ont disparu avec le nouveau design. C'est une bonne
chose : le premier n'était pas vérifiable, et afficher les marques
d'assureurs comme partenaires sans convention signée expose à une
réclamation.

---

## Pages intérieures — points à trancher

Les cinq maquettes (services, zone, FAQ, à propos, contact) sont intégrées.
En les vérifiant, plusieurs points ne peuvent être réglés que par vous.

### Affirmations revenues avec la maquette « À propos »

La maquette de l'accueil avait retiré ces trois arguments ; celle de la page
À propos les réaffiche. Ils sont en ligne tels que vous les avez écrits, mais
ils vous engagent — un contrôle DGCCRF ou un client mécontent peut demander à
les voir justifiés :

- **« Plus de 20 ans d'expérience »** — suppose la création en 2004 (voir plus haut).
- **« Techniciens certifiés — permis poids-lourd, formation remorquage,
  habilitations VL/VUL à jour »** — gardez les justificatifs sous la main.
- **« Vous n'avancez rien quand votre contrat le couvre »** — vrai seulement
  si vous facturez l'assureur directement dans tous ces cas.

### Photos réelles — la section attend vos fichiers

La maquette prévoit une section « L'équipe et les camions » avec trois cases
**« Photo dépanneuse », « Photo atelier », « Photo équipe »**. Je ne l'ai pas
publiée vide : des cadres en pointillés marqués « emplacement réservé »
donneraient à un client l'impression d'un site inachevé.

L'image à côté du titre est celle choisie dans la maquette (`hero-3.webp`).
C'est une **illustration générée** — garage au néon, Mustang, enseigne
« GRAN MECANO AUTO » — pas une photo de votre atelier. Son texte alternatif le
dit honnêtement. Remplacez-la dès que possible par une vraie photo.

Envoyez-moi 3 ou 4 photos (téléphone suffit, en paysage) : je les compresse,
je remplace l'illustration et j'ajoute la section.

### Textes de la maquette modifiés

- **FAQ, assurance** — la maquette disait « avant d'appeler votre assurance,
  contactez-nous directement ». Un contrat avec assistance peut refuser de
  rembourser un dépannage qu'il n'a pas missionné : le client se retrouverait
  à payer. La réponse dit maintenant de signaler l'assistance à l'appel pour
  vérifier ce qui est couvert.
- **Contact, encadré légal** — la maquette annonçait des « mentions légales
  complètes (SIRET, TVA, assurance RC, médiateur…) ». Elles ne le sont pas
  encore (point 2 ci-dessus) : l'encadré renvoie simplement à la page.
- **Accueil, panneau « Délai & zone »** — il plaçait Antibes en « première
  couronne », la page Zone dans « Ouest du département ». Aligné sur la page
  Zone.
- **Zone, autoroute** — « appelez le 112 depuis une borne » : les bornes
  appellent directement l'exploitant. Devenu « utilisez une borne d'appel
  d'urgence ou appelez le 112 ».

