# 🛠️ CoreBot Configuration Guide

This guide walks you through setting up CoreBot using environment-specific JSON files.

Each environment (like `development` `production` etc.) should have its own config file in the `config/` directory:

```bash
/corebot/config/
├── configLoader.js
├── development.json
├── production.json
├── staging.json
├── config.example.json
```

*(for reference only)*

CoreBot uses `configLoader.js` to select the right file based on `NODE_ENV`

---

## ⚙️ configLoader.js

```js
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, `${env}.json`);

if (!fs.existsSync(configPath)) {
  throw new Error(`Missing config file for NODE_ENV=${env}`);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
module.exports = config;
```

---

## 🗂️ Grouped Config Keys

### 🔐 Authentication

| Key            | Description                      |
| -------------- | -------------------------------- |
| `clientId`     | Discord Bot Client ID            |
| `clientSecret` | Discord Client Secret            |
| `jwtSecret`    | JWT signing key                  |
| `token`        | Discord Bot Token (keep secret!) |

### 🔌 API & Dashboard

| Key                | Description                       |
| ------------------ | --------------------------------- |
| `apiURL`           | API root URL                      |
| `apiBaseUrl`       | Alias of `apiURL`, for client use |
| `apiPort`          | Port the API server runs on       |
| `redirect_uri`     | OAuth callback URL                |
| `dashboard_url`    | URL of the React dashboard app    |
| `dashboardBaseUrl` | Alias of `dashboard_url`          |

### 🗄️ Database

| Key             | Description                         |
| --------------- | ----------------------------------- |
| `mongoURI`      | MongoDB connection URI              |
| `directDBQuery` | If true, services query DB directly |

### 🧪 Development & Features

| Key             | Description                                  |
| --------------- | -------------------------------------------- |
| `devGuilds`     | Array of guild IDs for slash command testing |
| `dbLogging`     | Whether to log moderation to the database    |
| `exportVersion` | Version string for /export command           |

### 🖼️ CDN

| Key                  | Description                      |
| -------------------- | -------------------------------- |
| `cdnURL`             | URL used to fetch uploaded media |
| `cdn.port`           | Port used by the CDN service     |
| `cdn.uploadPath`     | Where to store uploaded files    |
| `cdn.baseUrl`        | Base URL for serving assets      |
| `cdn.routes.avatars` | Route name for avatars           |
| `cdn.routes.banners` | Route name for banners           |

### ⚠️ Sentry

| Key              | Description                    |
| ---------------- | ------------------------------ |
| `sentry.enabled` | Enable error logging to Sentry |
| `sentry.dsn`     | Sentry DSN (endpoint)          |

---

## 📌 Notes

* Never commit real tokens or secrets to version control.
* Use a `config.example.json` to show the structure safely.
* You can switch environments using:

```bash
NODE_ENV=production node app.js
```

* The bot and API both rely on this shared config.

---

## ✅ Example (Sanitized)

```json
{
  "mongoURI": "mongodb://localhost:27017/corebot",
  "directDBQuery": false,
  "dbLogging": true,
  "clientId": "YOUR_CLIENT_ID",
  "clientSecret": "YOUR_CLIENT_SECRET",
  "token": "YOUR_BOT_TOKEN",
  "apiURL": "http://localhost:3341",
  "dashboard_url": "http://localhost:5173",
  "devGuilds": ["YOUR_DEV_GUILD_ID"],
  "sentry": {
    "enabled": false,
    "dsn": "YOUR_SENTRY_DSN"
  },
  "cdn": {
    "port": 3342,
    "uploadPath": "./cdn/uploads",
    "baseUrl": "http://localhost:3342",
    "routes": {
      "avatars": "avatars",
      "banners": "banners"
    }
  }
}
```

---

For more help, visit the **Self-Hosting** or **API Docs** section.
