# Règles du projet NA Innovations

## Langue française — UTF-8 obligatoire

Tous les textes en français dans le code doivent utiliser les vrais caractères accentués UTF-8 (`é`, `è`, `ê`, `à`, `ç`, `ô`, `û`, `î`, `ù`, `â`, `ë`, `ï`).

- **INTERDIT** : `Donnees financieres`, `Deverrouillez`, `superieure`, `budgetaires`
- **CORRECT** : `Données financières`, `Déverrouillez`, `supérieure`, `budgétaires`
- **INTERDIT** : `&eacute;`, `&agrave;`, `&ccedil;` (entités HTML dans du texte)
- **CORRECT** : `é`, `à`, `ç` (caractères UTF-8 directs)

Cette règle s'applique à TOUS les fichiers sans exception : `.php`, `.tsx`, `.ts`, `.json`, seeders, migrations, controllers, composants React, templates, messages flash, placeholders, labels, titres, descriptions, commentaires utilisateur-visible.

## Stack technique

- Backend : Laravel 10 + PHP
- Frontend : React 18 + TypeScript + Inertia.js
- Style : Tailwind CSS avec dark mode (class strategy)
- i18n : i18next (FR, EN, NL)
- PDF : Barryvdh DomPDF
- Pas de Spatie Permission (le champ `role` string sur User est utilisé directement)

## Conventions de code

- Composants React : `bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm`
- Modals : utiliser `createPortal(...)` vers `document.body`
- Montants : toujours utiliser `formatCurrency()` de `@/lib/utils`
- Traductions : toujours utiliser `useTranslation()` de react-i18next
- Controllers admin : étendre `BaseAdminController`
- Pas d'installation de packages externes sauf demande explicite
