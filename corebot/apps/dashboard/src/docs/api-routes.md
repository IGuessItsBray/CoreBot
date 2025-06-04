# CoreBot API Reference

Base URL: `https://api.corebot.io`

---

## Authentication

All routes require authentication via a Bearer token (JWT). You must include:

```http
Authorization: Bearer <token>
```

There is one superuser token (used by the bot) and one per user.
Bot-only routes are marked accordingly and **must not be used by third parties**.

---

## System Routes

### `GET /system/:id`

Returns full system data, including members and groups.

* Auth: Bot or matching user

### `POST /system`

Creates a system.

* Auth: User

### `PATCH /system/:id`

Updates system name, avatar, etc.

* Auth: Matching user or bot

### `PATCH /system/:id/autoproxy`

Sets autoproxy for a system.

* Body: `{ mode: 'member' | 'front' | 'off', memberId?: string }`
* Auth: Matching user or bot

---

## Member (Proxy) Routes

### `GET /system/:id/proxies`

List all members in the system.

* Auth: Bot or matching user

### `POST /system/:id/proxies`

Create a new member (proxy).

* Auth: Bot or matching user

### `GET /system/:id/proxies/:proxyId`

Get a single proxy by ID.

* Auth: Bot or matching user

### `PATCH /system/:id/proxies/:proxyId`

Update proxy info.

* Auth: Bot or matching user

### `DELETE /system/:id/proxies/:proxyId`

Delete a proxy.

* Auth: Bot or matching user

---

## Group Routes

### `GET /system/:id/groups`

Returns all groups.

* Auth: Bot or matching user

### `POST /system/:id/groups`

Create a group.

* Auth: Bot or matching user

### `PATCH /group/:id`

Update group info.

* Auth: Bot or matching user

### `DELETE /group/:id`

Delete a group.

* Auth: Bot or matching user

### `PATCH /group/:id/add-member`

Add a proxy to a group.

* Auth: Bot or matching user

### `PATCH /group/:id/remove-member`

Remove a proxy from a group.

* Auth: Bot or matching user

---

## User Routes

### `GET /user/@me`

Returns the user object for the currently logged-in user.

* Auth: User

---

## Auth Routes

### `GET /auth/login`

Redirects to Discord OAuth2.

### `GET /auth/callback`

OAuth2 handler. Returns a signed JWT.

### `GET /auth/me`

Returns the currently authenticated user.

* Auth: Any (user or bot)

---

## Status & Infra Routes

### `GET /status/reports`

Latency checks by service.

* Auth: Bot only

### `GET /status/incidents/active`

Active incidents.

* Auth: Bot only

### `GET /status/incidents/all`

All incidents.

* Auth: Bot only

### `POST /status/incident`

Create a new incident.

* Auth: Bot only

### `PATCH /status/incident/:id/resolve`

Mark an incident as resolved.

* Auth: Bot only

---

## Notes

* All generated IDs (system, member, group) are 6-character alphanumeric.
* Custom IDs (set via `/setid`) can be any 2–9 char string.
* There are no hard limits on proxies, groups, or message logs.
* Avatar/banner URLs can be any valid link.

---

See [Config Docs](../config.md) for setup instructions.
