# Example cURL Commands for CoreBot API

> Using:
>
> * **System ID**: `FIREFOX`
> * **Proxy ID**: `FOX`
> * **Group ID**: `NERDZ`
> * **User ID**: `18002672001`
> * **JWT Token**: `eyJhbGciOi...pretend.token...1234`

Set up the token (optional):

```bash
export TOKEN="eyJhbGciOi...pretend.token...1234"
```

---

### 🔎 Get System Info

```bash
curl -s -X GET https://api.corebot.io/system/FIREFOX \
  -H "Authorization: Bearer $TOKEN"
```

---

### 🆕 Create a New System

```bash
curl -X POST https://api.corebot.io/system \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Firefox System"}'
```

---

### 🔧 Update Autoproxy Settings

```bash
curl -X PATCH https://api.corebot.io/system/FIREFOX/autoproxy \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode": "member", "memberId": "FOX"}'
```

---

### 👥 Create a New Proxy (Member)

```bash
curl -X POST https://api.corebot.io/system/FIREFOX/proxies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "FOX",
    "name": "Firefox",
    "avatar": "https://example.com/firefox.jpg",
    "tags": ["F/", "Fox:"]
  }'
```

---

### 📜 Get Proxy Details

```bash
curl -s https://api.corebot.io/system/FIREFOX/proxies/FOX \
  -H "Authorization: Bearer $TOKEN"
```

---

### ✏️ Edit Proxy Info

```bash
curl -X PATCH https://api.corebot.io/system/FIREFOX/proxies/FOX \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "The fiery fox proxy."}'
```

---

### 🗑 Delete Proxy

```bash
curl -X DELETE https://api.corebot.io/system/FIREFOX/proxies/FOX \
  -H "Authorization: Bearer $TOKEN"
```

---

### ➕ Create a Group

```bash
curl -X POST https://api.corebot.io/system/FIREFOX/groups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "NERDZ",
    "name": "Cool Nerds"
  }'
```
