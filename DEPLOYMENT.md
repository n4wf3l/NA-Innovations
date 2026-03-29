# Checklist de deploiement en production

## 1. CRON Laravel (OBLIGATOIRE)

Le scheduler Laravel fait tourner 4 jobs critiques. Sans cette ligne dans le crontab serveur, **aucun d'eux ne s'executera** :

```bash
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

Remplace `/path-to-project` par le chemin absolu du projet sur le serveur.

### Jobs planifies

| Heure | Job | Ce qu'il fait |
|---|---|---|
| 07:00 | `autoRenewServices()` | Renouvelle les services avec `auto_renew=true`, marque les autres comme `expired`, met a jour le status `expiring_soon` |
| 07:30 | `sendServiceExpiryNotifications()` | Envoie les notifications a 2 mois, 1 mois, 1 semaine, 1 jour avant expiration (admins + client) |
| 08:00 | `checkOverdueInvoices()` | Passe les factures `sent`/`partially_paid` avec `due_date` depassee en status `overdue` |
| 09:00 | `sendInvoiceReminders()` | Envoie des rappels aux clients pour les factures en retard (7j, 14j, 30j). Les rappels ne sont envoyes qu'une fois par palier. |

### Verifier que ca tourne

```bash
# Tester manuellement
php artisan schedule:run

# Voir les jobs planifies
php artisan schedule:list

# Verifier le crontab
crontab -l
```

## 2. Variables d'environnement

S'assurer que le `.env` de production a :

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://ton-domaine.com

# Mail (necessaire pour Password::sendResetLink et futures fonctionnalites email)
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME="NA Innovations"
```

## 3. Commandes post-deploiement

```bash
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
```

## 4. Emails

Les emails suivants doivent fonctionner pour que la plateforme soit complete :

- **Password reset** (client cree automatiquement via WorkflowService) : necessite un driver mail configure
- **Envoi de devis** : actuellement `TODO` dans `QuoteController::send()` (ligne 275)
- **Envoi de facture** : pas encore implemente dans `InvoiceController::send()`
- **Soumission lead partenaire** : desactive dans `Partner/LeadController::store()` (ligne 165)

## 5. Storage

```bash
php artisan storage:link
```

Les PDF (devis, factures) sont stockes via `Storage::disk('local')`. Verifier que le dossier `storage/app` est accessible en ecriture.

## 6. Permissions fichiers

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```
