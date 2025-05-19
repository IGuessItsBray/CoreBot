const express = require('express');
const router = express.Router();
const createLogger = require('../../../shared/utils/logger');
const logger = createLogger('SystemAPI');

const System = require('../../../shared/db/schemas/system');
const Proxy = require('../../../shared/db/schemas/member');
const Group = require('../../../shared/db/schemas/group');
const User = require('../../../shared/db/schemas/user');

// ========================
// GET: Self system (authenticated) or bot can fetch via ?systemId=
// ========================
router.get('/', async (req, res) => {
  try {
    if (req.user.discordId === 'bot' && req.query.systemId) {
      const system = await System.findOne({ id: req.query.systemId });
      if (!system) return res.status(404).json({ error: 'System not found' });
      return res.json(system);
    }

    const user = await User.findOne({ discordId: req.user.discordId });
    if (!user || !user.systemId) return res.status(404).json({ error: 'System not found for user' });

    const system = await System.findOne({ id: user.systemId });
    if (!system) return res.status(404).json({ error: 'System not found' });
    res.json(system);
  } catch (err) {
    logger.error('[GET /system] Error:', err);
    res.status(500).json({ error: 'Failed to fetch system' });
  }
});

// ========================
// GET: All systems (names and IDs)
// ========================
router.get('/all', async (req, res) => {
  try {
    const systems = await System.find().select('id name');
    res.json(systems);
  } catch (err) {
    logger.error('[GET /system/all] Error:', err);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
});

// ========================
// POST: Create new system
// ========================
router.post('/', async (req, res) => {
  try {
    const { name, description, avatar, banner } = req.body;

    const existingSystem = await System.findOne({ ownerId: req.user.discordId });
    if (existingSystem) return res.status(400).json({ error: 'You already have a system.' });

    const system = await System.create({
      ownerId: req.user.discordId,
      name,
      description,
      avatar,
      banner
    });

    const existingUser = await User.findOne({ discordId: req.user.discordId });
    if (!existingUser) {
      await User.create({ discordId: req.user.discordId, systemId: system.id });
    } else {
      existingUser.systemId = system.id;
      await existingUser.save();
    }

    res.status(201).json(system);
  } catch (err) {
    logger.error('[POST /system] Error:', err);
    res.status(500).json({ error: 'Failed to create system' });
  }
});

// ========================
// PUT: Update current system
// ========================
router.put('/', async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.user.discordId });
    if (!user || !user.systemId) return res.status(404).json({ error: 'System not found' });

    const updated = await System.findOneAndUpdate({ id: user.systemId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'System not found' });
    res.json(updated);
  } catch (err) {
    logger.error('[PUT /system] Error:', err);
    res.status(500).json({ error: 'Failed to update system' });
  }
});
// ========================
// PATCH /system/:systemId/autoproxy
// Bots only
// ========================
router.patch('/:systemId/autoproxy', async (req, res) => {
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden: Only bot may update autoproxy' });
  }

  const { systemId } = req.params;
  const { mode, memberId } = req.body;

  if (!['off', 'latch', 'member'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid autoproxy mode' });
  }

  try {
    const system = await System.findOne({ id: systemId });
    if (!system) return res.status(404).json({ error: 'System not found' });

    system.autoproxy = {
      mode,
      ...(mode === 'member' && memberId ? { memberId } : {}),
      ...(mode === 'latch' ? { lastUsedProxyId: memberId || system.lastUsedProxyId } : {})
    };

    await system.save();
    res.status(200).json(system);
  } catch (err) {
    logger.error('[PATCH /system/:systemId/autoproxy] Error:', err);
    res.status(500).json({ error: 'Failed to update autoproxy settings' });
  }
});
// PUT /system/:systemId – update system (bot only)
router.put('/:systemId', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  const system = await System.findOneAndUpdate({ id: req.params.systemId }, req.body, { new: true });
  if (!system) return res.status(404).json({ error: 'System not found' });
  res.json(system);
});

module.exports = router;