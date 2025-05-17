const express = require('express');
const User = require('../../../shared/db/schemas/user');
const router = express.Router();

// GET /user/:discordId
router.get('/:discordId', async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.params.discordId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('[GET /user/:id] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /user
router.post('/', async (req, res) => {
  try {
    const { discordId, systemId } = req.body;
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