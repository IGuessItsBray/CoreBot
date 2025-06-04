# 🛠️ Self-Hosting CoreBot – Quick Start Guide

> ⚠️ You are hosting CoreBot on your own infrastructure. Ensure MongoDB is already installed and accessible before proceeding.

---

## 📦 Project Structure

CoreBot is split into the following major services:

| Service               | Path              | Description                                        |
| --------------------- | ----------------- | -------------------------------------------------- |
| API                   | `apps/api`        | REST API for interacting with CoreBot data         |
| Gateway               | `apps/gateway`    | Handles Discord message intake and proxying        |
| Bot                   | `apps/bot`        | Discord slash commands, mod tools, and automations |
| Dashboard             | `apps/dashboard`  | Web UI for configuration and status                |
| Hypervisor (Optional) | `apps/hypervisor` | TUI launcher for managing services                 |

---

## 🧾 Requirements

* **Node.js** v18 or later
* **MongoDB** (local or remote)
* [Git](https://git-scm.com/) + a working terminal
* Optionally: [PM2](https://pm2.io/) or Docker (manual start supported)

---

## 📂 Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-org/corebot.git
   cd corebot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up your config**
   Each app reads from a config file at `config/<env>.json`, usually `development.json`.

   * To learn how to configure CoreBot, see [Configuration Docs](#/docs/config).
   * Ensure the following keys are set:

     * `mongoURI`
     * `jwtSecret`
     * `apiBaseUrl`, etc.
     * `botAPIToken` (see below)

---

## 🔐 Generating the Bot API Token

To allow the bot to communicate with the API as a superuser, you must generate a special JWT token.

Here’s a Node.js script you can run once:

```js
// generateBotToken.js
const jwt = require('jsonwebtoken');

const payload = {
  discordId: 'bot',
  username: 'CoreBot',
  tag: 'corebot@0',
};
const secret = 'your-jwt-secret-here'; // Match jwtSecret in your config

const token = jwt.sign(payload, secret, { expiresIn: '10y' });
console.log('Bot API Token:', token);
```

Run it with:

```bash
node generateBotToken.js
```

Copy the output token and paste it into your `config.development.json` under `"botAPIToken"`.

---

## ✨ First Run Checklist

* ✅ MongoDB is up and reachable
* ✅ `development.json` is populated (see [Config Docs](#/docs/config))
* ✅ `botAPIToken` is generated and added
* ✅ You've run `npm install` at the root

---

## 🧠 Starting the Apps

You can run services manually or using the TUI launcher.

### Option 1: Manual Start

```bash
node apps/api
node apps/gateway
node apps/bot
npm run dev --prefix apps/dashboard
```

> 💡 Use `tmux`, `screen`, or run in background if needed

### Option 2: Hypervisor (TUI)

```bash
node apps/hypervisor
```

The Hypervisor lets you:

* Select services to start
* View logs and metrics
* Use keyboard shortcuts

---

## 🎉 Done!

You’re now running CoreBot locally.

* Visit your Dashboard: `http://localhost:5173`
* Make sure all services are up
* Check `http://localhost:3341/status` for incident/health info
