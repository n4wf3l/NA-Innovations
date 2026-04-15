# NA Innovations — Plateforme SaaS

Plateforme tout-en-un pour agences de développement et freelances : gestion de projets, facturation, portails clients/partenaires/développeurs, site vitrine public avec blog et simulateur de prix, multi-tenant, multilingue (FR/NL/EN), PWA, installable.

---

## Table des matières

1. [Portail administrateur](#portail-administrateur)
2. [Portail client](#portail-client)
3. [Portail partenaire affilié](#portail-partenaire-affilié)
4. [Portail développeur](#portail-développeur)
5. [Site public & marketing](#site-public--marketing)
6. [Composants réutilisables & UI kit](#composants-réutilisables--ui-kit)
7. [Intégrations](#intégrations)
8. [Socle technique](#socle-technique)
9. [Multi-tenant](#multi-tenant)
10. [Sécurité & conformité](#sécurité--conformité)
11. [Design & UX](#design--ux)
12. [Exports, backups & analytics](#exports-backups--analytics)
13. [Automation & règles métier](#automation--règles-métier)

---

## Portail administrateur

### Pilotage commercial
- **Dashboard** — KPIs consolidés (CA du mois, factures en retard, leads chauds, alertes services), activité récente.
- **TopBar d'activité** — graphique temps réel de l'activité système (modes horaire / journalier / mensuel).
- **Clients** — CRUD, historique projets, vue financière, notes internes, documents joints, timeline d'événements.
- **Leads** — pipeline visuel **Kanban drag-drop** (nouveau → contacté → brief → devis → gagné/perdu), conversion automatique en client, source de provenance, enrichissement progressif.
- **Revenue** — reporting financier + **graphiques** (comparaisons mensuelles, top clients, répartition par type de projet).
- **Calendar** — événements projet, deadlines, factures échues, paiements de commissions à venir.

### Facturation, devis, paiements
- **Devis** — wizard 3 étapes, génération PDF, envoi email, lien public token-based (acceptation sans compte via URL signée), conversion automatique en facture.
- **Factures** — wizard 3 étapes, PDF, relances auto (J-7, J-3, J-1, jour J, +1sem, +2sem), suivi statuts (envoyée, vue, payée, en retard, partiel), avoirs / notes de crédit, numérotation configurable.
- **Paiements** — enregistrement par méthode (virement, cash, Stripe, autre), rapprochement partiel.
- **Services récurrents** — abonnements externes revendus (hébergement, domaines, SaaS tiers), renouvellement auto, alertes tiered (J-30, J-15, J-7, J-1), suspension auto à expiration + 14 jours.
- **Commissions partenaires** — tracking, statuts (pending / confirmée / programmée / payée), dates de paiement.
- **Budget projet** — lignes budgétaires prévisionnelles vs réel, détail de rentabilité par projet.
- **Payouts développeur** — versements aux devs, approbation admin.

### Gestion projet
- **Projets** — cycle de vie complet (planning → en cours → review → terminé / en pause / annulé), phases, milestones, budget vs réel, heures estimées vs consignées.
- **Intégration GitHub** — liaison repo par projet, affichage commits, option commits visibles au client, détection d'inactivité (>3 jours → notification), OAuth login pour dev.
- **Timeline morphable** — audit visuel par projet (emails envoyés, statut changé, devis accepté, paiement reçu…).
- **Documents morphables** — attachables à n'importe quelle entité, upload PDF/images, visibilité client togglable, signatures électroniques.
- **Briefs client** — soumission structurée, révisions, validation admin.
- **Co-propriété de projet** — pivot `projet_admins`, plusieurs admins owners, badge « projet partagé ».
- **Messagerie projet** — échanges admin/dev/client par projet (DevMessages).
- **Time entries** — consignation du temps par dev, **workflow d'approbation admin** avant facturation.
- **Milestones** — jalons de livraison ordonnés, next milestone visible client.

### Équipe
- **Team management** — rôles (admin, dev, partenaire, client), approbation des inscriptions pending, activation/désactivation, **envoi d'identifiants par email 1-clic**, taux horaire par dev, liste des clients.
- **Audit log** — traçabilité complète (qui, quoi, quand, IP, user-agent) sur toute action.
- **Approbation accès Knowledge Base** partenaires avec validation NDA électronique.

### Site & contenu (CMS)
- **Pages CMS** — création de pages publiques custom, slug, SEO, visibilité.
- **Landing sections** — éditeur modulaire avec **drag-reorder** des sections homepage.
- **Blog / Posts** — rédaction, publication, catégories, tags, SEO par article.
- **Portfolio** — projets réalisés avec galeries d'images multiples, stack technique, **embed YouTube**.
- **Produits / catalogue services** — gestion, pricing, features.
- **Testimonials** — modération des témoignages clients, affichage configurable sur landing.
- **FAQ publique** + **FAQ partenaires** (séparées, catégories, drag-reorder).

### Paramètres (6 groupes)

**Gestion admin** (tabs unifiés)
- **Emails transactionnels** — 20+ templates éditables en WYSIWYG, placeholders dynamiques, versions FR/NL/EN par template.
- **Brochure commerciale** — upload PDF, téléchargeable depuis contact public.
- **Modèles de documents** — NDA, contrat, PV de réception, spec technique, CGV — éditables, catégories (juridique/projet/livraison), aperçu PDF live, tabs.
- **Envoi de CV** — module dédié pour envoyer le CV d'un dev à un prospect.

**Gestion partenaires** (tabs)
- Taux de commission (par défaut / par partenaire / par type de projet).
- Templates de prospection.
- FAQ partenaires.

**Gestion développeur** (tabs)
- Configuration du portail dev (toggle features, affichage taux horaire, approbation temps requise).

**Settings transverses**
- **Branding** — logo, couleurs d'accent, nom société, TVA, adresse, OG images — appliqué au site, emails, PDF.
- **Signature email** — signature HTML personnalisée avec logo, appliquée aux envois.
- **NDA settings** — mode PDF uploadé OU texte édité en WYSIWYG.
- **SEO** — meta, Open Graph, keywords par page.
- **Chatbot** — config Gemini/OpenAI, **upload de PDFs de base de connaissance**, check de disponibilité API.
- **Sidebar personnalisable** — drag-and-drop de l'ordre, masquage, **4 styles** visuels, **couleurs d'accent** personnalisables **par admin**.

### Simulator admin
- **Admin/Simulator** — visualisation des simulations de prix soumises par les visiteurs du site public (historique, conversion).

---

## Portail client

- **Dashboard** — projets en cours, actions requises (signatures, briefs à compléter), échéances.
- **Projets** — vue détaillée, commits GitHub (si autorisés), URL preview/staging, liens utiles, documents partagés, phase courante, next milestone.
- **Devis** — consultation, **acceptation avec signature électronique** via SignaturePad.
- **Factures** — consultation, téléchargement PDF, historique paiements.
- **Documents** — téléchargement des docs partagés.
- **Purchase Orders** — soumission et suivi.
- **Support** — tickets d'assistance avec historique.
- **Profil** — update infos, préférences notifications.

---

## Portail partenaire affilié

- **Dashboard personnalisable drag-drop** — tiles réorganisables (persistance localStorage), leads convertis, commissions gagnées, métriques mensuelles, pipeline.
- **Montants protégés** — composant `ProtectedAmount` masque les commissions par défaut (toggle œil), déverrouillage par **PIN financier** avec compte à rebours.
- **Gestion des leads** — soumission nouveau lead avec brief, suivi statut, notification à la conversion.
- **Prospecting** — templates d'emails à envoyer aux prospects.
- **Prospects** — **Kanban drag-drop privé** (colonnes persistées par partenaire), rappels de relance.
- **Commissions** — historique par projet, statuts, date de paiement prévue.
- **Reminders** — rappels auto (emails + in-app, toutes les 15 min via cron).
- **Knowledge Base** — accès après signature d'un NDA électronique intégré à l'interface.
- **Guide & Help** — onboarding step-by-step, documentation.

---

## Portail développeur

- **Dashboard** — projets actifs/en attente/terminés, alertes GitHub inactivity, tendance de complétion 6 mois, taux horaire perso.
- **Projets disponibles** — browse + **claim** des projets pending.
- **Earnings** — revenus mensuels, historique 6 mois, paiements en attente d'approbation.
- **Profil** — skills, spécialités, taux horaire, token GitHub, photo.
- **Time entries** — consignation du temps par projet, workflow d'approbation admin, statut pending/approved/rejected.
- **Team** — membres de l'équipe et projets partagés.

---

## Site public & marketing

- **Landing page** — sections personnalisables depuis admin (hero, stats, features, témoignages, CTA).
- **Pricing** — grille tarifaire éditable.
- **Services** — catalogue (icônes + descriptions).
- **Portfolio** — cas clients avec galeries + vidéos YouTube embed.
- **About** — mission, valeurs, équipe.
- **Blog** — articles, catégories, tags, SEO, pagination.
- **Contact** — double mode :
  - **Demande de devis classique** avec captcha Turnstile + **upload de pièces jointes**.
  - **Simulateur de prix interactif** (géo-restreint Europe via détection timezone) — choix type, features, design, maintenance, délai → estimation temps réel, compteur animé, **auto-scroll vers la section suivante** après choix initial (avec respect de `prefers-reduced-motion`).
- **Chatbot IA flottant** — Gemini/OpenAI + base de connaissance PDF.
- **Bouton WhatsApp flottant** — contact direct.
- **Cookie banner** (si activé dans paramètres).
- **PWA installable** — prompt d'installation sur desktop/mobile, détection de mode offline.
- **SEO avancé** — hrefLang multi-lingue, canonical URLs, Open Graph, Twitter Cards, preconnect Google Fonts, `loading="lazy"` sur images.

---

## Composants réutilisables & UI kit

- **RichTextEditor** — éditeur WYSIWYG pour templates emails, documents, NDA, landing sections.
- **SignaturePad** — signature électronique pour devis/documents légaux.
- **KanbanBoard** — drag-drop natif pour leads et prospects.
- **DataTable** — table triable avec pagination, recherche.
- **SearchableSelect** — dropdown avec recherche, auto-complétion.
- **ProtectedAmount** — masquage de montants sensibles (style carte bancaire masquée).
- **PinUnlockButton** — déverrouillage avec PIN + timer.
- **Skeleton loaders** — placeholders de chargement pour toutes les vues listantes.
- **ModuleBanner** — bandeau de section avec breadcrumb.
- **LoginSplash** — écran de splash animé au login avec branding.
- **GuidedTour** — tours interactifs configurables (onboarding admin, partner, dev).
- **OriginalLanguageBadge** — indique la langue originale d'un contenu traduit.
- **Tooltips custom** — positionnement auto avec flèche.
- **Confirm dialogs** — via hook `useConfirm`, modaux portal'd avec variants (default, danger).
- **Toast notifications** — messages flash Laravel affichés en top-right.
- **Mobile menu** — burger responsive.
- **PWA InstallPrompt** — détection et invitation à installer la PWA.

---

## Intégrations

- **GitHub OAuth** + liaison repo + commits API (cache 15min).
- **DomPDF** — génération PDF native.
- **Laravel Sanctum** — API tokens.
- **Mailer SMTP** — support Postmark / Resend / SES / Mailprotect / tout SMTP.
- **Cloudflare Turnstile** — bot protection.
- **i18next** — FR / EN / NL côté front.
- **Gemini / OpenAI API** — chatbot IA.
- **YouTube Embed API** — vidéos portfolio.

---

## Socle technique

- **Backend** : Laravel 10 + PHP 8.
- **Frontend** : React 18 + TypeScript + Inertia.js + Tailwind CSS.
- **DB** : MySQL.
- **Build** : Vite (HMR en dev).
- **PWA** : manifest + service worker.
- **Queue** : sync / database.
- **Cache** : `Cache::remember` sur endpoints coûteux (commits GitHub, count équipe, etc.).

**Transverse** :
- **Soft deletes** sur 36+ modèles.
- **Activity log** exhaustif.
- **Documents & notes morphables** — attachables partout.
- **Timeline d'événements morphable** — historique par entité.
- **Emails envoyés morphables** — audit complet des communications.
- **Lazy loading** images natif.

**Cron scheduled** :
- 07h00 → renouvellement auto services récurrents
- 07h30 → notifications d'expiration tiered (J-30/J-15/J-7/J-1)
- 08h00 → marquage factures en retard
- 08h30 → relances prospects partenaires
- 09h00 → relances factures en retard + check inactivité GitHub
- 09h30 → rappels avant échéance (J-7/J-3/J-1)
- */15min → reminders partenaires

---

## Multi-tenant

- **Isolation stricte** — admin A ne voit jamais les données d'admin B (10+ modèles critiques scopés).
- **Global scopes Eloquent** — sécurité par défaut : impossible d'oublier un filtre.
- **Co-propriété de projet** — pivot `projet_admins`, projet partageable entre admins.
- **Bypass explicite** pour opérations système (crons, super-admin, co-owner picker).
- **Middleware `ResolveAdminTenant`** — contexte auto à chaque requête `/admin/*`.

---

## Sécurité & conformité

- **2FA TOTP** — Google Authenticator, QR SVG généré sans service externe, codes de récupération chiffrés.
- **PIN financier** — déverrouillage ponctuel pour afficher commissions/montants sensibles, timer.
- **Chiffrement en base** :
  - Credentials projets (user, password, URL admin)
  - Variables `.env` des projets livrés
  - Tokens GitHub
  - Secrets 2FA + codes de récupération
- **Rôles** : admin / développeur / client / referral_partner.
- **CSRF** Laravel natif.
- **Password reset** — flow complet (email + token signed).
- **Security headers middleware** — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- **Cloudflare Turnstile** sur formulaires publics.
- **RGPD-ready** — soft deletes, activity log, locales par user.
- **Documents légaux** — NDA, contrat, CGV, PV, spec technique configurables, signature électronique, export PDF.
- **Sanitization** — strip_tags sur toute entrée utilisateur publique.

---

## Design & UX

- **Dark mode complet** (class strategy) — sur 100 % des vues admin + publiques.
- **Animations custom** :
  - `animate-page-in` — transition douce à chaque navigation Inertia
  - `animate-fade-in` — backdrops modaux
  - `animate-modal` — ouverture de modaux
  - `animate-slide-up` — toasts
  - `animate-scale-in` — menus déroulants
- **Respect `prefers-reduced-motion`** — auto-scroll simulator désactivé si activé côté user.
- **Custom scrollbars** (`custom-scroll`) — UI léger, thin, coloré en thème.
- **Gradients modernes** — bannières de section avec blur effects.
- **Responsive mobile-first** — tous les portails utilisables sur smartphone.
- **Typographie soignée** — font custom Bebas pour titres, Inter pour body.
- **Breadcrumbs contextuels** via ModuleBanner.
- **Loading states** partout (skeletons + spinners).
- **Accordions** (ex : modèles de documents par catégorie).
- **Empty states** illustrés avec CTA.

---

## Exports, backups & analytics

- **Export CSV** — factures, leads, commissions, par plage de dates.
- **Export PDF** — factures, devis, documents légaux, PV de réception, brochure.
- **Database snapshot / restore** — `SnapshotSeeder` sérialise toute la BDD en JSON (incluant assets storage/) → restauration one-shot (utile pour migrations inter-environnements, sinistres, démos).
- **Notification polling** — endpoint léger pour notifications temps-réel in-app.
- **Log d'emails envoyés** (`SentEmail`) — morphable, audit complet par entité (projet, client, lead, facture).

---

## Automation & règles métier

- **AutomationRule** — moteur de règles (modèle en place, extensible).
- **Workflows automatiques** :
  - Quote accepted → création invoice + notification admin.
  - Quote rejected → notification admin.
  - Invoice paid → commission du partenaire passe en « scheduled ».
  - Service expiré → projet mis en pause automatiquement après 14 j.
  - Lead converti → notification au partenaire référent.
- **NotificationService** — système unifié (email + in-app), transactionnel ou marketing, respectant les préférences utilisateur.

---

## Chiffres-clés

- **80+ migrations**, 36+ tables soft-deletable.
- **30+ modèles Eloquent** avec relations morph / belongsToMany / hasManyThrough.
- **3 langues** (FR/NL/EN), 500+ clés de traduction.
- **10+ seeders** (pages, FAQs, testimonials, services publics, produits, templates, landing, portfolio, articles, snapshot).
- **80+ routes admin** + 4 portails (client, partenaire, dev, public).
- **4 types de comptes** (admin, dev, partenaire affilié, client).
- **20+ templates emails** locale-aware.
- **5 templates de documents légaux** éditables.
- **7 tâches cron** automatisées.
- **2FA + PIN financier + chiffrement** de toutes les données sensibles.
- **PWA installable** avec offline détection.

---

*Document généré au stade actuel du développement. À mettre à jour au fil des itérations.*
