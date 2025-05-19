const express = require('express');
const User = require('../../../shared/db/schemas/user');
const router = express.Router();

// ==============================
// GET /user → fetch current authenticated user
// ==============================
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.user.discordId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('[GET /user] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==============================
// GET /user/:id → fetch by Discord ID (bot only)
// ==============================
router.get('/:id', async (req, res) => {
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden: Only bot may access this route' });
  }

  try {
    const user = await User.findOne({ discordId: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('[GET /user/:id] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==============================
// POST /user → create user (bot or user)
// ==============================
router.post('/', async (req, res) => {
  try {
    const discordId = req.user.discordId === 'bot' ? req.body.discordId : req.user.discordId;
    const { systemId } = req.body;

    if (!discordId || !systemId) {
      return res.status(400).json({ error: 'discordId and systemId are required' });
    }

    const existing = await User.findOne({ discordId });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({
      discordId,
      systemId,
      preferences: {
        autoproxy: true,
        lastUsedMemberId: null
      }
    });

    res.json(user);
  } catch (err) {
    console.error('[POST /user] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;