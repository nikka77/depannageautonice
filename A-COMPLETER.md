# À compléter avant publication

## 0. Rappels du 25 septembre 2026 — à faire de votre côté

### Référencement local : inscrire l'entreprise partout (gratuit)

C'est ce qui fait gagner les concurrents locaux (Millo : 174 avis Google),
plus que leur site. À faire dans cet ordre, **avec exactement le même nom,
la même adresse et le même numéro partout** (Google compare) :

1. **Google Business Profile** (business.google.com) — le plus important.
   Catégorie « Service de dépannage automobile », horaires 24h/24, zone
   desservie, lien du site, photos réelles (camions, atelier, équipe).
   Ensuite, demandez un avis après **chaque** intervention (lien court par
   SMS ou WhatsApp) et répondez à chaque avis. Envoyez-moi le lien de la
   fiche : j'ajoute les avis réels au site.
2. **PagesJaunes / Solocal** (pagesjaunes.fr, fiche gratuite) — alimente aussi
   **Mappy**.
3. **Apple Business Connect** (businessconnect.apple.com) — Apple Plans et Siri,
   indispensable pour les iPhone.
4. **Bing Places** (bingplaces.com) — Bing, Qwant, DuckDuckGo et certains
   assistants IA s'en servent. Import possible depuis la fiche Google.
5. **Waze** (via Waze Ads / fiche lieu) et **OpenStreetMap** (openstreetmap.org,
   gratuit : c'est la carte utilisée sur notre page Zone).
6. Annuaires secondaires : Facebook (page entreprise), 118 712, Hoodspot,
   Cylex, Justacoté, Yelp, Trustpilot (avis).

### Grille tarifaire — à valider

Les prix publiés (page Tarifs, pages services, estimateur) sont une
**proposition** alignée sur la concurrence : départ à 70 €, remorquage
95 € jusqu'à 20 km, 2,20 €/km au-delà de 50 km, nuit/dimanche +40 €,
sous-sol +30 €, ouverture de porte 90 €, erreur de carburant 150 €,
gardiennage 48 h offertes puis 10 €/jour, annulation après départ 40 €.
Un prix affiché engage : relisez-les. Tout est dans **un seul fichier**,
`tools/tarifs.js` ; changez un chiffre puis lancez `npm run build`.

Si l'entreprise est en **franchise de TVA** (micro-entreprise), dites-le-moi :
« TTC » doit alors devenir « TVA non applicable, art. 293 B du CGI ».

### Services — à confirmer

Le site annonce désormais les mêmes services que les concurrents (21 pages) :
clés perdues et reproduction de clé/carte, écrou antivol, parking souterrain,
aéroport, moto/scooter, utilitaires et camping-cars (poids lourds sur devis),
électriques, treuillage, transport Monaco/Italie, épave gratuite, gardiennage,
diagnostic électronique, recharge de clim, mécanique à l'atelier.
Retirez-moi ceux que vous ne faites pas vraiment (liste : `tools/services.js`).

### Conditions générales de vente

Rédigées sur le modèle du secteur (page `cgv.html`). Elles renvoient aux
mentions légales pour le SIRET et le **médiateur de la consommation** (point 2
ci-dessous, toujours manquants). Elles affirment aussi que l'entreprise est
**assurée** pour les dommages pendant le transport : confirmez-le. Une
relecture par votre comptable ou un juriste reste conseillée.

### Photos

Aucune photo réelle pour l'instant : dès que vous en avez (camions, atelier,
équipe, interventions), envoyez-les, elles remplaceront les illustrations.

---

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


---

## Analyse complète — points qui dépendent de vous

### Majoration de nuit et jours fériés : le site se contredit

Les mentions légales (section 7, texte d'origine) disent que le tarif de
70 € s'entend « hors prestations spécifiques (remorquage longue distance,
intervention de nuit, jours fériés) ». Partout ailleurs le site promet « prix
annoncé = prix facturé, aucun supplément ». Les deux ne sont pas
incompatibles si la majoration est annoncée au téléphone, mais un client qui
paie plus la nuit se sentira trompé en relisant la page d'accueil.

Dites-moi s'il y a une majoration de nuit ou de jour férié, et de combien :
j'écris « majoration de nuit annoncée à l'appel » sur les pages de tarifs, ou
je retire la mention des mentions légales.

### « Clés enfermées »

Les pages ville annonçaient une septième intervention, « clés enfermées —
ouverture sans dégât », absente de la page Services. Je l'ai remplacée par
« dépannage sur place » pour coller aux six interventions de votre maquette.
Si vous ouvrez réellement les véhicules verrouillés, dites-le : je l'ajoute
partout, c'est une recherche fréquente.

### Adresse e-mail retirée des mentions légales

`contact@depannageautonice.fr` ne reçoit rien (point 1). Je l'ai retirée des
mentions légales : l'exercice des droits RGPD passe par courrier à l'atelier
ou par téléphone en attendant une adresse qui fonctionne.

### Durée de conservation des données

La CNIL demande d'indiquer combien de temps vous gardez les demandes reçues.
Je ne l'ai pas inventée. Usage courant : le temps de l'intervention et de la
facturation, puis 3 ans pour un client (10 ans pour les factures, obligation
comptable). Donnez-moi votre pratique réelle.

### Relais de la plaque : redéploiement

`api/plaque.js` ne recopie plus dans les journaux Vercel la réponse d'erreur
d'Auto Ways (elle pouvait contenir votre clé et la plaque du client). Le
relais en ligne n'est mis à jour qu'après un redéploiement du projet Vercel
`depannage-plaque`.

---

## Nouveautés à activer ou valider

### Mesure d'audience — 3 minutes pour l'activer

Tout est en place mais inactif. Créez un compte gratuit sur
<https://www.goatcounter.com/signup>, choisissez un code (par exemple
`depannageautonice`) et collez-le dans `config.js`, ligne `goatcounter`.
Les statistiques seront sur `https://<votre-code>.goatcounter.com`.

Ce qui sera compté, sans cookie ni bandeau de consentement :
- les pages vues ;
- chaque clic sur **Appeler**, **WhatsApp**, **Demander**, **Diagnostic**,
  avec l'endroit du clic (`appel/titre`, `appel/barre-mobile`,
  `whatsapp/colonne`…) : vous saurez quel bouton rapporte des appels ;
- chaque demande terminée (`demande-envoyee/sent` si elle est arrivée par
  e-mail, `demande-envoyee/manual` si le client a dû finir sur WhatsApp) ;
- les photos partagées (`photo-partagee`).

### Nouvelles pages ville — délais à valider

Saint-Laurent-du-Var, Villeneuve-Loubet et Vence sont en ligne. Faute
d'informations de votre part, j'ai écrit uniquement des faits publics
(géographie, accès, lieux connus), sous le titre « Bon à savoir à… » et non
« Ce que nous voyons le plus souvent » — ce qui aurait inventé votre
expérience. **Les délais sont mes estimations**, calées sur les distances et
vos cinq pages existantes : Saint-Laurent-du-Var 20 à 40 min,
Villeneuve-Loubet 30 à 50 min, Vence 35 min à 1 h. Corrigez-les dans
`tools/villes.json` si votre réalité diffère, puis lancez
`node tools/build-pages.js && node tools/build-villes.js`.

Au passage, la page Cagnes-sur-Mer indique « A8 sortie 47 (Cagnes-sur-Mer)
ou 48 (Villeneuve-Loubet) » : il me semble que c'est l'inverse (47
Villeneuve-Loubet, 48 Cagnes-sur-Mer). À vérifier sur place.

### Pas de page Monaco

Monaco est un autre pays, avec sa propre réglementation du remorquage et de
la fourrière. Une page « Dépannage Monaco » risquerait de promettre une
intervention que vous n'avez pas le droit de faire. Dites-moi ce que vous y
faites réellement (dépannage sur place ? remorquage vers la France ?) et je
l'écris.

### Versions anglaise et italienne — une question

Les pages `en/` et `it/` disent que l'équipe parle français et proposent
WhatsApp pour un message écrit. **Si quelqu'un chez vous parle anglais ou
italien au téléphone, dites-le** : je l'annoncerai, c'est un vrai argument
face aux concurrents. Le formulaire de demande et le diagnostic restent en
français ; les liens qui y mènent le précisent.

### Diagnostic pneus : « attestation officielle » retirée

La page promettait une « attestation officielle utilisable en cas de
contrôle » et une « attestation (contrôle police) ». C'est un auto-diagnostic
fait à partir des photos du client : il n'a aucune valeur officielle, et un
client qui l'aurait présenté à un contrôle routier se serait senti trompé.
C'est devenu un « compte rendu imprimable, à montrer au garage », qui le
dit clairement. Même correction dans l'encart de l'accueil.

### Demande : ce qui a changé à l'écran final

- La carte affichait « Technicien en route » avant même que la demande soit
  arrivée chez vous : remplacé par « Notre atelier ».
- Le délai affiché était « 30–45 min », contre « 30 à 60 min » partout
  ailleurs : aligné.
- Le bandeau « Technicien disponible » en haut du formulaire est une
  promesse, comme « un technicien décroche » : à garder seulement si c'est
  vrai à toute heure.
