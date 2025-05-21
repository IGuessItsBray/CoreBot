# CoreBot Configuration Reference

This document describes all available options in the `config.json` file used to configure CoreBot. It is written in JSON format.

---

## Required Fields

### `mongoURI`

* **Type:** `string`
* **Required:** Yes
* **Description:** URI of the MongoDB server that CoreBot uses to store system, member, and group data.
* **Example:** `"mongodb://192.168.2.27:27017/"`

### `token`

* **Type:** `string`
* **Required:** Yes
* **Description:** Discord bot token used to authenticate with the Discord API.

### `clientId`

* **Type:** `string`
* **Required:** Yes
* **Description:** Discord application's client ID.

### `clientSecret`

* **Type:** `string`
* **Required:** Yes
* **Description:** Discord application's client secret used for OAuth2 flows.

### `apiBaseUrl`

* **Type:** `string`
* **Required:** Yes
* **Description:** Base URL where the CoreBot API is accessible (used by the bot and dashboard).

### `apiPort`

* **Type:** `number`
* **Required:** Yes
* **Description:** Port CoreBot API listens on.

### `jwtSecret`

* **Type:** `string`
* **Required:** Yes
* **Description:** Secret used to sign JWT tokens for dashboard authentication.

---

## Optional Fields

### `directDBQuery`

* **Type:** `boolean`
* **Default:** `false`
* **Description:** If true, services directly query the MongoDB database. If false, they use the API.

### `dbLogging`

* **Type:** `boolean`
* **Default:** `true`
* **Description:** Whether to log message counts and logs to the database.

### `cdnURL`

* **Type:** `string`
* **Description:** The URL for accessing uploaded images/avatars through the CDN or image service.

### `apiURL`

* **Type:** `string`
* **Description:** Public-facing URL of the API for external tools or integrations.

### `exportVersion`

* **Type:** `string`
* **Default:** `"4"`
* **Description:** Version label to embed in exported data files.

### `redirect_uri`

* **Type:** `string`
* **Description:** Redirect URI for Discord OAuth2 flow used by the dashboard.

### `dashboard_url` / `dashboardBaseUrl`

* **Type:** `string`
* **Description:** Base URL of the CoreBot dashboard. Used for CORS validation and redirects.

### `botAPIToken`

* **Type:** `string`
* **Description:** JWT token identifying the bot to the API. Should represent `{ discordId: "bot" }`.

### `devGuilds`

* **Type:** `string[]`
* **Description:** List of Discord guild IDs where private/test commands are registered.

### `sentry`

* **Type:** `object`

  * `enabled`: `boolean` – Enables or disables Sentry error tracking.
  * `dsn`: `string` – The Sentry DSN key.
* **Default:** `{ enabled: false, dsn: "" }`
* **Description:** Optional integration for tracking errors with Sentry.

---

## Notes

* You **must** include a valid `mongoURI` and `token` or the bot will fail to start.
* The `dashboard_url` and `redirect_uri` must be registered in your Discord developer portal OAuth2 settings.
* Avoid committing this file to public repositories, especially if it includes real secrets.

---

## Example

```json
{
  "directDBQuery": false,
  "dbLogging": true,
  "mongoURI": "mongodb://localhost:27017/",
  "cdnURL": "http://localhost:3341",
  "apiURL": "http://localhost:3000",
  "token": "your-discord-token",
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "apiBaseUrl": "http://localhost:3341",
  "apiPort": 3341,
  "jwtSecret": "your-jwt-secret",
  "exportVersion": "4",
  "redirect_uri": "http://localhost:3341/auth/callback",
  "dashboard_url": "http://localhost:5173",
  "dashboardBaseUrl": "http://localhost:5173",
  "botAPIToken": "your-bot-api-token",
  "devGuilds": ["123456789012345678"],
  "sentry": {
    "enabled": false,
    "dsn": "https://examplePublicKey@o0.ingest.sentry.io/0"
  }
}
```
