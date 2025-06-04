const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const jwt = require('jsonwebtoken');
const config = require('../../../config/configLoader');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../../../shared/db/schemas/user');

// ========== In-memory cache ==========
const userGuildCache = new Map(); // discordId -> { data, timestamp }
let cachedBotGuilds = [];
let botCacheTime = 0;

// Discord login redirect
router.get('/login', (req, res) => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirect_uri,
    response_type: 'code',
    scope: 'identify guilds email',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

// OAuth2 callback
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirect_uri,
      }),
    });

    const tokenText = await tokenRes.text();
    console.error('[Token Exchange Response]', tokenText);
    let tokenData = JSON.parse(tokenText);
    if (!tokenData.access_token) {
      return res.status(400).json({ error: tokenData.error_description || tokenData.error || 'No access token received' });
    }

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json();

    const jwtToken = jwt.sign(
      {
        discordId: user.id,
        username: user.username,
        tag: `${user.username}#${user.discriminator}`,
        avatar: user.avatar,
        access_token: tokenData.access_token,
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    return res.redirect(`${config.dashboard_url}/callback?token=${jwtToken}`);
  } catch (err) {
    console.error('[Auth Callback Error]', err);
    if (!res.headersSent) res.status(500).send('Authentication failed');
  }
});

// Authenticated user info
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.user.discordId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: req.user.discordId || req.user.id,
      username: req.user.username,
      tag: req.user.tag,
      avatar: req.user.avatar,
      systemId: user?.systemId || null,
    });
  } catch (err) {
    console.error('[GET /auth/me] Error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Authenticated user's guilds + bot presence
router.get('/me/guilds', verifyToken, async (req, res) => {
  const token = req.user.access_token;
  const userId = req.user.discordId;
  const now = Date.now();

  if (!token) return res.status(400).json({ error: 'No Discord access token provided in JWT' });

  try {
    // ========== User guild caching ==========
    if (userGuildCache.has(userId)) {
      const { data, timestamp } = userGuildCache.get(userId);
      if (now - timestamp < 30000) {
        return res.json(data);
      }
    }

    const fetchWithRetry = async (url, headers) => {
      const res = await fetch(url, { headers });
      if (res.status === 429) {
        const body = await res.json();
        const delay = Math.ceil(body.retry_after * 1000);
        console.warn(`[RATE LIMIT] Retrying ${url} after ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
        return fetch(url, { headers }); // one retry only
      }
      return res;
    };

    // ========== Fetch user guilds ==========
    const userRes = await fetchWithRetry('https://discord.com/api/v10/users/@me/guilds', {
      Authorization: `Bearer ${token}`,
    });
    if (!userRes.ok) {
      const text = await userRes.text();
      console.error('[Discord Guilds Error]', text);
      return res.status(userRes.status).json({ error: 'Failed to fetch user guilds from Discord' });
    }
    const userGuilds = await userRes.json();

    // ========== Fetch bot guilds w/ 5s cache ==========
    let botGuilds = [];
    if (now - botCacheTime > 5000) {
      const botRes = await fetchWithRetry('https://discord.com/api/v10/users/@me/guilds', {
        Authorization: `Bot ${config.token}`,
      });

      if (botRes.ok) {
        botGuilds = await botRes.json();
        cachedBotGuilds = botGuilds;
        botCacheTime = now;
      } else {
        const errText = await botRes.text();
        console.warn('[Bot Guilds Warning]', botRes.status, errText);
      }
    } else {
      botGuilds = cachedBotGuilds;
    }

    const botGuildIds = new Set(botGuilds.map((g) => g.id));

    const merged = userGuilds.map((g) => ({
      ...g,
      botIn: botGuildIds.has(g.id),
    }));

    // cache result
    userGuildCache.set(userId, { data: merged, timestamp: now });

    res.json(merged);
  } catch (err) {
    console.error('[GET /auth/me/guilds] Error:', err);
    res.status(500).json({ error: 'Failed to fetch user guilds' });
  }
});

module.exports = router;