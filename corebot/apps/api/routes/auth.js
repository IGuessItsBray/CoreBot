const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const jwt = require('jsonwebtoken');
const config = require('../../../config/configLoader');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../../../shared/db/schemas/user');
router.get('/login', (req, res) => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirect_uri,
    response_type: 'code',
    scope: 'identify guilds email',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});


router.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');

  try {
    // Step 1: Exchange code for token
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

let tokenData;
try {
  tokenData = JSON.parse(tokenText);
} catch (err) {
  throw new Error('Invalid JSON from Discord token exchange');
}

if (!tokenData.access_token) {
  return res.status(400).json({ error: tokenData.error_description || tokenData.error || 'No access token received' });
}

    // Step 2: Fetch Discord user
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json();

    // Step 3: Sign and return JWT
    // Step 3: Sign and redirect with JWT
const jwtToken = jwt.sign(
  {
    discordId: user.id,
    username: user.username,
    tag: `${user.username}#${user.discriminator}`,
  },
  config.jwtSecret,
  { expiresIn: '1h' }
);

// ✅ Redirect to dashboard, include token in query (or set as cookie if you'd rather)
res.redirect(`${config.dashboard_url}/callback?token=${jwtToken}`);

    res.json({ token: jwtToken });
  } catch (err) {
    console.error('[Auth] Callback error:', err);
    res.status(500).send('Authentication failed');
  }
});
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.user.discordId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.discordId,
      systemId: user.systemId,
      username: req.user.username,
      tag: req.user.tag
    });
  } catch (err) {
    console.error('[GET /auth/me] Error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});
module.exports = router;