# 🚀 Prysm Technologies – Komplette Turnkey-Installationsanleitung (Ubuntu 24.04 VPS)

Diese Anleitung führt dich **Schritt für Schritt, lückenlos** von einem frischen Ubuntu-24.04-Server bis zur live laufenden App mit HTTPS.

> **Wichtig (dein Server):** Deine CPU unterstützt **kein AVX**, deshalb läuft MongoDB **5.0+ nicht**. Wir nutzen daher **MongoDB 4.4 in Docker**. NICHT die normale `mongodb-org`-Paketinstallation verwenden!

---

## 📐 Architektur-Überblick

```
                    Internet (HTTPS :443)
                          │
                          ▼
                    ┌───────────┐
                    │   NGINX   │  (Reverse Proxy + SSL + statische Dateien)
                    └───────────┘
                     /         \
            "/" (React Build)   "/api/*"  →  127.0.0.1:8001
                                              │
                                        ┌───────────┐
                                        │  FastAPI  │ (uvicorn, systemd-Service)
                                        └───────────┘
                                              │
                                        127.0.0.1:27017
                                              │
                                     ┌─────────────────┐
                                     │ MongoDB 4.4     │ (Docker-Container)
                                     └─────────────────┘
```

- **Frontend:** React (craco build) → statische Dateien, von Nginx ausgeliefert.
- **Backend:** FastAPI auf `127.0.0.1:8001` (nur lokal, Nginx leitet `/api` weiter).
- **DB:** MongoDB 4.4 als Docker-Container, nur auf `127.0.0.1` gebunden.

---

## ✅ Voraussetzungen

| Punkt | Wert |
|-------|------|
| Server | Ubuntu 24.04 LTS, mind. 2 GB RAM, root- oder sudo-Zugang |
| Domain | z. B. `prysm-technologies.de` (bei dir registriert) |
| DNS | A-Record `@` und `www` → **Server-IP** (über Cloudflare oder dein DNS) |
| Git-Repo | Deine Repo-URL (im Folgenden `YOUR_GIT_REPO_URL`) |
| Zugangsdaten | Deine API-Keys (Anosim, smsroute, Telegram) – aus deinem aktuellen `backend/.env` |

> **DNS-Hinweis (Cloudflare):** A-Record auf die Server-IP setzen. Für die erste SSL-Ausstellung mit Certbot den **Proxy (orange Wolke) kurz auf „DNS only" (grau)** stellen, danach wieder auf „Proxied". SSL-Modus in Cloudflare: **Full (strict)**.

---

## 1️⃣ Server-Grundeinrichtung

Als root einloggen und aktualisieren:

```bash
ssh root@DEINE_SERVER_IP

apt update && apt upgrade -y
```

Einen Deploy-Benutzer anlegen (nicht als root arbeiten):

```bash
adduser deploy
usermod -aG sudo deploy
# (optional) SSH-Key kopieren:
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Firewall einrichten (nur SSH + Web offen):

```bash
apt install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

Ab jetzt als `deploy` weiterarbeiten:

```bash
su - deploy
```

---

## 2️⃣ System-Abhängigkeiten installieren

```bash
sudo apt update
sudo apt install -y \
  git curl wget gnupg ca-certificates \
  python3 python3-venv python3-dev python3-pip \
  build-essential libffi-dev libssl-dev \
  nginx
```

### Node.js 20 + Yarn (für den Frontend-Build)

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Yarn (klassisch)
sudo npm install -g yarn

# Prüfen
node -v    # v20.x
yarn -v    # 1.22.x
```

### Docker (für MongoDB 4.4)

```bash
# Offizielles Docker-Repo
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# deploy-User darf Docker nutzen
sudo usermod -aG docker $USER
newgrp docker     # Gruppe sofort aktivieren (oder neu einloggen)

docker --version
```

---

## 3️⃣ MongoDB 4.4 als Docker-Container starten

> MongoDB 4.4 ist die letzte Version, die **ohne AVX** läuft.

```bash
# Persistentes Datenverzeichnis
sudo mkdir -p /var/lib/prysm-mongo

# Container starten – NUR auf localhost gebunden (sicher)
docker run -d \
  --name prysm-mongo \
  --restart unless-stopped \
  -p 127.0.0.1:27017:27017 \
  -v /var/lib/prysm-mongo:/data/db \
  mongo:4.4

# Status prüfen
docker ps
docker logs prysm-mongo --tail 20
```

Verbindung testen:

```bash
docker exec -it prysm-mongo mongo --eval "db.runCommand({ ping: 1 })"
# Erwartet: { "ok" : 1 }
```

---

## 4️⃣ Code holen

```bash
sudo mkdir -p /opt/prysm
sudo chown -R $USER:$USER /opt/prysm
git clone YOUR_GIT_REPO_URL /opt/prysm
cd /opt/prysm
ls   # sollte "backend" und "frontend" zeigen
```

---

## 5️⃣ Backend einrichten

### 5.1 Virtuelle Umgebung + Pakete

```bash
cd /opt/prysm/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip wheel

# Variante A: vorhandene requirements
pip install -r requirements.txt
```

> ⚠️ **Falls `pip install -r requirements.txt` an einer bestimmten Version scheitert** (die requirements stammen aus der Build-Umgebung), nutze die schlanke, garantiert installierbare Produktionsliste:

```bash
cat > /opt/prysm/backend/requirements-prod.txt <<'EOF'
fastapi>=0.110,<0.111
uvicorn[standard]>=0.25
starlette>=0.37,<0.38
motor>=3.3,<3.4
pymongo>=4.5,<4.6
pydantic>=2.6
python-dotenv>=1.0
passlib>=1.7
bcrypt==4.0.1
python-jose[cryptography]>=3.3
reportlab>=4.0
pdfminer.six>=20231228
requests>=2.31
httpx>=0.27
email-validator>=2.0
python-multipart>=0.0.9
EOF

pip install -r /opt/prysm/backend/requirements-prod.txt
```

> 🔒 **Kritisch:** `bcrypt==4.0.1` muss exakt so bleiben – neuere bcrypt-Versionen sind mit `passlib 1.7.4` inkompatibel (Login-Fehler!).

### 5.2 Backend-`.env` anlegen

```bash
nano /opt/prysm/backend/.env
```

Inhalt (deine echten Werte eintragen – Domain anpassen):

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="prysm_production"
CORS_ORIGINS="https://prysm-technologies.de,https://www.prysm-technologies.de"
FRONTEND_URL=https://prysm-technologies.de
SMSROUTE_API_KEY=DEIN_SMSROUTE_KEY
SMSROUTE_SENDER_ID=Prysm
ANOSIM_API_KEY=DEIN_ANOSIM_KEY
TELEGRAM_BOT_TOKEN=DEIN_TELEGRAM_BOT_TOKEN
ADMIN_EMAIL='admin@prysm-technologies.com'
ADMIN_PASSWORD='HIER_EIN_SICHERES_PASSWORT'
```

> **Hinweise**
> - Die echten API-Keys stehen in deinem aktuellen/alten `backend/.env`.
> - **Keine** Leerzeichen um `=`, kein nachgestellter Kommentar in der Zeile.
> - `DB_NAME` frei wählbar. Beim ersten Start wird der Admin automatisch angelegt (siehe Schritt 9).

### 5.3 Backend-Testlauf

```bash
cd /opt/prysm/backend
source venv/bin/activate
uvicorn server:app --host 127.0.0.1 --port 8001
```

In einem zweiten Terminal:

```bash
curl http://127.0.0.1:8001/api/
# Erwartet: {"message":"Hello World"}
```

Funktioniert? Dann mit `Strg+C` stoppen.

### 5.4 systemd-Service für das Backend

```bash
sudo nano /etc/systemd/system/prysm-backend.service
```

Inhalt:

```ini
[Unit]
Description=Prysm Technologies FastAPI Backend
After=network.target docker.service
Requires=docker.service

[Service]
User=deploy
Group=deploy
WorkingDirectory=/opt/prysm/backend
EnvironmentFile=/opt/prysm/backend/.env
ExecStart=/opt/prysm/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Aktivieren & starten:

```bash
sudo systemctl daemon-reload
sudo systemctl enable prysm-backend
sudo systemctl start prysm-backend
sudo systemctl status prysm-backend --no-pager

# Logs live ansehen:
journalctl -u prysm-backend -f
```

---

## 6️⃣ Frontend bauen

### 6.1 Produktions-`.env` setzen

Das Frontend ruft die API über dieselbe Domain auf (`https://DOMAIN/api`). Daher:

```bash
nano /opt/prysm/frontend/.env
```

Inhalt:

```env
REACT_APP_BACKEND_URL=https://prysm-technologies.de
```

> Die `REACT_APP_BACKEND_URL` wird **zur Build-Zeit** fest eingebacken. Bei Domain-Änderung: `.env` anpassen → neu bauen.

### 6.2 Build erzeugen

```bash
cd /opt/prysm/frontend
yarn install --frozen-lockfile
yarn build
# Ergebnis liegt in /opt/prysm/frontend/build
ls /opt/prysm/frontend/build   # index.html, static/, favicon.svg ...
```

> Bei wenig RAM (Build bricht mit „killed" ab) Swap einrichten:
> ```bash
> sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
> echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> ```

---

## 7️⃣ Nginx konfigurieren

```bash
sudo nano /etc/nginx/sites-available/prysm
```

Inhalt (Domain anpassen):

```nginx
server {
    listen 80;
    server_name prysm-technologies.de www.prysm-technologies.de;

    # React statische Dateien
    root /opt/prysm/frontend/build;
    index index.html;

    # Upload-Größe (z. B. PDF/Bilder im Chat)
    client_max_body_size 25M;

    # API → FastAPI Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # SPA-Fallback (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Aktivieren:

```bash
sudo ln -s /etc/nginx/sites-available/prysm /etc/nginx/sites-enabled/prysm
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t          # Syntax prüfen
sudo systemctl reload nginx
```

Test über HTTP: `http://prysm-technologies.de` sollte die Seite zeigen.

---

## 8️⃣ HTTPS / SSL einrichten (Let's Encrypt)

> Falls du Cloudflare-Proxy nutzt: Proxy kurz auf **„DNS only"** stellen, Zertifikat ausstellen, dann wieder „Proxied" + SSL-Modus **Full (strict)**.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d prysm-technologies.de -d www.prysm-technologies.de
# E-Mail eingeben, AGB bestätigen, "Redirect" (Option 2) wählen.
```

Certbot trägt automatisch HTTPS in die Nginx-Config ein und richtet die Auto-Erneuerung ein. Test:

```bash
sudo certbot renew --dry-run
```

Jetzt erreichbar unter **https://prysm-technologies.de** 🎉

---

## 9️⃣ Erster Admin-Login

Der Admin wird beim Backend-Start **automatisch** aus `ADMIN_EMAIL` / `ADMIN_PASSWORD` angelegt (idempotent). Nach dem Start:

- URL: `https://prysm-technologies.de/admin/login`
- E-Mail: der Wert aus `ADMIN_EMAIL` (z. B. `admin@prysm-technologies.com`)
- Passwort: der Wert aus `ADMIN_PASSWORD`

Prüfen, ob der Seed lief:

```bash
journalctl -u prysm-backend | grep -i "Admin"
# z. B. "Admin account created for admin@prysm-technologies.com"
```

---

## 🔟 Telegram-Webhook setzen (für den 1:1-Chat)

Damit Telegram-Nachrichten ankommen, einmalig den Webhook auf deine Domain setzen:

```bash
curl "https://api.telegram.org/botDEIN_TELEGRAM_BOT_TOKEN/setWebhook?url=https://prysm-technologies.de/api/chat/telegram/webhook"
# Erwartet: {"ok":true,"result":true,...}

# Prüfen:
curl "https://api.telegram.org/botDEIN_TELEGRAM_BOT_TOKEN/getWebhookInfo"
```

---

## 🔁 Updates einspielen (Turnkey-Update-Skript)

Lege dir ein wiederverwendbares Skript an:

```bash
nano /opt/prysm/deploy.sh
```

Inhalt:

```bash
#!/usr/bin/env bash
set -e
cd /opt/prysm

echo "==> Code aktualisieren"
git stash || true
git pull origin main
git stash pop || true

echo "==> Backend-Abhängigkeiten"
cd /opt/prysm/backend
source venv/bin/activate
pip install -r requirements.txt || pip install -r requirements-prod.txt
deactivate

echo "==> Frontend bauen"
cd /opt/prysm/frontend
yarn install --frozen-lockfile
yarn build

echo "==> Dienste neu starten"
sudo systemctl restart prysm-backend
sudo systemctl reload nginx

echo "✅ Deployment fertig."
```

Ausführbar machen & nutzen:

```bash
chmod +x /opt/prysm/deploy.sh
/opt/prysm/deploy.sh
```

---

## 💾 Backups (empfohlen)

Tägliches MongoDB-Backup per Cron:

```bash
sudo mkdir -p /var/backups/prysm
sudo nano /etc/cron.daily/prysm-mongo-backup
```

Inhalt:

```bash
#!/usr/bin/env bash
STAMP=$(date +%F)
docker exec prysm-mongo mongodump --db prysm_production --archive=/data/db/backup-$STAMP.gz --gzip
docker cp prysm-mongo:/data/db/backup-$STAMP.gz /var/backups/prysm/
docker exec prysm-mongo rm -f /data/db/backup-$STAMP.gz
find /var/backups/prysm -name "backup-*.gz" -mtime +14 -delete
```

```bash
sudo chmod +x /etc/cron.daily/prysm-mongo-backup
```

(Wiederherstellen: `docker exec -i prysm-mongo mongorestore --gzip --archive=/data/db/backup-DATUM.gz`)

---

## 🛠️ Troubleshooting

| Problem | Ursache / Lösung |
|---------|------------------|
| `docker logs prysm-mongo` zeigt `Illegal instruction` / Crash | CPU ohne AVX + falsche Mongo-Version. **Nur `mongo:4.4`** verwenden. |
| Login schlägt fehl / 500 bei Login | `bcrypt` muss `==4.0.1` sein. `pip install bcrypt==4.0.1` und Backend neu starten. |
| Backend startet nicht | `journalctl -u prysm-backend -e` ansehen. Meist fehlende `.env`-Variable oder Tippfehler. |
| `502 Bad Gateway` | Backend läuft nicht (`systemctl status prysm-backend`) oder falscher Port. Muss `127.0.0.1:8001` sein. |
| Frontend zeigt alte Version | Browser-Cache **oder** Build vergessen → `yarn build` + `systemctl reload nginx`. |
| API-Calls gehen ins Leere / CORS | `REACT_APP_BACKEND_URL` falsch gesetzt (muss `https://DEINE_DOMAIN` sein) → neu bauen. `CORS_ORIGINS` im Backend prüfen. |
| `pip install` scheitert an Version | Schlanke `requirements-prod.txt` aus Schritt 5.1 nutzen. |
| Build „killed" (zu wenig RAM) | Swap einrichten (siehe Schritt 6.2). |
| Telegram-Nachrichten kommen nicht an | Webhook erneut setzen (Schritt 10), `getWebhookInfo` prüfen – URL muss HTTPS sein. |

### Nützliche Befehle

```bash
# Backend-Logs
journalctl -u prysm-backend -f

# Nginx-Logs
sudo tail -f /var/log/nginx/error.log

# Dienste-Status
sudo systemctl status prysm-backend nginx
docker ps

# Backend manuell testen
curl http://127.0.0.1:8001/api/
```

---

## 📋 Schnell-Checkliste

- [ ] Server aktualisiert, Firewall (80/443/SSH) offen
- [ ] Docker installiert, **MongoDB 4.4** Container läuft (`docker ps`)
- [ ] Code in `/opt/prysm` geklont
- [ ] `backend/.env` mit echten Keys + Domain angelegt
- [ ] `pip install` erfolgreich (bcrypt==4.0.1!)
- [ ] `prysm-backend.service` läuft (`curl 127.0.0.1:8001/api/` → Hello World)
- [ ] `frontend/.env` mit `REACT_APP_BACKEND_URL=https://DOMAIN`, `yarn build` ok
- [ ] Nginx konfiguriert, `nginx -t` ok
- [ ] Certbot HTTPS aktiv, `https://DOMAIN` lädt
- [ ] Admin-Login funktioniert
- [ ] Telegram-Webhook gesetzt
- [ ] Backup-Cron eingerichtet

Fertig – deine Prysm-Technologies-Plattform läuft live. 🚀
