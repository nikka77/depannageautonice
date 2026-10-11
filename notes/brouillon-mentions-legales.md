# Mentions légales et CGV : ce qu'il reste à remplir

Préparé le 11 octobre 2026. **Brouillon de travail, ce n'est pas un avis
juridique** : une relecture par votre comptable ou un juriste est conseillée.

## Comment ça marche sur le site

Toutes les informations légales sont dans **un seul fichier** :
`tools/entreprise.js`. Chaque ligne ne s'affiche sur le site **que si elle
est remplie** : rien de vide ni de « à compléter » n'apparaît en ligne.
Envoyez-moi les réponses ci-dessous, je remplis et je republie.

---

## 1. Les informations à me donner

| Information | Où la trouver | Exemple de format |
|---|---|---|
| Forme juridique | Extrait Kbis ou avis de situation INSEE | SASU, SARL, EURL, entreprise individuelle (micro-entrepreneur) |
| Raison sociale (si différente de « Dépannage Auto Nice ») | Kbis | DUPONT DÉPANNAGE |
| Capital social (sociétés seulement) | Kbis, statuts | 1 000 € |
| SIRET (14 chiffres) | annuaire-entreprises.data.gouv.fr | 123 456 789 00012 |
| RCS (société) ou Répertoire des métiers (artisan) | Kbis ou extrait D1 | RCS Nice / RM 06 |
| TVA : assujetti ou franchise ? | Votre comptable | FR12 123456789, ou « franchise » |
| Directeur de la publication | Vous | Prénom Nom, gérant |
| E-mail de contact | Voir A-COMPLETER.md, point 1 | contact@… |
| Adresse exacte de l'atelier (n°, code postal) | Vous | |
| Assureur responsabilité civile pro | Votre attestation d'assurance | Nom, adresse, zone couverte |
| Médiateur de la consommation | Voir § 2 | Nom, adresse, site |
| Durée de conservation des données | Voir § 3 | |

**TVA en franchise (art. 293 B du CGI)** : la mention « TVA non applicable,
art. 293 B du CGI » s'ajoute automatiquement aux mentions légales. Il faudra
aussi remplacer « TTC » par « net » sur les pages de prix et les factures :
je le fais dès que vous me le confirmez.

---

## 2. Médiateur de la consommation (obligatoire)

Tout professionnel qui vend à des particuliers doit adhérer à un médiateur
et l'indiquer sur son site et dans ses CGV (Code de la consommation,
art. L612-1 et L616-1). Sans médiateur, l'amende administrative peut
atteindre 3 000 € pour une personne physique et 15 000 € pour une société.

Pistes pour le dépannage-remorquage :

- **Médiateur de Mobilians** (ex-CNPA) : compétent pour le dépannage et
  remorquage (code G10 de sa charte), mais **réservé aux adhérents de
  Mobilians**. Si vous êtes adhérent, c'est le plus simple. Coordonnées
  selon l'INC : 43 bis route de Vaugirard, CS 80016, 92197 Meudon Cedex,
  01 40 99 55 00 — à vérifier sur leur site avant de les publier.
  ([charte du médiateur](https://www.mediateur-mobilians.fr/userfiles/files/Charte%20mediateur%20Mobilians%20modifiee_12072024.pdf),
  [fiche INC](https://www.inc-conso.fr/content/mediateur-de-mobilians-anciennement-conseil-national-des-professions-de-lautomobile-cnpa))
- **Médiateur de la FNA** : réservé lui aussi aux adhérents de la FNA.
- **Sinon, un médiateur généraliste** (adhésion payante, quelques dizaines
  d'euros par an) : choisissez-en un dans la liste officielle des
  médiateurs référencés par la CECMC, sur economie.gouv.fr (rubrique
  « médiation de la consommation »).

Une fois inscrit, envoyez-moi le nom, l'adresse et le site du médiateur.
Les CGV renverront alors vers lui (aujourd'hui elles disent que ses
coordonnées sont « communiquées sur simple demande »).

---

## 3. Durée de conservation des données : proposition à valider

Texte proposé pour `conservation` dans `tools/entreprise.js`. Adaptez-le à
votre pratique réelle avant validation :

> Les demandes qui n'aboutissent pas à une intervention sont supprimées au
> plus tard 3 ans après le dernier contact. Les données des clients
> (coordonnées, véhicule, lieu d'intervention) sont conservées pendant la
> relation commerciale puis 3 ans. Les factures sont conservées 10 ans,
> comme l'exige le Code de commerce (art. L123-22). Les photos et positions
> GPS envoyées pour une intervention sont supprimées une fois
> l'intervention facturée, sauf litige en cours.

Pourquoi ces durées : 3 ans après le dernier contact est la durée que la
CNIL recommande pour les prospects ; 10 ans est l'obligation légale pour
les pièces comptables.

---

## 4. Autres points des mentions et des CGV à confirmer

- **« Assurés pour les dommages causés au véhicule pendant l'intervention
  et le transport »** (CGV, § 10) : vérifiez que votre contrat couvre bien
  les véhicules confiés (garantie « véhicules confiés » ou « marchandises
  transportées »). Sinon, la phrase doit être retirée.
- **Frais d'annulation de 40 €** (CGV) : à confirmer.
- **Relecture des CGV** par un professionnel : conseillée, surtout la
  partie rétractation (prestation d'urgence exécutée à la demande du
  client).
