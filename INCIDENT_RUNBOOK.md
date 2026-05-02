# Runbook d'incident - NA Innovations

> **Objectif** : guider la personne d'astreinte pour détecter, diagnostiquer et résoudre les incidents en production avec le minimum de stress et le maximum de rigueur.
>
> **À lire en 5 minutes avant un incident. À ouvrir en 5 secondes pendant.**

---

## Table des matières

1. [Classification de sévérité](#classification-de-sévérité)
2. [Rôles pendant un incident](#rôles-pendant-un-incident)
3. [Canaux de communication](#canaux-de-communication)
4. [Contacts d'astreinte](#contacts-dastreinte)
5. [Premiers réflexes (5 minutes)](#premiers-réflexes-5-minutes)
6. [Playbooks par scénario](#playbooks-par-scénario)
7. [Restauration depuis backup](#restauration-depuis-backup)
8. [Communication aux clients](#communication-aux-clients)
9. [Post-incident : postmortem](#post-incident--postmortem)
10. [Annexes - commandes rapides](#annexes--commandes-rapides)

---

## Classification de sévérité

| Niveau | Exemples | Délai d'intervention | Communication |
|---|---|---|---|
| **SEV1** | Site inaccessible, perte de données, leak inter-tenant, fuite de credentials, paiements cassés | < 15 min 24/7 | Canal dédié + mise à jour toutes les 30 min |
| **SEV2** | Module majeur cassé (facturation, devis, portail client), emails non envoyés, cron down | < 1 h heures ouvrées, < 4 h sinon | Canal dédié + mise à jour horaire |
| **SEV3** | Bug non-bloquant, ralentissement, feature partiellement cassée | Jour ouvré suivant | Ticket, pas d'urgence |

**Règle** : en cas de doute entre deux niveaux, **escalader au plus haut**. Mieux vaut surréagir que sous-réagir.

---

## Rôles pendant un incident

Pour un SEV1, nommer dès le début :

- **Incident Commander (IC)** - coordonne, décide, communique. **Ne fait rien techniquement.** Son seul job : garder la tête froide et éviter que 3 personnes fassent 3 manipulations contradictoires.
- **Tech Lead** - fait les manipulations. Propose, exécute après accord IC si destructif.
- **Communicator** - rédige les updates (Slack / email clients / statut public). Libère le Tech Lead pour qu'il bosse.

**Pour SEV2/3** : la même personne peut cumuler les rôles, mais garder l'ordre mental : coordonner → agir → communiquer.

---

## Canaux de communication

- **Canal interne incident** : `#incidents` Slack (ou Discord / WhatsApp groupe)
- **Page statut publique** : à créer (proposition : `status.nainnovations.be` via Instatus / Statuspage / auto-hébergé)
- **Email clients massif** : via back-office `Admin/Email templates` → template `incident-notification` (à créer)
- **SMS d'urgence** : Twilio si configuré, sinon WhatsApp direct aux Tech Leads des clients majeurs

---

## Contacts d'astreinte

> **À remplir par l'équipe avant la mise en prod.** Laisser cette doc à jour est critique.

| Rôle | Nom | Téléphone | Email | Horaires |
|---|---|---|---|---|
| Admin principal | Nawfel Ajari | _à compléter_ | info@nainnovations.be | 24/7 |
| Admin secondaire | Ismael Bouzrouti | _à compléter_ | ismael@nainnovations.be | 24/7 |
| Hébergeur | _nom_ | _support_ | _email_ | _SLA_ |
| Registrar domaine | _nom_ | _support_ | _email_ | _SLA_ |
| SMTP provider | Mailprotect | _support_ | _email_ | _SLA_ |
| Stripe / banque | _contact_ | _support_ | _email_ | _SLA_ |

---

## Premiers réflexes (5 minutes)

Dès qu'une alerte tombe, **avant tout diagnostic** :

1. **Horodater** - noter l'heure exacte du début perçu de l'incident.
2. **Capturer** - screenshot de l'erreur, copier-coller les logs visibles.
3. **Reproduire** - est-ce que tu observes le problème toi aussi ? Ou juste remonté par un user ?
4. **Scope** - est-ce 1 client, plusieurs, tous ? 1 feature, plusieurs, toute la plateforme ?
5. **Nommer IC** (si SEV1).
6. **Ouvrir le canal** `#incidents` et poster :
   ```
   [SEV?] <titre court>
   Début : HH:MM
   Scope : <qui est impacté>
   IC : <nom>
   Statut : Investigation en cours
   ```

**Ne pas** :
- Toucher à la prod avant d'avoir lu les logs.
- Relancer un service "pour voir".
- Lancer des migrations sans backup frais.

---

## Playbooks par scénario

### 🔴 Site entièrement inaccessible

**Symptômes** : 502 / 503 / timeout sur `/`.

```bash
# 1. Vérifier l'état du serveur
ssh user@serveur
systemctl status nginx php8.2-fpm mysql
```

**Si un service est down** :
```bash
systemctl restart nginx
systemctl restart php8.2-fpm
# Ne PAS redémarrer MySQL si des paiements sont en cours.
# Vérifier d'abord : journalctl -u mysql --since "10 min ago"
```

**Si les services sont up mais le site rame** :
```bash
# Check la charge
top -b -n 1 | head -20
df -h       # disque plein ?
free -h     # RAM saturée ?
```

**Si disque plein** :
```bash
# Nettoyer les logs Laravel (les plus fréquents)
du -sh storage/logs/*
# Archiver et supprimer les anciens
find storage/logs/ -name "*.log" -mtime +30 -delete
# Vider le cache
php artisan cache:clear
php artisan view:clear
```

---

### 🔴 Base de données down ou corrompue

**Symptômes** : `SQLSTATE[HY000]` partout, connexions refusées.

```bash
# 1. Statut
systemctl status mysql
journalctl -u mysql --since "30 min ago" | tail -50

# 2. Espace disque
df -h /var/lib/mysql

# 3. InnoDB crash recovery (si MySQL refuse de démarrer)
# Éditer /etc/mysql/my.cnf :
#   innodb_force_recovery = 1
# Puis systemctl start mysql
# Si OK, DUMP IMMÉDIATEMENT la base puis reset à 0 :
mysqldump -u root laravel > /tmp/recovery-dump.sql
# Remettre innodb_force_recovery = 0
```

**Si corruption avérée** → [Restauration depuis backup](#restauration-depuis-backup).

---

### 🔴 Fuite inter-tenant suspectée (Admin A voit les données d'Admin B)

**C'est le pire scénario sur cette plateforme multi-tenant. Agir vite.**

1. **Isoler** : mettre le site en maintenance immédiatement.
   ```bash
   php artisan down --message="Maintenance d'urgence en cours"
   ```
2. **Diagnostiquer** : demander à l'admin qui signale exactement ce qu'il voit et de fournir screenshot.
3. **Vérifier** le contexte tenant via tinker :
   ```bash
   php artisan tinker
   >>> app(\App\Support\CurrentAdmin::class)->id()
   ```
4. **Auditer** via les global scopes : vérifier que chaque modèle scopé (Projet, User, Invoice, Quote, Payment, Commission, RecurringService, Lead, ReferralPartner, ActivityLog) a bien son `addGlobalScope` dans `booted()`.
5. **Grep** pour `withoutGlobalScope` qui pourrait avoir été oublié dans un contrôleur sans protection :
   ```bash
   grep -rn "withoutGlobalScope" app/Http/Controllers/Admin/
   ```
6. **Si confirmé** :
   - Déterminer l'ampleur : lister les requêtes HTTP des 24 dernières heures depuis les `activity_log`.
   - Bloquer temporairement le compte compromis.
   - Préparer une notification RGPD si des données personnelles ont été vues (72h pour notifier APD / DPA).
7. **Remettre en ligne** uniquement après fix vérifié avec le script de test `scripts/tenant-e2e-test.php`.

---

### 🔴 Fuite de credentials / suspicion de compromission

**Symptômes** : activité admin anormale, logs inattendus, clients qui reçoivent des emails qu'ils n'ont pas initiés.

1. **Révoquer tous les tokens** :
   ```bash
   php artisan tinker
   >>> \DB::table('personal_access_tokens')->delete();
   >>> \DB::table('sessions')->delete();
   ```
2. **Forcer logout** de tous les admins.
3. **Reset tous les mots de passe admin** :
   ```bash
   >>> \App\Models\User::withoutGlobalScope(\App\Models\Scopes\UserAdminTenantScope::class)
       ->where('role','admin')->each(fn($u) => $u->update(['password' => bcrypt(\Illuminate\Support\Str::random(32))]));
   ```
4. **Faire générer des reset links** via la page login `/forgot-password`.
5. **Audit** : extraire les 7 derniers jours du `activity_log`, chercher les IPs inconnues.
6. **Changer** : tous les secrets `.env` (APP_KEY, DB password, SMTP password, clés API tierces).
   - ⚠ Attention : changer `APP_KEY` invalide tous les champs encrypted (credentials projets, 2FA, github_token). À faire uniquement si on les considère compromis, avec un re-seeding derrière.
7. **Notifier** : APD Belgique (dpo@adp-gba.be) dans les 72h si données perso concernées.

---

### 🟠 Emails non envoyés / SMTP down

**Symptômes** : les users ne reçoivent plus rien, pas d'erreur visible côté UI.

```bash
# 1. Test direct depuis le serveur
php artisan tinker
>>> \Mail::raw('Test', fn($m) => $m->to('nawfel+test@nainnovations.be')->subject('Test'));
# Si exception → lire le message
```

**Cas fréquents** :
- `Domain not found` → le destinataire a un domaine invalide (vérifier l'orthographe en base).
- `Authentication failed` → credentials `.env` expirés / changés côté provider.
- `Connection timed out` → firewall / IP bannie par le provider / port 587 bloqué.
- `550 Relay not allowed` → le `from` n'est pas autorisé sur le SMTP provider (DKIM/SPF à revoir).

**Fix standard** :
1. Tester la connectivité : `telnet smtp-auth.mailprotect.be 587`.
2. Si OK, regarder les credentials dans `.env` et tester auth :
   ```bash
   swaks --to test@example.com --from info@nainnovations.be \
     --server smtp-auth.mailprotect.be:587 --auth-user info@nainnovations.be --auth-password "***" --tls
   ```
3. Si tout échoue, passer en secours Postmark/Resend (avoir une clé en réserve) en changeant juste `.env`.

**Emails en file** (si queue=database) :
```bash
php artisan queue:failed       # lister les jobs échoués
php artisan queue:retry all    # tout relancer
```

---

### 🟠 Cron jobs ne tournent plus

**Symptômes** : factures non marquées overdue, reminders non envoyés, services non renouvelés.

```bash
# 1. Vérifier que le cron serveur est actif
crontab -l | grep artisan
# Doit contenir :
# * * * * * cd /path && php artisan schedule:run >> /dev/null 2>&1

# 2. Tester manuellement
cd /path-du-projet
php artisan schedule:list
php artisan schedule:run

# 3. Voir les dernières exécutions
tail -100 storage/logs/laravel.log | grep -i "schedule\|cron"
```

**Si un job bloque** :
```bash
# Forcer une exécution individuelle via tinker
php artisan tinker
>>> (new \App\Console\Kernel(...))->callMethod('checkOverdueInvoices'); // exemple
```

**Re-processing manuel** (cas : cron down pendant 3 jours) :
```bash
# Marquer manuellement les factures overdue
php artisan tinker
>>> \App\Models\Invoice::whereIn('status',['sent','viewed','partially_paid'])
    ->where('due_date','<',now())->update(['status' => 'overdue']);
```

---

### 🟠 DomPDF / génération PDF plante

**Symptômes** : téléchargement de facture = 500 ou PDF corrompu.

```bash
# 1. Check mémoire PHP
grep memory_limit php.ini   # doit être >= 256M, idéalement 512M

# 2. Check extension GD
php -m | grep gd

# 3. Permissions storage (DomPDF écrit des fichiers temp)
chmod -R 775 storage/app
chown -R www-data:www-data storage

# 4. Test manuel
php artisan tinker
>>> \Barryvdh\DomPDF\Facade\Pdf::loadHTML('<h1>test</h1>')->output();
```

**Si OOM** (out of memory) sur de gros PDFs :
- Augmenter `memory_limit` à 1G temporairement dans `php.ini`.
- À plus long terme : chunker les factures multi-pages, ou passer à Chromium headless (puppeteer/spatie/browsershot) pour les docs lourds.

---

### 🟠 Paiement / facture avec montants incohérents

**Symptômes** : client voit X €, facture PDF montre Y €, DB a Z €.

**Ne rien modifier sans avoir capturé l'état actuel.**

```bash
# Snapshot avant toute manipulation
php artisan tinker
>>> $i = \App\Models\Invoice::find(<id>); var_dump($i->toArray());

# Check les items
>>> $i->items->toArray();

# Check les paiements liés
>>> $i->payments->toArray();
```

**Questions à poser avant de toucher** :
1. La facture a-t-elle été envoyée au client (status `sent` ou plus) ? Si oui, **ne pas modifier** - créer une nouvelle version ou un avoir.
2. Un paiement a-t-il déjà été encaissé ? Si oui, ne surtout pas altérer les montants historiques.

**Règle** : en Belgique, une facture envoyée ne se modifie pas. Créer **avoir / note de crédit** puis refacturer correctement.

---

### 🟡 Client ne peut pas se connecter

**Symptômes** : un ou plusieurs clients signalent login impossible.

```bash
php artisan tinker
>>> $u = \App\Models\User::where('email','<email>')->first();
>>> $u->is_active          # false → réactiver
>>> $u->email_verified_at  # null → marquer vérifié
>>> $u->approved_at        # null → approuver
>>> $u->two_factor_enabled # true → vérifier qu'il a ses codes de récup
```

**Fix rapides** :
- `$u->update(['is_active' => true])` si désactivé.
- Générer un reset link : interface admin `/admin/team` → bouton « Envoyer identifiants ».
- Désactiver temporairement le 2FA si le user a perdu son appareil :
  ```php
  $u->update([
      'two_factor_enabled' => false,
      'two_factor_secret' => null,
      'two_factor_recovery_codes' => null,
      'two_factor_confirmed_at' => null,
  ]);
  ```

---

### 🟡 Cache / queue bloquée

```bash
# Purger le cache applicatif
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# Redémarrer les workers de queue (si Redis/database queue)
php artisan queue:restart
# Puis relancer le worker depuis supervisor :
supervisorctl restart all
```

---

### 🟡 GitHub integration ne remonte plus les commits

```bash
# 1. Vérifier le token du projet
php artisan tinker
>>> $p = \App\Models\Projet::find(<id>);
>>> $p->github_repo
>>> \App\Models\User::find($p->github_linked_by)->github_token
# Token révoqué ou expiré ?

# 2. Test API manuel
curl -H "Authorization: token <le_token>" https://api.github.com/repos/<owner>/<repo>/commits
# 401 → token invalide, re-lier le compte GitHub
# 404 → repo déplacé/supprimé
# 403 avec rate limit → attendre ou passer en PAT avec quota supérieur
```

---

## Restauration depuis backup

### Scénario 1 : restauration complète depuis `SnapshotSeeder`

Utile si perte totale de la BDD et qu'un snapshot JSON récent existe.

```bash
# 1. Mettre en maintenance
php artisan down --message="Restauration en cours"

# 2. Drop + refresh
php artisan migrate:fresh --force

# 3. Restaurer depuis le snapshot
php artisan db:seed --class=SnapshotSeeder --force

# 4. Re-seed la tenancy si besoin (voir scripts/restore-tenancy.php qui a déjà servi)

# 5. Vérifier l'intégrité
php artisan tinker
>>> \DB::table('users')->count();
>>> \DB::table('projets')->count();
>>> \DB::table('invoices')->count();

# 6. Remettre en ligne
php artisan up
```

### Scénario 2 : restauration depuis mysqldump

Si backup `.sql.gz` sur S3 / Spaces :

```bash
# 1. Télécharger
aws s3 cp s3://<bucket>/backups/latest.sql.gz /tmp/
gunzip /tmp/latest.sql.gz

# 2. Maintenance
php artisan down

# 3. Drop + restore
mysql -u root -p -e "DROP DATABASE laravel; CREATE DATABASE laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p laravel < /tmp/latest.sql

# 4. Vérifier + remettre en ligne
php artisan up
```

### Scénario 3 : Point-in-time recovery (si managed DB)

Si tu es sur Digital Ocean Managed / AWS RDS / PlanetScale, aller directement dans la console provider - PITR en quelques clics, pas de commande à taper.

---

## Communication aux clients

### Pendant l'incident

**Template rapide (Slack / Discord / email) :**

```
🔴 [En cours] Incident <titre>
Début : HH:MM
Impact : <ce qui ne marche pas>
On investigue activement.
Prochaine mise à jour dans 30 min.
```

### À la résolution

```
✅ [Résolu] Incident <titre>
Durée : HH:MM → HH:MM (XX minutes)
Cause : <en 1 phrase grand public>
Impact réel : <données / clients touchés>
Actions correctives : <ce qu'on a fait>
Postmortem complet d'ici 72h.
```

### Si données personnelles touchées (RGPD)

Notification à l'APD Belgique (Autorité de Protection des Données) **dans les 72h** via https://www.autoriteprotectiondonnees.be.
Également aux personnes concernées si risque élevé pour leurs droits.

---

## Post-incident : postmortem

**Obligatoire pour tout SEV1, recommandé pour SEV2.** À rédiger sous 72h, partager en interne.

### Template

```markdown
# Postmortem - <titre incident>

**Date** : YYYY-MM-DD
**Sévérité** : SEV1 / SEV2 / SEV3
**Durée** : XX minutes (HH:MM → HH:MM UTC)
**Auteur du postmortem** : <nom>

## Résumé en 3 lignes
<Ce qui s'est passé, qui a été impacté, comment on a résolu.>

## Timeline
- HH:MM - premier signal (alerte / user report / monitoring)
- HH:MM - diagnostic initial
- HH:MM - hypothèse X écartée
- HH:MM - root cause identifiée
- HH:MM - fix déployé
- HH:MM - vérification complète, incident clos

## Impact
- Combien d'utilisateurs touchés.
- Combien de transactions perdues / dupliquées / en erreur.
- Données personnelles concernées : oui / non.
- Revenue impact estimé.

## Cause racine
<Explication technique détaillée. Pas de blame, on cherche la cause systémique, pas l'humain.>

## Ce qui a bien fonctionné
- <exemples : l'alerte est tombée en 2 min, le rollback a marché du 1er coup…>

## Ce qui a mal fonctionné
- <exemples : personne n'avait le runbook sous la main, manquait un dashboard Grafana…>

## Actions correctives
| Action | Propriétaire | Deadline | Statut |
|---|---|---|---|
| <ex : ajouter un test qui prévient cette régression> | <nom> | <date> | Todo |
| <ex : scheduler un backup horaire> | <nom> | <date> | Todo |

## Leçons apprises
<Principes à retenir pour la prochaine fois.>
```

---

## Annexes - commandes rapides

### Maintenance

```bash
php artisan down --message="Maintenance"       # met en maintenance
php artisan up                                 # remet en ligne
php artisan optimize                           # cache config/routes/views
php artisan optimize:clear                     # clear all caches
```

### Diagnostic DB

```bash
# Taille des tables
mysql -u root -p -e "SELECT table_name, ROUND(data_length/1024/1024,2) AS mb \
  FROM information_schema.tables WHERE table_schema='laravel' ORDER BY mb DESC LIMIT 20;"

# Requêtes longues
mysql -u root -p -e "SHOW FULL PROCESSLIST;"
```

### Diagnostic Laravel

```bash
php artisan about                # infos app (versions, env, cache, driver)
php artisan route:list           # toutes les routes
php artisan schedule:list        # crons planifiés
php artisan queue:failed         # jobs en erreur
tail -f storage/logs/laravel.log # logs temps réel
```

### Multi-tenant

```bash
php artisan tinker
>>> app(\App\Support\CurrentAdmin::class)->id()
>>> \App\Models\User::withoutGlobalScope(\App\Models\Scopes\UserAdminTenantScope::class)->where('role','admin')->count()
```

### Git rollback rapide

```bash
git log --oneline -20            # lister les derniers commits
git revert <sha>                 # revert d'un commit spécifique (crée un commit de revert)
php artisan migrate:rollback     # rollback de la dernière migration
```

---

## Règles d'or

1. **Pas de modification destructive sans backup frais.**
2. **Annoncer avant d'agir, surtout si plusieurs personnes sont connectées au serveur.**
3. **Logger tout ce qu'on fait** dans le canal `#incidents` pour la timeline du postmortem.
4. **Ne pas blâmer** - postmortems blameless, on cherche les causes systémiques.
5. **Prévenir les clients** de manière proactive. Mieux vaut surcommuniquer.
6. **Après résolution** : prendre 15 min pour écrire les actions correctives tant que c'est frais.
7. **Tester le runbook** : une fois par trimestre, simuler un incident (game day) pour vérifier que les procédures marchent vraiment.

---

*Runbook vivant. À mettre à jour après chaque incident ou changement d'infrastructure.*
