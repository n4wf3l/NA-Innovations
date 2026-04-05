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

## Zéro texte hardcodé — Vérification obligatoire

**CHAQUE fichier .tsx modifié ou créé DOIT être vérifié** pour du texte hardcodé non traduit. Aucun texte visible par l'utilisateur ne doit apparaître sans `t()` (frontend) ou `__()` (backend).

### Règles strictes :

1. **Tout texte entre `>` et `<`** dans du JSX DOIT passer par `{t('...')}` — pas d'exception.
2. **Les labels, placeholders, titres, descriptions, messages d'erreur, boutons** — tout via `t()`.
3. **Les données de la DB** (titres de services, descriptions, noms de features) — traduire côté backend avec `__()` avant d'envoyer à Inertia, OU wrapper avec `t()` côté frontend.
4. **Les suffixes** (`/year`, `per month`, `per additional language`) — via `t()`.
5. **Les messages flash Laravel** (`->with('success', '...')`) — via `__()`.

### Vérification automatique après chaque modification :

Après avoir modifié un fichier `.tsx`, **TOUJOURS** exécuter ce scan Node.js pour vérifier qu'il ne reste aucun texte hardcodé :

```bash
node -e "
const code = require('fs').readFileSync('CHEMIN_DU_FICHIER.tsx','utf8');
const lines = code.split('\n');
const issues = [];
lines.forEach((line, i) => {
    if (line.match(/import |const |return |function |interface |\/\/|type |export |let |var |if \(|else|} |{$|^\s*$/)) return;
    const textMatches = line.matchAll(/>([^{<]+)</g);
    for (const m of textMatches) {
        const text = m[1].trim();
        if (text && text.length > 3 && /[A-Za-z]{3,}/.test(text) && !text.startsWith('•')) {
            issues.push((i+1) + ': ' + text);
        }
    }
});
if (issues.length === 0) console.log('CLEAN');
else { console.log('HARDCODED TEXT FOUND:'); issues.forEach(i => console.log('  ' + i)); }
"
```

Si le résultat n'est pas `CLEAN`, corriger AVANT de dire que le travail est terminé.

### JSON array fields — Double-encode interdit

Quand on stocke un array dans un champ casté `'array'` en Laravel, **NE JAMAIS utiliser `json_encode()` dans le seeder ou le controller**. Le cast s'en charge automatiquement.

- **INTERDIT** : `'features' => json_encode(['GPS', 'Chat'])` → double-encode, le frontend reçoit un string au lieu d'un array
- **CORRECT** : `'features' => ['GPS', 'Chat']` → Laravel sérialise automatiquement via le cast

Côté frontend, **TOUJOURS** utiliser un safe parse pour les champs JSON provenant de la DB :

```tsx
// INTERDIT :
const features = product.features || [];

// CORRECT :
const features = Array.isArray(product.features)
    ? product.features
    : (typeof product.features === 'string'
        ? (() => { try { return JSON.parse(product.features); } catch { return []; } })()
        : []);
```

Cela s'applique à : `features`, `tech_stack`, `tags`, `available_variables`, `metadata`, et tout champ casté `'array'`.

### Tailwind — Classes invalides à ne JAMAIS utiliser :

- `w-4.5`, `h-4.5` → utiliser `w-[18px] h-[18px]`
- `duration-400` → utiliser `duration-500` (Tailwind ne supporte pas 400)
- `bg-white` sans `dark:bg-gray-800` → toujours ajouter la variante dark mode
- `text-gray-700` sans `dark:text-gray-300` → toujours ajouter la variante dark mode
- `border-gray-200` sans `dark:border-gray-700` → toujours ajouter la variante dark mode

## Géo-restriction — Simulateur de prix

Le simulateur de prix (`/contact#simulator`) est **réservé aux visiteurs européens**. Le hook `useIsEurope()` (dans `resources/js/hooks/useIsEurope.ts`) détecte la timezone du navigateur.

- **Si timezone Europe/** → le simulateur et ses boutons/liens sont visibles
- **Si hors Europe** → le simulateur, son onglet, et TOUS les boutons/liens qui y mènent sont **masqués** (`{isEurope && (...)}`)
- Le tab par défaut sur `/contact` est **"Demander un devis"** (pas le simulateur)
- Si un nouveau lien vers le simulateur est ajouté, il DOIT être wrappé avec `{isEurope && (...)}`
