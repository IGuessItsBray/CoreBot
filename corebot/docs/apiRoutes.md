# CoreBot API Documentation

This document outlines all routes in the CoreBot API and their respective methods, authentication scopes, and functionality.

---

## 🔐 Authentication

All protected routes require a `Bearer` token in the `Authorization` header.

* If `discordId === 'bot'`, the request is treated as coming from the bot.
* Otherwise, the token must be a valid user token.

---

## 🧑‍💼 `/user` Routes

### `GET /user`

**Auth:** User or Bot
Returns the currently authenticated user (based on token).

### `GET /user/:id`

**Auth:** Bot only
Fetch user data by Discord ID.

### `POST /user`

**Auth:** User or Bot
Create a user. If bot, `discordId` must be provided in the body. Requires `systemId`.

---

## 👤 `/proxy` Routes (Member Proxies)

### `GET /proxy/:id`

**Auth:** Any
Fetch a proxy by ID.

### `PUT /proxy/:id`

**Auth:** Must own the proxy
Update a proxy's data.

### `DELETE /proxy/:id`

**Auth:** Must own the proxy
Delete a proxy.

---

## 📚 `/group` Routes

### `GET /group/:id`

**Auth:** Any
Get group info by ID.

### `POST /group`

**Auth:** User with system
Create a group for the current user.

### `PUT /group/:id`

**Auth:** Must own the group
Update a group.

### `DELETE /group/:id`

**Auth:** Must own the group
Delete a group.

### `PATCH /group/:groupId/add-member`

**Auth:** Bot only
Add a member to a group. Body: `{ proxyId }`

### `PATCH /group/:groupId/remove-member`

**Auth:** Bot only
Remove a member from a group. Body: `{ proxyId }`

---

## 🏠 `/system` Routes (General)

### `GET /system/:systemId`

**Auth:** Bot only
Fetch a system by ID.

### `PATCH /system/:systemId/autoproxy`

**Auth:** Must own system
Update autoproxy settings. Body: `{ mode, lastUsedProxyId }`

---

## 🔧 Bot-Only `/system/:systemId/proxies` Routes

These routes exist under the base path `/system` and are **bot-only**:

### `POST /system/:systemId/proxies`

Create a new proxy in a system.

### `GET /system/:systemId/proxies`

Fetch all proxies in a system.

### `PUT /system/:systemId/proxies/:proxyId`

Update an existing proxy.

### `DELETE /system/:systemId/proxies/:proxyId`

Delete a proxy.

---

## 📁 `/auth` Routes

Public login, Discord OAuth2, and callback endpoints (defined in `auth.js`).

Not documented here — handled separately as part of the frontend OAuth2 flow.

---

## ✅ `/health`

Returns `{ status: 'ok', uptime: ... }` to confirm server is alive.
