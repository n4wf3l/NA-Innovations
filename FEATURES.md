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
14. [Production-readiness / DevOps](#production-readiness--devops)

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

## Production-readiness / DevOps

Cette section distingue ce qui est **déjà en place** (✓), **prêt à brancher** (→), et **à industrialiser avant une mise en prod sérieuse** (⚠). Transparence totale pour éviter les mauvaises surprises.

### Tests automatisés

- ✓ **81 tests PHPUnit** (Feature + Unit) couvrant : auth, 2FA, password reset/update, email verification, registration, profile, admin access, client portal, dashboard, invoices, quotes, workflow (devis → facture → commission), search, cron jobs.
- ✓ **Isolation stricte** — `phpunit.xml` pointe sur SQLite :memory:, impossible qu'un test touche la BDD de dev/prod.
- ✓ **Seeders de fixtures** pour recréer un état reproductible à chaque run.
- → **CI automatisée** à brancher en 1h : GitHub Actions / GitLab CI avec job `php artisan test` + `npm run build`. Template minimal prêt à copier dans `.github/workflows/ci.yml`.

### Gestion des erreurs

- ✓ **Handler d'exceptions custom** (`app/Exceptions/Handler.php`) avec pages Inertia brandées pour **404, 403, 419, 429, 500, 503** (plus de pages blanches Laravel par défaut).
- ✓ **Response adaptée** selon le type : JSON pour les requêtes `/api/*`, pages React sinon.
- ✓ **Données sensibles masquées** dans les flash d'erreur (`password`, `current_password`, `password_confirmation`, `financial_pin`) — pas de leak dans les logs.
- ✓ **Graceful degradation** — `LogActivity` wrappé dans try/catch pour ne jamais casser la requête si le logger échoue, `Password::sendResetLink` dans try/catch, etc.

### Monitoring, logs & alerting

- ✓ **Logs Laravel** — stack/single driver, rotation native configurable via `config/logging.php` (daily, size-based).
- ✓ **Activity log applicatif** — 100 % des actions admin tracées avec acteur, entité, IP, user-agent.
- → **Sentry / Bugsnag** — 1h d'intégration pour capture automatique des exceptions + stack traces + release tracking. Channel `sentry` à ajouter dans `config/logging.php`.
- → **Slack / Discord webhook** — alerting via le driver `slack` natif Laravel (déjà disponible) sur niveaux `error`/`critical`. Ajouter le webhook dans `.env`.
- → **Uptime monitoring** — UptimeRobot / Better Stack / Pingdom à pointer sur une route `/health` (à créer en 2 lignes).
- → **Log aggregation** — Papertrail / Loggly / Datadog si besoin de recherche cross-serveur.
- ⚠ **APM** (New Relic / Datadog) non installé — recommandé si trafic > 1000 req/min ou SLA signés.

### Déploiement & rollback

- ✓ **[DEPLOYMENT.md](DEPLOYMENT.md)** — checklist détaillée (cron, migrations, permissions, clés, assets).
- ✓ **Migrations réversibles** — tous les scripts ont une méthode `down()` fonctionnelle, donc `migrate:rollback` marche.
- ✓ **Manifest PWA** versionné — cache busting automatique à chaque build.
- ✓ **`php artisan optimize`** (route cache, config cache, view cache) supporté.
- → **Laravel Forge / Envoyer / Ploi** — hooks de déploiement zero-downtime (symlink swap) compatibles natif.
- → **Blue/green ou canary** — à configurer côté infra (Nginx upstream, load balancer), pas côté app.
- ⚠ **Rollback actuel** = `git revert` + `php artisan migrate:rollback` + `npm run build` en manuel. À scripter (`rollback.sh`) pour sécuriser les runs.
- ⚠ **Maintenance mode** — `php artisan down` disponible, mais pas de page de maintenance brandée (template à personnaliser).

### Backups & restauration

- ✓ **`SnapshotSeeder`** — export JSON complet de la BDD + tous les assets `storage/app/public/` dans `database/seeders/snapshot.json` + `database/seeders/assets/`. Restauration en 1 commande : `php artisan db:seed --class=SnapshotSeeder`.
- ✓ **Usage validé en conditions réelles** — utilisé avec succès lors d'une perte accidentelle de BDD dev (restauration complète en < 30 s).
- ✓ **Dump manuel possible** via `mysqldump` standard (MySQL natif).
- → **Backups cron vers S3 / Spaces / Backblaze** — script shell simple à scheduler (`mysqldump | gzip | aws s3 cp`), rétention 30/90/365j recommandée.
- → **Managed DB backups** — si tu passes par Digital Ocean Managed Database, AWS RDS, PlanetScale, Supabase, Neon… ils font les snapshots automatiques (PITR) pour toi sans code à écrire.
- ⚠ **Pas de backup automatique** actuellement. Avant production : scheduler un `mysqldump` quotidien vers un stockage externe (pas sur le même serveur).

### Plan de Disaster Recovery (DR)

Un vrai DR plan n'est pas encore documenté. Squelette à remplir avant de signer des SLA :

- ⚠ **RTO (Recovery Time Objective)** — à définir (ex : 4h).
- ⚠ **RPO (Recovery Point Objective)** — à définir (ex : perte max de 1h de données = backup horaire).
- ✓ **[INCIDENT_RUNBOOK.md](INCIDENT_RUNBOOK.md)** — runbook d'astreinte : classification de sévérité (SEV1/2/3), rôles pendant un incident, playbooks par scénario (site down, DB corrompue, fuite inter-tenant, credentials compromis, emails KO, cron mort, DomPDF, factures incohérentes, login, cache/queue, GitHub), restauration depuis backup (3 scénarios), communication clients (templates), template de postmortem, commandes rapides.
- ⚠ **Postmortems** — modèle de rapport post-incident (cause, impact, actions correctives).
- ⚠ **Contacts d'astreinte** — qui appeler à 3h du matin.
- ⚠ **Testing DR** — une restauration complète depuis backup à tester au moins 1× par trimestre.

### Environnements

- ✓ **`.env` séparé** par environnement (local / staging / production).
- ✓ **`APP_ENV` & `APP_DEBUG`** togglables (debug désactivé auto en prod bloque l'affichage de stack traces).
- ✓ **Secrets chiffrés** — tokens GitHub, credentials projets, env projets, secrets 2FA, PIN financier : tout est `encrypted` cast côté Eloquent, jamais en clair même en cas de dump BDD volé.
- → **Config secrets manager** — AWS Secrets Manager / Doppler / 1Password Secrets Automation recommandé au lieu de `.env` en clair sur le serveur.

### Performance

- ✓ **`Cache::remember`** sur endpoints coûteux (GitHub commits 15 min, counts équipe, etc.).
- ✓ **Lazy loading images** natif HTML.
- ✓ **Vite code splitting** côté front, chunks séparés.
- ✓ **Indexes DB** sur toutes les FK, colonnes de recherche (email, status, admin_id, projet_id).
- → **Redis / Memcached** — driver cache & session à switcher en prod (actuellement `file` / `database`).
- → **CDN** (Cloudflare / BunnyCDN) pour assets statiques.
- → **Queue worker** (Horizon si Redis) pour emails et jobs lourds — actuellement queue=sync en dev.

### Résumé production-readiness

| Domaine | État | Avant mise en prod |
|---|---|---|
| Tests automatisés | ✓ 81 tests | Brancher CI |
| Pages d'erreur | ✓ brandées | — |
| Logs | ✓ fichier | Brancher Sentry + Slack |
| Déploiement | ✓ checklist | Choisir Forge / Ploi / custom |
| Rollback | ✓ migrate:rollback | Scripter `rollback.sh` |
| Backups | ✓ snapshot manuel | Scheduler cron + S3 |
| DR plan | ✓ runbook | Définir RTO/RPO + contacts astreinte |
| Monitoring | ⚠ logs fichiers | Uptime + APM si SLA |
| Secrets | ✓ chiffrement DB | Manager secrets en prod |
| Performance | ✓ cache + indexes | Redis + CDN si charge |

---

*Document généré au stade actuel du développement. À mettre à jour au fil des itérations.*

---

# Session d'intégration — Avril 2026

Cette section documente le périmètre exact traité lors de la session d'audit et d'intégration : **ce qui est 100% opérationnel**, **ce qui est à moitié terminé / nécessite une action de ta part**, et **ce qui a été sciemment exclu**.

## Contexte

Audit complet de la plateforme contre 5 critères (couverture end-to-end, solidité quotidienne, cas casse-pieds, gains de temps réels, spécificités belges). Le diagnostic a identifié une plateforme à ~75% complète pour un usage interne, avec des manques clairs côté résilience (backups, monitoring), coût réel & rentabilité, et quelques cas métier non traités.

Objectif de la session : **combler les manques sauf paiement en ligne**, et uniquement avec des solutions **100% gratuites**.

---

## ✅ Intégré — totalement opérationnel

### 1. Coût dev réel

**Quoi** : chaque `TimeEntry` capture désormais le taux horaire du dev au moment de l'approbation (`hourly_rate_snapshot`), ce qui fige le coût même si le taux change plus tard.

**Impact** :
- Nouvelle carte "Coût dev réel" visible dans `/admin/timesheets` (euros, agrégé selon les filtres actifs).
- Ventilation `cost_by_project` et `cost_by_developer` exposée au frontend → directement exploitée par le dashboard rentabilité.
- Attribut calculé `cost` sur le model (`hours × hourly_rate_snapshot`).

**Fichiers** :
- Migration : `database/migrations/2026_04_15_120000_add_hourly_rate_snapshot_to_time_entries.php`
- Modèle : `app/Models/TimeEntry.php`
- Contrôleur : `app/Http/Controllers/Admin/TimeEntryController.php`
- UI : `resources/js/Pages/Admin/Timesheets/Index.tsx`

---

### 2. Rappel automatique dev qui n'encode pas son temps

**Quoi** : tâche planifiée quotidienne à **09:15 heure belge**. Détecte les devs ayant un projet actif (`in_progress` / `review`) mais qui n'ont rien encodé depuis **7 jours**. Crée une notification in-app.

**Anti-spam** : un seul rappel tous les 3 jours maximum par dev.

**Fichier** : `app/Console/Kernel.php`

---

### 3. Backups automatiques (spatie/laravel-backup)

**Quoi** : dump MySQL quotidien + archive du code (hors vendor/node_modules) vers le disque local.

**Plannings** :
- `backup:clean` — 02:30 — nettoie les vieux backups selon la rétention
- `backup:run` — 03:00 — crée le nouveau backup (testé : 39 KB DB-only → OK)
- `backup:monitor` — 10:00 — alerte si un backup manque

**Notification email** : en cas d'échec, envoi automatique à `BACKUP_NOTIFY_EMAIL` (à définir dans `.env`).

**Chiffrement optionnel** : variable `BACKUP_ARCHIVE_PASSWORD` dans `.env`.

**Point Windows résolu** : le binaire `mysqldump.exe` n'est pas dans le PATH par défaut. Ajouté `DB_DUMP_BIN_PATH` dans `config/database.php` + `.env` (avec forward slashes obligatoires sur Windows).

**Fichiers** :
- `config/backup.php`, `config/database.php` (bloc `dump`)
- `app/Console/Kernel.php`
- `.env` + `.env.example`

**Destination actuelle** : local (`storage/app/Laravel/`). Pour ajouter un upload distant (S3, B2, etc.), modifier `config/backup.php` → `backup.destination.disks`.

---

### 4. Commission blocking workflow

**Quoi** : nouveau statut `blocked` pour les commissions, avec audit trail (motif + qui + quand).

**Règles** :
- Une commission payée ne peut pas être bloquée.
- Une commission bloquée ne peut pas être payée tant qu'elle n'est pas débloquée.
- Le déblocage remet en statut `confirmed`.

**UI** : boutons **Bloquer** / **Débloquer** sur `/admin/commissions/{id}` + bannière orange affichant motif + auteur + date quand bloquée.

**Fichiers** :
- Migration : `2026_04_15_130000_add_blocking_to_commissions.php`
- Modèle : `app/Models/Commission.php`
- Contrôleur : `app/Http/Controllers/Admin/CommissionController.php`
- UI : `resources/js/Pages/Admin/Commissions/Show.tsx`
- Routes : `admin.commissions.block` / `admin.commissions.unblock`

---

### 5. Checklist livrables par projet

**Quoi** : système de checklist de livrables par projet, **activable individuellement par dev** depuis la page Team.

**Data model** :
- Table `project_deliverables` (title, description, is_completed, completed_by, sort_order, created_by)
- Flag `deliverables_checklist_enabled` sur `users` (default false) — exposé dans `auth.user`

**3 modes** (composant React unique `DeliverablesChecklist.tsx`) :
- `admin` — CRUD complet : ajouter, éditer, supprimer, cocher/décocher
- `dev` — read-only + cocher/décocher (si flag activé par l'admin)
- `dev-disabled` — affichage passif avec message "contactez un admin"

**Affichage** : progress bar automatique (x/y complétés, %) + audit (qui a complété quoi).

**Intégré sur** :
- Admin project show → section CRUD active
- Dev project show → vue respectant le flag utilisateur
- Admin team cards → switch teal/grey par dev

**Fichiers** :
- Migrations : `2026_04_15_140000_*`, `2026_04_15_140001_*`
- Modèles : `app/Models/ProjectDeliverable.php`, relation `Projet::deliverables()`
- Contrôleurs : `app/Http/Controllers/Admin/ProjectDeliverableController.php`, méthode `TeamController::toggleDeliverablesChecklist()`
- UI : `resources/js/Components/project/DeliverablesChecklist.tsx`
- Routes : `admin.deliverables.*`, `dev.deliverables.toggle`, `admin.team.deliverables-checklist`

---

### 6. Versioning devis (scope change / amendement)

**Quoi** : un devis peut avoir des versions successives liées via `parent_quote_id`. Quand le scope change, l'admin clique "Amender", fournit un motif, et obtient un nouveau devis draft (même items, même client) avec `version = N+1`.

**Automation** : quand une nouvelle version est acceptée, les anciennes versions (statut `sent`, `viewed`, `accepted`) sont automatiquement marquées `superseded`.

**UI** :
- Bouton orange **Amender** sur les devis non-draft.
- Bande "Historique des versions" (v1 → v2 → v3) en haut du devis, avec badge de statut par version.
- Motif d'amendement affiché sous forme d'alerte.

**Fichiers** :
- Migration : `2026_04_15_150000_add_versioning_to_quotes.php`
- Modèle : `app/Models/Quote.php` (relations `parentQuote`, `childVersions`, helpers `rootQuote()`, `allVersions()`)
- Service : `app/Services/QuoteService.php` → `amend()`
- Contrôleur : `app/Http/Controllers/Admin/QuoteController.php` → `amend()` + modification de `accept()`
- UI : `resources/js/Pages/Admin/Quotes/Show.tsx`
- Route : `admin.quotes.amend`

---

### 7. Re-signature de document avec historique

**Quoi** : possibilité de révoquer les signatures d'un `ProjectDocument` et de repartir à zéro, en conservant l'historique complet.

**Flow** :
1. Admin clique "Demander re-signature" → saisit un motif.
2. Les signatures actuelles (admin + client) sont archivées dans `document_signature_history` avec `revoked_at` + `revoked_by` + `revocation_reason`.
3. Les champs de signature du document sont remis à null, statut repasse à `draft`, PDF effacé.
4. Chaque nouvelle signature (admin ou client) crée un row `document_signature_history` (non révoqué).

**UI** :
- Bouton orange **Demander re-signature** sur chaque document signé.
- Section "Historique des signatures révoquées" avec : rôle, signataire, date signature, date révocation, qui a révoqué, motif.

**Fichiers** :
- Migration : `2026_04_15_160000_create_document_signature_history_table.php`
- Modèles : `app/Models/DocumentSignatureHistory.php`, relation `ProjectDocument::signatureHistory()`
- Contrôleurs : `Admin/ProjectDocumentController::requestResign()` + modification de `adminSign()` et `Client\DocumentController::sign()` pour écrire dans l'historique
- UI : `resources/js/Pages/Admin/Projects/DocumentsSections/DocumentCard.tsx`
- Route : `admin.projects.documents.request-resign`

---

### 8. Dashboard rentabilité — `/admin/profitability`

**Quoi** : page admin dédiée qui agrège toute la donnée financière en une vue claire.

**Hero** : vue globale (revenus encaissés / coût dev / commissions / marge nette € et %).

**4 onglets filtrables avec recherche live** :

| Onglet | Colonnes |
|---|---|
| **Projets** | Nom, client, dev, revenus, coût dev, commission, marge €, marge % |
| **Clients** | Nom, # projets, revenus totaux, coût dev, commission, marge, marge % |
| **Développeurs** | Nom, taux horaire, heures validées, coût total, revenus projets, contribution |
| **Partenaires** | Nom, revenus apportés, commission payée / pending / bloquée, marge nette, taux effectif |

**Formule marge** : `revenus encaissés − coût dev − commissions (hors bloquées)`.

**Sources des données** :
- Revenus = `Payment` confirmés via `Invoice.projet_id`
- Coût dev = `TimeEntry.hours × hourly_rate_snapshot` (entries approuvées uniquement)
- Commissions = statuts `paid` + `scheduled` + `confirmed` (pas `blocked`)

**Fichiers** :
- Contrôleur : `app/Http/Controllers/Admin/ProfitabilityController.php`
- UI : `resources/js/Pages/Admin/Profitability/Index.tsx`
- Entrée sidebar ajoutée (section Finance)
- Route : `admin.profitability`

---

### 9. WhatsApp — approche simple (sans API)

**Quoi** : composant React `WhatsAppButton` qui ouvre `https://wa.me/<phone>?text=<message>` dans un nouvel onglet. L'admin tape ensuite "envoyer" manuellement dans WhatsApp.

**Zéro setup, zéro coût, zéro compte business** — juste un lien deep link.

**Features du composant** :
- Auto-normalise les numéros belges : `+32 490 22 19 12` / `0490221912` / `32490221912` → tous fonctionnels.
- Préfixe BE (`+32`) ajouté automatiquement si le numéro commence par `0`.
- Message pré-rempli personnalisable (prénom injecté via `{{name}}`).

**Intégré sur les 3 pages les plus utiles** :
- Admin → Leads → Show (à côté du téléphone)
- Admin → Partners → Show
- Admin → Clients → Show

**Réutilisable ailleurs** :
```tsx
<WhatsAppButton phone={user.phone} message="Ton message" />
```

**Fichier** : `resources/js/Components/ui/WhatsAppButton.tsx`

---

### 10. Traductions

**100 nouvelles clés** ajoutées en FR/EN/NL pour l'ensemble du travail ci-dessus.

---

### 11. Runbook d'incident

**Quoi** : procédure écrite à suivre en cas d'incident production (corruption DB, serveur down, fuite inter-tenant, credentials compromis, emails KO, cron mort, etc.).

**Contenu** :
- Classification de sévérité SEV1 / SEV2 / SEV3 avec délais d'intervention.
- Rôles pendant incident : Incident Commander / Tech Lead / Communicator.
- Premiers réflexes (5 min) et grille d'action avant toute manipulation.
- **11 playbooks** couvrant les scénarios réels les plus probables sur la plateforme.
- 3 scénarios de restauration depuis backup (SnapshotSeeder / mysqldump / PITR managed DB).
- Templates de communication clients pendant + après incident.
- Template de postmortem blameless.
- Commandes rapides de diagnostic (Laravel, DB, multi-tenant, git).

**Fichier** : [INCIDENT_RUNBOOK.md](INCIDENT_RUNBOOK.md)

**À compléter** : contacts d'astreinte (téléphones, SLA hébergeur / registrar / SMTP) — à remplir avant mise en prod.

---

## ⚠️ À moitié — nécessite une action de ta part

### Sentry (error monitoring)

**Statut** : code branché, **DSN à renseigner**.

**Ce qui est fait** :
- Package `sentry/sentry-laravel` installé.
- Exception handler relié (`app/Exceptions/Handler.php`) — capture automatique de toutes les exceptions non gérées.
- `config/sentry.php` publié.
- `.env.example` enrichi : `SENTRY_LARAVEL_DSN=`, `SENTRY_TRACES_SAMPLE_RATE=0.0`.
- **No-op gracieux** si DSN vide → ne plante pas en prod si tu oublies.

**À faire** (2 minutes, 100% gratuit — 5000 erreurs/mois) :
1. Créer un compte sur [sentry.io](https://sentry.io) (gratuit).
2. Créer un projet type Laravel.
3. Copier le DSN (format `https://xxx@yyy.ingest.sentry.io/zzz`).
4. Dans `.env` : `SENTRY_LARAVEL_DSN=<ton DSN>`
5. `php artisan config:clear`

---

### Cron serveur

**À vérifier en prod** que `php artisan schedule:run` est déclenché chaque minute par le cron système. Sinon toutes les tâches planifiées (backups, reminders, GitHub inactivity, dev time reminder) sont mortes.

Ligne à ajouter dans le crontab :
```
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

---

### Email notifs backup

Renseigner `BACKUP_NOTIFY_EMAIL` dans `.env` pour recevoir les alertes d'échec.

---

## ❌ Skippé exprès — non intégré volontairement

### Paiement en ligne (Stripe / Mollie)

**Pourquoi skippé** : décision explicite de l'utilisateur ("SAUF paiement en ligne").

**État actuel** : la plateforme conserve sa logique existante de tracking manuel des paiements (Payment model avec `method = bank_transfer / cash / paypal / stripe / card / other`). Le statut `stripe` existe dans l'enum mais **aucune intégration API** n'est branchée.

**Ce qui resterait à faire le jour où tu changes d'avis** :
- Compte Mollie (recommandé pour BE, plus simple que Stripe) ou Stripe.
- Webhook endpoint pour la confirmation de paiement.
- Génération de lien de paiement sur les factures envoyées.
- Mise à jour auto du statut `Payment` → `confirmed` sur webhook.

---

### WhatsApp Business API (Meta Cloud / Twilio)

**Pourquoi skippé** : décision explicite de l'utilisateur ("juste un truc simple stp"). L'approche `wa.me` deep links couvre 95% des besoins pour un usage interne, sans setup ni coût.

**Différence** :
- Actuel (wa.me) : ouvre WhatsApp avec message pré-rempli, tu cliques envoyer → gratuit, aucun compte.
- API Business : envoi automatique depuis un numéro business vérifié, webhooks pour recevoir, templates préapprouvés → demande compte Meta Business + vérification + configuration non triviale.

---

## 📋 Audit gaps — non traités (ni intégrés, ni skippés explicitement)

Points soulevés dans l'audit initial mais considérés comme secondaires par rapport à ce qui a été traité. À attaquer dans une future session si besoin :

- **Intégration Google Calendar** — sync deadlines projet / milestones.
- **CI/CD** — GitHub Actions pour tests + deploy auto.
- **Couverture de tests** — étendre la suite existante (~1400 lignes) vers un meilleur coverage.
- **Upload backups distant** — actuellement en local uniquement. Basculer sur S3 / Backblaze B2 / DigitalOcean Spaces quand nécessaire (modifier `config/backup.php` → `disks`).
- **Versioning des mises à jour de TOS / CGV** — pas traité, à prévoir si activité SaaS publique.
- **Rentabilité avancée** — forecasting, burn rate par projet, prévisionnel de marge. Le dashboard actuel est descriptif, pas prédictif.

---

## Récap des migrations de la session

```
2026_04_15_100000_add_github_inactivity_notified_at_to_projets_table.php
2026_04_15_110000_create_admin_cvs_table.php
2026_04_15_120000_add_hourly_rate_snapshot_to_time_entries.php
2026_04_15_130000_add_blocking_to_commissions.php
2026_04_15_140000_create_project_deliverables_table.php
2026_04_15_140001_add_deliverables_checklist_enabled_to_users.php
2026_04_15_150000_add_versioning_to_quotes.php
2026_04_15_160000_create_document_signature_history_table.php
```

Toutes appliquées en développement. À déployer en prod via `php artisan migrate`.

---

## Packages ajoutés à composer.json

- `spatie/laravel-backup` `^9.3` — backups automatiques
- `sentry/sentry-laravel` `^4.25` — monitoring erreurs prod

Aucun autre package ajouté pendant la session (respecte la règle CLAUDE.md "pas d'installation externe sauf demande explicite").
