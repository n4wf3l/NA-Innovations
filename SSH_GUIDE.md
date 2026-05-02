# Guide SSH - Combell prod (`nainnovations.be`)

Comment se connecter au serveur de production en SSH depuis Windows et lancer les commandes Laravel courantes.

---

## Infos de connexion

| Champ | Valeur |
|---|---|
| **Hôte SSH** | `ssh.nainnovations.be` (fallback : `ssh091.webhosting.be`) |
| **Utilisateur** | `nainnovationsbe` (sans `@`, c'est le primaire) |
| **Port** | `22` (par défaut, pas besoin de le préciser) |
| **Auth** | Clé SSH (recommandé) ou mot de passe FTP primaire |

> **Important** : le mot de passe SSH = mot de passe **FTP primaire** (panel Combell → FTP & SSH → FTP → utilisateur primaire `nainnovationsbe`). Ce n'est PAS le mot de passe FileZilla `info@nainnovationsbe` (qui est secondaire).

---

## Setup initial - clé SSH (recommandé, à faire une fois)

### 1. Crée la paire de clés sur ton PC

Ouvre PowerShell :

```powershell
cd ~
ssh-keygen -t ed25519 -f nainnovations -N '""'
```

Ça crée 2 fichiers dans `C:\Users\<ton-user>\` :
- `nainnovations` → clé **privée** (NE JAMAIS partager)
- `nainnovations.pub` → clé **publique** (à coller dans Combell)

### 2. Affiche la clé publique

```powershell
type nainnovations.pub
```

Copie toute la ligne (commence par `ssh-ed25519 AAAA...`).

### 3. Ajoute la clé dans Combell

1. Panel Combell → **FTP & SSH → SSH**
2. Section **Clés SSH** en bas → bouton **+ Ajouter**
3. Colle la clé publique
4. Sauvegarde

---

## Se connecter

### Avec clé SSH (sans mot de passe)

```powershell
cd ~
ssh -i nainnovations nainnovationsbe@ssh.nainnovations.be
```

### Avec mot de passe (si la clé n'est pas configurée)

```powershell
ssh nainnovationsbe@ssh.nainnovations.be
```

Tape le mot de passe FTP primaire. **Le terminal n'affiche RIEN quand tu tapes** (ni étoiles ni points), c'est normal - tape lentement puis Entrée.

### Première connexion

Le serveur demande :
```
Are you sure you want to continue connecting (yes/no)?
```
Tape `yes` et Entrée. C'est uniquement la première fois (il enregistre la fingerprint dans `~/.ssh/known_hosts`).

---

## Une fois connecté

Tu atterris dans `~` (= `/data/sites/web/nainnovationsbe/`). Le projet Laravel est dans `laravel-app/` et le webroot est `www/`.

### Aller dans Laravel

```bash
cd laravel-app
```

### Commandes Laravel courantes

```bash
# Vérifier le statut des migrations
php artisan migrate:status

# Lancer les migrations en attente
php artisan migrate --force

# Restaurer un snapshot DB
php artisan db:seed --class=SnapshotSeeder --force

# Vider tous les caches
php artisan config:clear
php artisan view:clear
php artisan cache:clear
php artisan route:clear

# Re-cacher pour la prod
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Voir les dernières erreurs
tail -100 storage/logs/laravel.log

# Pour suivre les logs en temps réel pendant un test
tail -f storage/logs/laravel.log
```

### Re-builder les assets front (Vite)

```bash
cd /data/sites/web/nainnovationsbe/laravel-app
npm install
npm run build
```

Les assets sont écrits dans `public/build/` qui est un symlink vers `www/build/`. Donc les fichiers compilés arrivent direct dans le webroot.

> **Si `npm install` plante avec ENOENT** → il manque `package.json` (et autres fichiers de config) dans `laravel-app/`. Upload depuis local : `package.json`, `package-lock.json`, `vite.config.js`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, et le dossier `lang/`.

### Permissions sur storage / cache

Si Laravel crash avec « Permission denied » sur les logs ou views compilés :

```bash
chmod -R 775 storage bootstrap/cache
```

### Sortir du SSH

```bash
exit
```

Ou `Ctrl+D`.

---

## Diagnostic rapide d'une erreur en prod

Quand le site affiche une erreur :

```bash
ssh -i nainnovations nainnovationsbe@ssh.nainnovations.be
cd laravel-app
tail -50 storage/logs/laravel.log
```

Lis l'exception du haut, c'est la cause racine. Les ~60 lignes du dessous sont le stack trace.

Pour voir l'erreur **dans le navigateur** au lieu du log :
```bash
nano .env
# Mets APP_DEBUG=true puis Ctrl+X, Y, Entrée
php artisan config:clear
```
Recharge le site. **Remets APP_DEBUG=false** dès que tu as la cause (sinon les stack traces fuitent côté visiteurs).

---

## Workflow de déploiement type

```bash
# Sur ton PC : push tes changements vers Git
git add .
git commit -m "feat: ..."
git push

# Sur le serveur : pull, install, build
ssh -i ~/nainnovations nainnovationsbe@ssh.nainnovations.be
cd laravel-app
git pull
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
exit
```

(À adapter selon ton setup git côté serveur - pour l'instant tu déploies via FileZilla manuel.)

---

## Troubleshooting

| Problème | Solution |
|---|---|
| `Permission denied (publickey,password)` | Reset mot de passe FTP primaire OU vérifier que la clé publique est dans Combell |
| `Connection timed out` | DNS pas encore propagé pour `ssh.nainnovations.be` → utilise le fallback `ssh091.webhosting.be` |
| `npm install` → ENOENT package.json | Upload `package.json`, `package-lock.json`, `vite.config.js`, etc. dans `laravel-app/` |
| `npm run build` → Could not resolve "../../../lang/..." | Upload le dossier `lang/` dans `laravel-app/lang/` |
| Vite manifest not found | Le symlink `laravel-app/public/build` → `www/build/` est cassé. Recrée : `cd laravel-app && mkdir -p public && ln -s /data/sites/web/nainnovationsbe/www/build public/build` |
| 500 + DB errors | Vérifie `.env` (DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD) - credentials Combell visibles dans **Bases de données → Identifiants de connexion** |

---

*Garde ce fichier hors du repo public si tu y mets des credentials. Ici il ne contient que des infos publiques (host, structure, commandes), donc OK à committer.*
