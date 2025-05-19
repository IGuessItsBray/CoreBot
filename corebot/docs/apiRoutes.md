
# 🧾 CoreBot API — User-Facing Route Documentation

This document describes all **user-facing** API routes for CoreBot, designed for logged-in Discord users.

---

## 🔐 Authorization: Logging in with Discord

1. Redirect to:
   ```
   https://discord.com/oauth2/authorize?client_id=955267092800733214&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3341%2Fauth%2Fcallback&scope=identify
   ```

2. After approval, Discord redirects to:
   ```
   http://localhost:3341/auth/callback?code=XXXX
   ```

3. The backend returns:
   ```json
   {
     "token": "<JWT>",
     "user": {
       "discordId": "...",
       "username": "...",
       "tag": "..."
     }
   }
   ```

4. Use this JWT in requests:
   ```
   Authorization: Bearer <JWT>
   ```

---

## ✅ Routes (Authenticated)

### 👤 GET `/user`
Get the currently authenticated user's data.

---

### 📎 POST `/user`
Create a user record.

**Body:**
```json
{
  "systemId": "G33GDB"
}
```

---

### 🧠 GET `/system`
Get the system belonging to the authenticated user.

---

### 🧠 POST `/system`
Create a system.

**Body:**
```json
{
  "name": "Test",
  "description": "...",
  "avatar": "https://...",
  "banner": "https://..."
}
```

---

### 🧠 PUT `/system`
Update your system.

---

### 👥 GET `/proxy/system`
Get all proxies for your system.

---

### 👤 GET `/proxy/:id`
Get a specific proxy by ID.

---

### 👤 POST `/proxy`
Create a proxy.

**Body:**
```json
{
  "name": "Bray",
  "display_name": "Bray 🔥",
  "proxyTags": ["B:"]
}
```

---

### 👤 PUT `/proxy/:id`
Edit a proxy.

---

### ❌ DELETE `/proxy/:id`
Delete a proxy.

---

### 📝 POST `/proxy/:id/log`
Log a proxied message.

**Body:**
```json
{
  "guild": "123",
  "channel": "456",
  "content": "hello",
  "timestamp": "...",
  "messageId": "...",
  "messageLink": "..."
}
```

---

### 👥 GET `/group/system/:systemId`
Get all groups for a system.

---

### 👥 GET `/group/:id`
Get a group.

---

### 👥 POST `/group`
Create a group.

**Body:**
```json
{
  "name": "Mods",
  "systemId": "G33GDB",
  "members": ["BRAY"]
}
```

---

### 👥 PUT `/group/:id`
Edit a group.

---

### 👥 DELETE `/group/:id`
Delete a group.

---

### 🆔 PATCH `/group/system/:systemId/groups/:groupId/setid`
Change a group’s ID.

**Body:**
```json
{
  "newId": "MODS"
}
```

---

## 🧭 Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user` | Get current user |
| POST | `/user` | Create user record |
| GET | `/system` | Get system |
| POST | `/system` | Create system |
| PUT | `/system` | Update system |
| GET | `/proxy/system` | All proxies |
| GET | `/proxy/:id` | Get proxy |
| POST | `/proxy` | Create proxy |
| PUT | `/proxy/:id` | Update proxy |
| DELETE | `/proxy/:id` | Delete proxy |
| POST | `/proxy/:id/log` | Log message |
| GET | `/group/system/:id` | System groups |
| GET | `/group/:id` | Get group |
| POST | `/group` | Create group |
| PUT | `/group/:id` | Update group |
| DELETE | `/group/:id` | Delete group |
| PATCH | `/group/.../setid` | Change group ID |
