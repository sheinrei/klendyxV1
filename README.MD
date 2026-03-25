# 🚀 Klendyx

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)

Klendyx est un gestionnaire d’emplois du temps conçu pour les professionnels et les particuliers.
Il permet de planifier, organiser et synchroniser facilement des rendez-vous avec plusieurs participants.

---

## ✨ Fonctionnalités

### 📅 Synchronisation des calendriers

* Google Calendar
* iCloud Calendar
* Outlook

### 🗓️ Gestion des rendez-vous

* Agenda interactif
* Création / modification / suppression de rendez-vous

### 🔔 Notifications

* Email
* SMS
* Rappels automatiques

### 📩 Propositions de rendez-vous

* Envoi au destinataire (email/SMS)
* Page dédiée pour accepter ou refuser
* Commentaire optionnel

### 🤝 Matching intelligent

* Recherche de créneaux communs
* Création automatique de rendez-vous multi-participants

---

## 🚀 Installation

```bash
git clone https://github.com/sheinrei/klendyxV1.git
cd klendyxV1
npm install
npm run dev
```

---

## ⚙️ Configuration

Créer un fichier `.env` à la racine du projet :

```env
# Sécurité
JWT_SECRET=
SECRET_KEY=

# API
OPENAI_API_KEY=

# Base de données
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_DIALECT=mariadb
DB_NAME=

# Serveur
PORT=3000
HOST=http://localhost:3000
ENV=dev

# Email
MAILER_USER=
MAILER_PASS=
BREVO_KEY=

# Paiement
STRIPE_SECRET_KEY=
WEBHOOK_SECRET=

# Téléphone
MY_PHONE=

# OAuth
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=

# Outlook
OUTLOOK_CLIENT_ID=
OUTLOOK_CLIENT_SECRET=
OUTLOOK_REDIRECT_URI=

# Sequelize (⚠️ attention)
SEQUELIZE_FORCE=false
SEQUELIZE_ALTER=false

# Message erreur
MESSAGE_ERREUR_SERVEUR=Une erreur est survenue...
```

---

## ▶️ Utilisation

Une fois lancé :

```
http://localhost:3000
```

---

## 🧪 Simulation CalDAV (iCloud)

Pour simuler iCloud et tester le protocole CalDAV, tu peux utiliser **Radicale**.

### Installation

```bash
pip install radicale
radicale
```

### Accès

```
http://localhost:5232
```

### Authentification

Créer un fichier `users` :

```
user:password123
```

---

## 🛠️ Stack technique

### Front-end

* HTML
* CSS
* JavaScript

**Librairies**

* FullCalendar
* jQuery
* Chart.js

---

### Back-end

* Node.js
* Express

**Calendriers & intégrations**

* googleapis → Google Calendar
* @azure/msal-node → Outlook
* caldav-client / dav / tsdav → iCloud

**Communication**

* nodemailer → Emails

**Sécurité**

* bcrypt
* cors
* crypto
* jsonwebtoken
* dotenv

**Backend**

* express → Routing
* cookie-parser → Cookies
* node-cron → Tâches planifiées

**Base de données**

* mariadb
* sequelize

**Utilitaires**

* uuid
* stripe

---

## 📁 Structure du projet

```
public/
├── css/
├── images/
├── js/
└── pageHtml/

src/
├── api/
├── middleware/
├── models/
├── route/
└── service/
```

---

## 📄 Licence

Ce projet est sous licence MIT.
