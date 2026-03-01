# FishEye - Projet 6 OpenClassrooms

Site web accessible pour une plateforme de photographes.
Ce projet met l'accent sur l'accessibilité (clavier, focus, ARIA) et l'architecture JavaScript côté front.

## Contexte

Ce dépôt correspond au **Projet 6 du parcours Front-end OpenClassrooms** :
développer un site de photographes en respectant les bonnes pratiques d'accessibilité.

Le site contient :

- une page d'accueil listant les photographes,
- une page profil photographe avec galerie média,
- des interactions accessibles (likes, lightbox, modale de contact).

## Fonctionnalités principales

### Page d'accueil (`index.html`)

- Affichage dynamique des photographes depuis `data/photographers.json`.
- Cartes cliquables vers `photographer.html?id=<id>`.
- Liens avec libellés accessibles (`aria-label`).

### Page photographe (`photographer.html`)

- Affichage du profil (nom, localisation, tagline, portrait).
- Galerie média (photos/vidéos) générée via une factory.
- Tri des médias : popularité, date, titre.
- Likes interactifs (1 like max par média par chargement).
- Footer dynamique (total des likes + tarif journalier).

### Lightbox

- Ouverture depuis les médias (clic + clavier).
- Navigation avec boutons et clavier (`ArrowLeft` / `ArrowRight`).
- Fermeture via bouton ou touche `Escape`.
- Gestion du focus pour éviter de laisser le focus dans un contenu masqué.

### Modale de contact

- Ouverture depuis le bouton "Contactez-moi".
- Fermeture via la croix, clic extérieur ou `Escape`.
- Focus trap dans la modale.
- Restauration du focus sur l'élément déclencheur à la fermeture.

## Accessibilité

Le projet inclut les fondamentaux suivants :

- Navigation clavier sur les éléments interactifs (`Tab`, `Enter`, `Space`).
- Boutons natifs pour actions interactives (médias, likes).
- `aria-label` sur les contrôles importants.
- `aria-pressed` pour les boutons de like.
- `role="dialog"` / `aria-modal` sur les overlays.
- Focus trap dans la modale de contact.
- Focus management sur la lightbox (ouverture/fermeture).
- Styles de focus visibles (`:focus-visible`).

## Technologies

- HTML5
- CSS3
- JavaScript ES Modules (vanilla JS)
- Fetch API (données JSON locales)
- ESLint

## Lancer le projet en local

## Prérequis (pour le lint uniquement)

- Node.js + npm (optionnel si vous ne lancez pas ESLint)

### Option 1 - Live Server (VS Code)

1. Ouvrir le dossier dans VS Code.
2. Clic droit sur `index.html` > **Open with Live Server**.
3. Ouvrir l'URL fournie par Live Server.

### Option 2 - Serveur Python

```bash
python -m http.server 5173
```

Puis ouvrir :
`http://localhost:5173/`

## Lint

```bash
npm install
npm run lint
```

## Structure rapide

```text
data/                  # Données locales JSON
scripts/pages/         # Logique des pages (index, photographer)
scripts/factories/     # Factories (photographe, média)
scripts/utils/         # Utilitaires (lightbox, modale contact, etc.)
css/                   # Styles globaux
assets/                # Images, vidéos, icônes
```

## Démo clavier (rapide)

- `Tab` sur un photographe dans l'index, puis `Enter` pour ouvrir sa page.
- `Tab` sur un média, puis `Enter` pour ouvrir la lightbox.
- `ArrowRight` / `ArrowLeft` dans la lightbox pour naviguer.
- `Escape` pour fermer la lightbox.
- `Tab` dans la modale de contact : le focus reste piégé dans la modale.
- `Escape` ou `X` pour fermer la modale et revenir au bouton ouvreur.

## Notes

- Les likes ne sont **pas persistés** après refresh.
- Les données proviennent d'un fichier local : `data/photographers.json`.
- Le projet est front-end uniquement (pas de backend).
