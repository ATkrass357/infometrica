# Precision Labs Self-Hosting Anleitung

Diese Anleitung erklärt Schritt für Schritt, wie du die Precision Labs-Anwendung auf deinem eigenen Server mit Proxy-Server hostest.

---

## Deine Server-Konfiguration

| Server | Hostname | Funktion |
|--------|----------|----------|
| **Main Server** | VPS-GnxrPFnC | Backend, Frontend, Datenbank |
| **Proxy Server** | precision.de | Nginx Reverse Proxy, SSL |

---

## Inhaltsverzeichnis

1. [Was du brauchst](#1-was-du-brauchst)
2. [Server mieten](#2-server-mieten)
3. [Domain einrichten](#3-domain-einrichten)
4. [Mit dem Server verbinden](#4-mit-dem-server-verbinden)
5. [Server vorbereiten](#5-server-vorbereiten)
6. [MongoDB installieren](#6-mongodb-installieren)
7. [Node.js installieren](#7-nodejs-installieren)
8. [Python installieren](#8-python-installieren)
9. [Code hochladen](#9-code-hochladen)
10. [Backend einrichten](#10-backend-einrichten)
11. [Frontend einrichten](#11-frontend-einrichten)
12. [Nginx installieren](#12-nginx-installieren)
13. [SSL-Zertifikat einrichten](#13-ssl-zertifikat-einrichten)
14. [Autostart einrichten](#14-autostart-einrichten)
15. [Firewall einrichten](#15-firewall-einrichten)
16. [Proxy-Server einrichten](#16-proxy-server-einrichten)
17. [Testen](#17-testen)
18. [Wartung](#18-wartung)
19. [Fehlerbehebung](#19-fehlerbehebung)
20. [Update-Befehle](#20-update-befehle)

---

## 1. Was du brauchst

### Voraussetzungen:
- **Ein Server** (VPS) mit mindestens:
  - 2 GB RAM (4 GB empfohlen)
  - 20 GB Speicherplatz
  - Ubuntu 22.04 LTS (empfohlen)
  
- **Eine Domain** (z.B. infometrica.de)

- **Ein Terminal-Programm:**
  - Windows: [PuTTY](https://www.putty.org/) oder Windows Terminal
  - Mac/Linux: Terminal (bereits installiert)

- **Ein FTP-Programm** (optional):
  - [FileZilla](https://filezilla-project.org/) (kostenlos)

### Geschätzte Kosten:
| Service | Kosten |
|---------|--------|
| VPS Server (z.B. Hetzner, DigitalOcean) | ca. 5-10€/Monat |
| Domain (.de) | ca. 10-15€/Jahr |

---

## 2. Server mieten

### Option A: Hetzner (Empfohlen für Deutschland)

1. Gehe zu [https://www.hetzner.com/cloud](https://www.hetzner.com/cloud)
2. Klicke auf **"Jetzt bestellen"**
3. Erstelle ein Konto (E-Mail bestätigen)
4. Wähle **"Cloud Server"**
5. Konfiguration:
   - **Standort:** Falkenstein oder Nürnberg (Deutschland)
   - **Image:** Ubuntu 22.04
   - **Typ:** CX21 (2 vCPU, 4 GB RAM) - ca. 5€/Monat
   - **Netzwerk:** Public IPv4 aktivieren
   - **SSH-Key:** Erstelle einen neuen (siehe unten)
   
6. Klicke auf **"Kostenpflichtig bestellen"**

### SSH-Key erstellen (Windows):

1. Öffne **PowerShell** (Windows-Taste, tippe "PowerShell")
2. Führe aus:
```powershell
ssh-keygen -t rsa -b 4096
```
3. Drücke 3x Enter (Standardwerte übernehmen)
4. Dein Key liegt in: `C:\Users\DEINNAME\.ssh\id_rsa.pub`
5. Öffne die Datei mit Notepad und kopiere den Inhalt
6. Füge ihn bei Hetzner ein

### SSH-Key erstellen (Mac/Linux):

1. Öffne Terminal
2. Führe aus:
```bash
ssh-keygen -t rsa -b 4096
```
3. Drücke 3x Enter
4. Kopiere den Key:
```bash
cat ~/.ssh/id_rsa.pub
```
5. Füge ihn bei Hetzner ein

### Option B: DigitalOcean

1. Gehe zu [https://www.digitalocean.com](https://www.digitalocean.com)
2. Registriere dich
3. Klicke auf **"Create" → "Droplets"**
4. Wähle:
   - **Region:** Frankfurt
   - **Image:** Ubuntu 22.04
   - **Size:** Basic, 4 GB RAM ($24/Monat) oder 2 GB ($12/Monat)
   - **Authentication:** SSH Key (wie oben erstellt)
5. Klicke auf **"Create Droplet"**

### Nach der Erstellung:
- Notiere dir die **IP-Adresse** deines Servers (z.B. `123.45.67.89`)
- Diese findest du im Dashboard des Anbieters

---

## 3. Domain einrichten

### Domain kaufen (falls noch nicht vorhanden):

Empfohlene Anbieter:
- [IONOS](https://www.ionos.de) (günstig, deutsch)
- [Namecheap](https://www.namecheap.com) (international)
- [Strato](https://www.strato.de) (deutsch)

### DNS-Einstellungen konfigurieren:

1. Logge dich bei deinem Domain-Anbieter ein
2. Gehe zu **DNS-Einstellungen** oder **DNS-Verwaltung**
3. Erstelle folgende Einträge:

| Typ | Name | Wert | TTL |
|-----|------|------|-----|
| A | @ | DEINE_SERVER_IP | 3600 |
| A | www | DEINE_SERVER_IP | 3600 |

**Beispiel:**
- Typ: A
- Name: @ (oder leer lassen)
- Wert: 123.45.67.89
- TTL: 3600

4. Speichern und warten (kann bis zu 24 Stunden dauern, meist aber 5-30 Minuten)

### Überprüfen ob DNS funktioniert:

Öffne Terminal/PowerShell und führe aus:
```bash
ping deine-domain.de
```

Wenn die IP-Adresse deines Servers angezeigt wird, funktioniert es!

---

## 4. Mit dem Server verbinden

### Windows (mit PowerShell):

1. Öffne PowerShell
2. Verbinde dich:
```powershell
ssh root@DEINE_SERVER_IP
```
Beispiel:
```powershell
ssh root@123.45.67.89
```

3. Bei der Frage "Are you sure you want to continue connecting?" tippe `yes` und Enter
4. Du bist jetzt auf dem Server!

### Windows (mit PuTTY):

1. Öffne PuTTY
2. Gib ein:
   - Host Name: `DEINE_SERVER_IP`
   - Port: `22`
   - Connection type: `SSH`
3. Klicke auf **"Open"**
4. Login as: `root`
5. Du bist jetzt auf dem Server!

### Mac/Linux:

1. Öffne Terminal
2. Verbinde dich:
```bash
ssh root@DEINE_SERVER_IP
```
3. Bei der Frage "Are you sure..." tippe `yes`

---

## 5. Server vorbereiten

**Ab jetzt alle Befehle auf dem Server ausführen!**

### 5.1 System aktualisieren:

```bash
apt update && apt upgrade -y
```

Warte bis es fertig ist (kann 2-5 Minuten dauern).

### 5.2 Wichtige Programme installieren:

```bash
apt install -y curl wget git build-essential software-properties-common
```

### 5.3 Neuen Benutzer erstellen (Sicherheit):

```bash
adduser infometrica
```

- Gib ein Passwort ein (wird nicht angezeigt beim Tippen!)
- Bestätige das Passwort
- Die anderen Fragen kannst du mit Enter überspringen

### 5.4 Benutzer Admin-Rechte geben:

```bash
usermod -aG sudo infometrica
```

### 5.5 Zum neuen Benutzer wechseln:

```bash
su - infometrica
```

Dein Prompt sollte jetzt `infometrica@server:~$` zeigen.

---

## 6. MongoDB installieren

### 6.1 MongoDB Repository hinzufügen:

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
```

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

### 6.2 MongoDB installieren:

```bash
sudo apt update
sudo apt install -y mongodb-org
```

### 6.3 MongoDB starten:

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 6.4 Überprüfen ob MongoDB läuft:

```bash
sudo systemctl status mongod
```

Du solltest "active (running)" sehen. Drücke `q` zum Beenden.

### 6.5 MongoDB testen:

```bash
mongosh
```

Wenn du `test>` siehst, funktioniert es! Tippe `exit` zum Beenden.

---

## 7. Node.js installieren

### 7.1 Node.js 20 Repository hinzufügen:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

### 7.2 Node.js installieren:

```bash
sudo apt install -y nodejs
```

### 7.3 Version überprüfen:

```bash
node --version
```

Sollte `v20.x.x` anzeigen.

```bash
npm --version
```

Sollte eine Versionsnummer anzeigen.

### 7.4 Yarn installieren (wird für das Frontend benötigt):

```bash
sudo npm install -g yarn
```

### 7.5 Yarn überprüfen:

```bash
yarn --version
```

---

## 8. Python installieren

### 8.1 Python 3.11 installieren:

```bash
sudo apt install -y python3.11 python3.11-venv python3-pip
```

### 8.2 Python als Standard setzen:

```bash
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
```

### 8.3 Version überprüfen:

```bash
python3 --version
```

Sollte `Python 3.11.x` anzeigen.

---

## 9. Code hochladen

### Option A: Mit Git (Empfohlen)

Falls du den Code auf GitHub hast:

```bash
cd ~
git clone https://github.com/DEIN_USERNAME/DEIN_REPO.git infometrica
cd infometrica
```

### Option B: Mit FileZilla (SFTP)

1. Öffne FileZilla
2. Verbindung herstellen:
   - Host: `sftp://DEINE_SERVER_IP`
   - Benutzername: `infometrica`
   - Passwort: Dein Passwort
   - Port: `22`
3. Klicke auf "Verbinden"
4. Links: Navigiere zu deinem heruntergeladenen Code-Ordner
5. Rechts: Navigiere zu `/home/infometrica/`
6. Erstelle einen Ordner `infometrica` (Rechtsklick → Verzeichnis erstellen)
7. Ziehe den Inhalt (backend, frontend Ordner) in den `infometrica` Ordner

### Option C: Mit SCP (Kommandozeile)

Auf deinem lokalen Computer (nicht Server!):

```bash
scp -r /pfad/zum/code/* infometrica@DEINE_SERVER_IP:/home/infometrica/infometrica/
```

### Überprüfen ob Code vorhanden ist:

Auf dem Server:
```bash
cd ~/infometrica
ls -la
```

Du solltest `backend` und `frontend` Ordner sehen.

---

## 10. Backend einrichten

### 10.1 In den Backend-Ordner wechseln:

```bash
cd ~/infometrica/backend
```

### 10.2 Python Virtual Environment erstellen:

```bash
python3 -m venv venv
```

### 10.3 Virtual Environment aktivieren:

```bash
source venv/bin/activate
```

Dein Prompt sollte jetzt `(venv)` am Anfang zeigen.

### 10.4 Python-Pakete installieren:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Warte bis alles installiert ist.

### 10.5 Environment-Datei erstellen:

```bash
nano .env
```

Füge folgenden Inhalt ein (passe die Werte an!):

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=infometrica_production
CORS_ORIGINS=https://deine-domain.de,https://www.deine-domain.de
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@deine-domain.de
FRONTEND_URL=https://deine-domain.de
JWT_SECRET=HIER_EINEN_LANGEN_ZUFAELLIGEN_STRING_EINGEBEN
```

**Wichtig:** 
- Ersetze `deine-domain.de` mit deiner echten Domain
- Für `JWT_SECRET` erstelle einen zufälligen String (mindestens 32 Zeichen)
- `RESEND_API_KEY` bekommst du von [resend.com](https://resend.com)

Zum Speichern: `Ctrl + X`, dann `Y`, dann `Enter`

### 10.6 JWT_SECRET generieren:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Kopiere die Ausgabe und füge sie als `JWT_SECRET` in die .env ein.

### 10.7 Backend testen:

```bash
uvicorn server:app --host 0.0.0.0 --port 8001
```

Wenn keine Fehler kommen, drücke `Ctrl + C` zum Stoppen.

### 10.8 Virtual Environment deaktivieren:

```bash
deactivate
```

---

## 11. Frontend einrichten

### 11.1 In den Frontend-Ordner wechseln:

```bash
cd ~/infometrica/frontend
```

### 11.2 Environment-Datei erstellen:

```bash
nano .env
```

Füge ein:

```env
REACT_APP_BACKEND_URL=https://deine-domain.de
```

Speichern: `Ctrl + X`, dann `Y`, dann `Enter`

### 11.3 Pakete installieren:

```bash
yarn install
```

Warte bis alles installiert ist (kann einige Minuten dauern).

### 11.4 Frontend für Produktion bauen:

```bash
yarn build
```

Warte bis der Build fertig ist. Du solltest einen `build` Ordner sehen.

### 11.5 Build überprüfen:

```bash
ls -la build
```

Du solltest Dateien wie `index.html`, `static` Ordner etc. sehen.

---

## 12. Nginx installieren

Nginx ist ein Webserver, der deine Anwendung im Internet bereitstellt.

### 12.1 Nginx installieren:

```bash
sudo apt install -y nginx
```

### 12.2 Nginx-Konfiguration erstellen:

```bash
sudo nano /etc/nginx/sites-available/infometrica
```

Füge folgenden Inhalt ein (ersetze `deine-domain.de`!):

```nginx
server {
    listen 80;
    server_name deine-domain.de www.deine-domain.de;

    # Frontend (React Build)
    location / {
        root /home/infometrica/infometrica/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Datei-Uploads erlauben (bis 50MB)
    client_max_body_size 50M;
}
```

Speichern: `Ctrl + X`, dann `Y`, dann `Enter`

### 12.3 Konfiguration aktivieren:

```bash
sudo ln -s /etc/nginx/sites-available/infometrica /etc/nginx/sites-enabled/
```

### 12.4 Standard-Konfiguration deaktivieren:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 12.5 Nginx-Konfiguration testen:

```bash
sudo nginx -t
```

Du solltest "syntax is ok" und "test is successful" sehen.

### 12.6 Nginx neu starten:

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 12.7 Berechtigungen setzen:

```bash
sudo chmod 755 /home/infometrica
sudo chmod -R 755 /home/infometrica/infometrica/frontend/build
```

---

## 13. SSL-Zertifikat einrichten

SSL sorgt dafür, dass deine Website über HTTPS erreichbar ist (sicher).

### 13.1 Certbot installieren:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 13.2 SSL-Zertifikat erstellen:

```bash
sudo certbot --nginx -d deine-domain.de -d www.deine-domain.de
```

Folge den Anweisungen:
1. E-Mail-Adresse eingeben
2. Nutzungsbedingungen akzeptieren (A)
3. Newsletter? (N)
4. Redirect HTTP zu HTTPS? Wähle **2** (Redirect)

### 13.3 Automatische Erneuerung testen:

```bash
sudo certbot renew --dry-run
```

Sollte ohne Fehler durchlaufen.

---

## 14. Autostart einrichten

Damit Backend und MongoDB automatisch starten, wenn der Server neu startet.

### 14.1 Systemd-Service für Backend erstellen:

```bash
sudo nano /etc/systemd/system/infometrica-backend.service
```

Füge ein:

```ini
[Unit]
Description=Infometrica Backend API
After=network.target mongod.service
Wants=mongod.service

[Service]
Type=simple
User=infometrica
Group=infometrica
WorkingDirectory=/home/infometrica/infometrica/backend
Environment="PATH=/home/infometrica/infometrica/backend/venv/bin"
ExecStart=/home/infometrica/infometrica/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Speichern: `Ctrl + X`, dann `Y`, dann `Enter`

### 14.2 Service aktivieren und starten:

```bash
sudo systemctl daemon-reload
sudo systemctl enable infometrica-backend
sudo systemctl start infometrica-backend
```

### 14.3 Status überprüfen:

```bash
sudo systemctl status infometrica-backend
```

Du solltest "active (running)" sehen. Drücke `q` zum Beenden.

---

## 15. Firewall einrichten

### 15.1 UFW aktivieren:

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Bei der Frage tippe `y`.

### 15.2 Status überprüfen:

```bash
sudo ufw status
```

Du solltest sehen:
- 22/tcp (SSH)
- Nginx Full (80 und 443)

---

## 16. Testen

### 16.1 Alle Services überprüfen:

```bash
# MongoDB
sudo systemctl status mongod

# Backend
sudo systemctl status infometrica-backend

# Nginx
sudo systemctl status nginx
```

Alle sollten "active (running)" zeigen.

### 16.2 Website im Browser öffnen:

Öffne deinen Browser und gehe zu:
- `https://deine-domain.de`

Du solltest die Infometrica-Startseite sehen!

### 16.3 Backend-API testen:

```bash
curl https://deine-domain.de/api/health
```

Sollte eine Antwort geben.

### 16.4 Admin-Login testen:

Gehe zu `https://deine-domain.de/admin/login` und logge dich ein.

---

## 17. Wartung

### Logs anschauen:

**Backend-Logs:**
```bash
sudo journalctl -u infometrica-backend -f
```
(Drücke `Ctrl + C` zum Beenden)

**Nginx-Logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**MongoDB-Logs:**
```bash
sudo tail -f /var/log/mongodb/mongod.log
```

### Backend neu starten:

```bash
sudo systemctl restart infometrica-backend
```

### Code aktualisieren:

```bash
cd ~/infometrica

# Wenn du Git benutzt:
git pull

# Backend aktualisieren:
cd backend
source venv/bin/activate
pip install -r requirements.txt
deactivate
sudo systemctl restart infometrica-backend

# Frontend aktualisieren:
cd ../frontend
yarn install
yarn build
sudo systemctl restart nginx
```

### Datenbank sichern:

```bash
mongodump --db infometrica_production --out ~/backups/$(date +%Y%m%d)
```

### Datenbank wiederherstellen:

```bash
mongorestore --db infometrica_production ~/backups/DATUM/infometrica_production
```

---

## 18. Fehlerbehebung

### Website zeigt "502 Bad Gateway":

Backend läuft nicht. Überprüfe:
```bash
sudo systemctl status infometrica-backend
sudo journalctl -u infometrica-backend --no-pager | tail -50
```

### Website zeigt "403 Forbidden":

Berechtigungsproblem:
```bash
sudo chmod 755 /home/infometrica
sudo chmod -R 755 /home/infometrica/infometrica/frontend/build
sudo systemctl restart nginx
```

### API-Anfragen funktionieren nicht:

CORS-Problem. Überprüfe die `.env` Datei im Backend:
```bash
nano ~/infometrica/backend/.env
```

Stelle sicher, dass `CORS_ORIGINS` deine Domain enthält.

### MongoDB startet nicht:

```bash
sudo systemctl status mongod
sudo journalctl -u mongod --no-pager | tail -50
```

### SSL-Zertifikat erneuern:

```bash
sudo certbot renew
```

### Server neu starten:

```bash
sudo reboot
```

(Du wirst disconnected - warte 1-2 Minuten und verbinde dich neu)

---

## Zusammenfassung der wichtigen Befehle

| Aktion | Befehl |
|--------|--------|
| Mit Server verbinden | `ssh infometrica@DEINE_IP` |
| Backend Status | `sudo systemctl status infometrica-backend` |
| Backend neu starten | `sudo systemctl restart infometrica-backend` |
| Backend Logs | `sudo journalctl -u infometrica-backend -f` |
| Nginx Status | `sudo systemctl status nginx` |
| Nginx neu starten | `sudo systemctl restart nginx` |
| MongoDB Status | `sudo systemctl status mongod` |
| SSL erneuern | `sudo certbot renew` |
| Server neu starten | `sudo reboot` |

---

## Sicherheitshinweise

1. **Ändere das Admin-Passwort** nach der ersten Anmeldung
2. **Regelmäßige Updates:** `sudo apt update && sudo apt upgrade`
3. **Regelmäßige Backups** der Datenbank
4. **SSH-Key verwenden** statt Passwort (sicherer)
5. **Fail2ban installieren** für zusätzlichen Schutz:
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

---

## 16. Proxy-Server einrichten

**Diese Sektion ist für dein Setup mit separatem Proxy-Server (precision.de)**

### Architektur:

```
Internet → precision.de (Proxy) → VPS-GnxrPFnC (Main Server)
           [Nginx + SSL]          [Backend + Frontend + MongoDB]
```

### 16.1 Main Server (VPS-GnxrPFnC) konfigurieren:

Der Main Server braucht keine SSL-Konfiguration, da der Proxy-Server das übernimmt.

**Nginx auf Main Server (`/etc/nginx/sites-available/infometrica`):**

```nginx
server {
    listen 80;
    server_name _;

    # Frontend (React Build)
    location / {
        root /home/infometrica/infometrica/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    client_max_body_size 50M;
}
```

### 16.2 Proxy Server (precision.de) konfigurieren:

**Verbinde dich mit dem Proxy Server:**
```bash
ssh root@PROXY_SERVER_IP
```

**Nginx installieren:**
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

**Nginx Konfiguration erstellen:**
```bash
sudo nano /etc/nginx/sites-available/precision-labs
```

**Füge ein (ersetze MAIN_SERVER_IP mit der IP von VPS-GnxrPFnC):**

```nginx
server {
    listen 80;
    server_name precision.de www.precision.de;

    location / {
        proxy_pass http://MAIN_SERVER_IP:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_connect_timeout 60;
        proxy_send_timeout 60;
    }

    client_max_body_size 50M;
}
```

**Aktivieren und testen:**
```bash
sudo ln -sf /etc/nginx/sites-available/precision-labs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 16.3 SSL auf Proxy Server einrichten:

```bash
sudo certbot --nginx -d precision.de -d www.precision.de
```

Wähle bei der Frage "redirect": **2** (Redirect HTTP to HTTPS)

### 16.4 Frontend .env anpassen (Main Server):

```bash
ssh infometrica@MAIN_SERVER_IP
nano ~/infometrica/frontend/.env
```

Ändere zu:
```
REACT_APP_BACKEND_URL=https://precision.de
```

**Frontend neu bauen:**
```bash
cd ~/infometrica/frontend && yarn build
```

### 16.5 Backend .env anpassen (Main Server):

```bash
nano ~/infometrica/backend/.env
```

Füge hinzu/ändere:
```
CORS_ORIGINS=https://precision.de,https://www.precision.de
FRONTEND_URL=https://precision.de
```

**Backend neu starten:**
```bash
sudo systemctl restart infometrica-backend
```

### 16.6 Firewall auf Main Server:

Erlaube nur Zugriff vom Proxy Server:

```bash
# Auf Main Server (VPS-GnxrPFnC):
sudo ufw allow from PROXY_SERVER_IP to any port 80
sudo ufw allow from PROXY_SERVER_IP to any port 8001
sudo ufw deny 80
sudo ufw deny 8001
sudo ufw reload
```

---

## 20. Update-Befehle

### Schnell-Update (alles in einem Befehl):

**Mit User wechseln und updaten:**
```bash
su - infometrica
cd ~/infometrica && git fetch --all && git reset --hard origin/main && cd frontend && yarn build && sudo chmod -R 755 ~/infometrica/frontend/build && sudo systemctl restart infometrica-backend && sudo systemctl restart nginx && echo "DONE"
```

### Einzelne Schritte:

```bash
# 1. Zum infometrica User wechseln
su - infometrica

# 2. Code aktualisieren
cd ~/infometrica
git fetch --all
git reset --hard origin/main

# 3. Frontend neu bauen
cd frontend
yarn install
yarn build

# 4. Berechtigungen setzen
sudo chmod -R 755 ~/infometrica/frontend/build

# 5. Services neu starten
sudo systemctl restart infometrica-backend
sudo systemctl restart nginx

# 6. Prüfen ob alles läuft
echo "=== Services ===" && sudo systemctl is-active mongod && sudo systemctl is-active infometrica-backend && sudo systemctl is-active nginx
```

### Status prüfen:

```bash
# Alle Services prüfen
echo "=== Services ===" && sudo systemctl is-active mongod && sudo systemctl is-active infometrica-backend && sudo systemctl is-active nginx && echo "" && echo "=== Backend API ===" && curl -s https://precision.de/api/ && echo "" && echo "=== ALL GOOD ==="
```

### Bei Problemen - Logs checken:

```bash
# Backend Logs
sudo journalctl -u infometrica-backend --no-pager | tail -50

# Nginx Logs
sudo tail -20 /var/log/nginx/error.log
```

---

## Kontakt & Support

Bei Fragen:
- Emergent Discord: https://discord.gg/emergent
- Emergent Support: support@emergentagent.com

---

*Letzte Aktualisierung: März 2026*
