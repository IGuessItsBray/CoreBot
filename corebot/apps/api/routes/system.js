const express = require('express');
const router = express.Router();
const createLogger = require('../../../shared/utils/logger');
const logger = createLogger('SystemAPI');

const System = require('../../../shared/db/schemas/system');
const Proxy = require('../../../shared/db/schemas/member'); // proxy = member schema
const Group = require('../../../shared/db/schemas/group');

// ========================
// SYSTEM ROUTES
// ========================

// POST /system - create a new system
router.post('/', async (req, res) => {
    try {
      const { ownerId, name, description, avatar, banner } = req.body;
  
      // Prevent multiple systems per user
      const existingSystem = await System.findOne({ ownerId });
      if (existingSystem) {
        return res.status(400).json({ error: 'You already have a system.' });
      }
  
      // Create system
      const system = await System.create({ ownerId, name, description, avatar, banner });
  
      // Create user if not exists
      const User = require('../../../shared/db/schemas/user');
      const existingUser = await User.findOne({ discordId: ownerId });
      if (!existingUser) {
        await User.create({ discordId: ownerId, systemId: system.id });
      }
  
      res.status(201).json(system);
    } catch (err) {
      logger.error('[POST /system] Error:', err);
      res.status(500).json({ error: 'Failed to create system' });
    }
  });

router.get('/:id', async (req, res) => {
  try {
    const system = await System.findOne({ id: req.params.id });
    if (!system) return res.status(404).json({ error: 'System not found' });
    res.json(system);
  } catch (err) {
    logger.error('[GET /system/:id] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve system' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await System.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'System not found' });
    res.json(updated);
  } catch (err) {
    logger.error('[PUT /system/:id] Error:', err);
    res.status(500).json({ error: 'Failed to update system' });
  }
});

// ========================
// PROXY (MEMBER) ROUTES
// ========================

router.post('/:id/proxies', async (req, res) => {
  try {
    const proxy = await Proxy.create({ ...req.body, systemId: req.params.id });
    res.status(201).json(proxy);
  } catch (err) {
    logger.error('[POST /system/:id/proxies] Error:', err);
    res.status(500).json({ error: 'Failed to create proxy' });
  }
});

router.get('/:id/proxies', async (req, res) => {
  try {
    const proxies = await Proxy.find({ systemId: req.params.id });
    res.json(proxies);
  } catch (err) {
    logger.error('[GET /system/:id/proxies] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve proxies' });
  }
});

router.put('/:systemId/proxies/:proxyId', async (req, res) => {
  try {
    const { systemId, proxyId } = req.params;

    const allProxies = await Proxy.find({ systemId });
    logger.debug(`[PUT Proxy] Proxies for system ${systemId}:`, allProxies.map(p => ({ id: p.id, name: p.name })));

    const proxy = await Proxy.findOne({ id: proxyId, systemId });
    if (!proxy) {
      return res.status(404).json({ error: 'Proxy not found' });
    }

    Object.assign(proxy, req.body);
    await proxy.save();

    return res.json(proxy);
  } catch (err) {
    logger.error('[PUT /system/:systemId/proxies/:proxyId] Error:', err);
    res.status(500).json({ error: 'Failed to update proxy' });
  }
});

router.delete('/:id/proxies/:proxyId', async (req, res) => {
  try {
    const deleted = await Proxy.findOneAndDelete({ id: req.params.proxyId, systemId: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Proxy not found' });
    res.json({ message: 'Proxy deleted' });
  } catch (err) {
    logger.error('[DELETE /system/:id/proxies/:proxyId] Error:', err);
    res.status(500).json({ error: 'Failed to delete proxy' });
  }
});

// ========================
// GROUP ROUTES
// ========================

router.post('/:id/groups', async (req, res) => {
  try {
    const group = await Group.create({ ...req.body, systemId: req.params.id });
    res.status(201).json(group);
  } catch (err) {
    logger.error('[POST /system/:id/groups] Error:', err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

router.get('/:id/groups', async (req, res) => {
  try {
    const groups = await Group.find({ systemId: req.params.id });
    res.json(groups);
  } catch (err) {
    logger.error('[GET /system/:id/groups] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve groups' });
  }
});

router.put('/:id/groups/:groupId', async (req, res) => {
  try {
    const updated = await Group.findOneAndUpdate(
      { id: req.params.groupId, systemId: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Group not found' });
    res.json(updated);
  } catch (err) {
    logger.error('[PUT /system/:id/groups/:groupId] Error:', err);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

router.delete('/:id/groups/:groupId', async (req, res) => {
  try {
    const deleted = await Group.findOneAndDelete({ id: req.params.groupId, systemId: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Group not found' });
    res.json({ message: 'Group deleted' });
  } catch (err) {
    logger.error('[DELETE /system/:id/groups/:groupId] Error:', err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

// PATCH /system/:id/setid
router.patch('/system/:id/setid', async (req, res) => {
  const { id } = req.params;
  const { newId } = req.body;

  if (!/^[A-Z0-9]{2,9}$/.test(newId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const existing = await System.findOne({ id: newId });
  if (existing) return res.status(400).json({ error: 'ID already in use' });

  const system = await System.findOneAndUpdate({ id }, { id: newId }, { new: true });
  if (!system) return res.status(404).json({ error: 'System not found' });

  return res.json(system);
});
router.patch('/:systemId/member/:proxyId/setid', async (req, res) => {
  const { proxyId } = req.params;
  const { newId } = req.body;

  if (!/^[A-Z0-9]{2,9}$/.test(newId)) {
    return res.status(400).json({ error: 'Invalid ID format: IDs must be 2–9 characters long and use only **uppercase letters (A-Z)** and digits (0–9).' });
  }

  const existing = await Proxy.findOne({ id: newId });
  if (existing) return res.status(400).json({ error: 'ID already in use' });

  const proxy = await Proxy.findOneAndUpdate({ id: proxyId }, { id: newId }, { new: true });
  if (!proxy) return res.status(404).json({ error: 'Proxy not found' });

  return res.json(proxy);
});
// GET /system - list all systems (for autocomplete)
router.get('/', async (req, res) => {
  try {
    const systems = await System.find().select('id name').lean();
    res.json(systems);
  } catch (err) {
    logger.error('[GET /system] Error:', err);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
});
module.exports = router;