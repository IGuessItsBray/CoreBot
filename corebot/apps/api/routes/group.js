// /apps/api/routes/group.js (updated with nested /system/:systemId/groups support)
const express = require('express');
const router = express.Router({ mergeParams: true });
const Group = require('../../../shared/db/schemas/group');
const createLogger = require('../../../shared/utils/logger');
const verifyToken = require('../middleware/verifyToken');
const logger = createLogger('GroupAPI');

router.use(verifyToken);

// ========================
// GET all groups in a system (bot only)
// ========================
router.get('/', async (req, res) => {
  const { systemId } = req.params;
  if (!systemId) return res.status(400).json({ error: 'Missing systemId' });
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden: Only bot may use this route' });
  }
  try {
    const groups = await Group.find({ systemId });
    res.json(groups);
  } catch (err) {
    logger.error('[GET /system/:systemId/groups] Error:', err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// ========================
// POST create group in system
// ========================
router.post('/', async (req, res) => {
  const { systemId } = req.params;
  const { name, members, description, avatar, banner } = req.body;
  if (!systemId) return res.status(400).json({ error: 'Missing systemId' });
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden: Only bot may use this route' });

  try {
    const group = await Group.create({ name, members, systemId, description, avatar, banner });
    res.status(201).json(group);
  } catch (err) {
    logger.error('[POST /system/:systemId/groups] Error:', err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// ========================
// PUT update group
// ========================
router.put('/:groupId', async (req, res) => {
  const { groupId } = req.params;
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden: Only bot may use this route' });
  try {
    const updated = await Group.findOneAndUpdate({ id: groupId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Group not found' });
    res.json(updated);
  } catch (err) {
    logger.error('[PUT /system/:systemId/groups/:groupId] Error:', err);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

// ========================
// DELETE group
// ========================
router.delete('/:groupId', async (req, res) => {
  const { groupId } = req.params;
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden: Only bot may use this route' });
  try {
    const deleted = await Group.findOneAndDelete({ id: groupId });
    if (!deleted) return res.status(404).json({ error: 'Group not found' });
    res.json({ message: 'Group deleted' });
  } catch (err) {
    logger.error('[DELETE /system/:systemId/groups/:groupId] Error:', err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});
// PATCH /group/:groupId/add-member
// PATCH /group/:groupId/add-member
router.patch('/:groupId/add-member', async (req, res) => {
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { proxyId } = req.body;
  if (!proxyId) return res.status(400).json({ error: 'Missing proxyId' });

  const group = await Group.findOne({ id: req.params.groupId });
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (!group.members.includes(proxyId)) {
    group.members.push(proxyId);
    await group.save();
  }

  res.json(group);
});

// ========================
// PATCH set group ID
// ========================
router.patch('/:groupId/setid', async (req, res) => {
  const { systemId, groupId } = req.params;
  const { newId } = req.body;

  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden: Only bot may use this route' });
  }

  if (!/^[A-Z0-9]{2,9}$/.test(newId)) {
    return res.status(400).json({ error: 'Invalid ID format: must be 2–9 uppercase letters or digits' });
  }

  const existing = await Group.findOne({ id: newId });
  if (existing) return res.status(400).json({ error: 'ID already in use' });

  const group = await Group.findOneAndUpdate({ id: groupId }, { id: newId }, { new: true });
  if (!group) return res.status(404).json({ error: 'Group not found' });

  return res.json(group);
});
// PATCH /group/:groupId/add-member – bot only
router.patch('/:groupId/add-member', async (req, res) => {
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden: Only bot may use this route' });
  }

  const { proxyId } = req.body;
  if (!proxyId) return res.status(400).json({ error: 'Missing proxyId' });

  try {
    const group = await Group.findOne({ id: req.params.groupId });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!group.members.includes(proxyId)) {
      group.members.push(proxyId);
      await group.save();
    }

    res.json(group);
  } catch (err) {
    logger.error('[PATCH /group/:groupId/add-member] Error:', err);
    res.status(500).json({ error: 'Failed to add proxy to group' });
  }
});
// GET /group/:groupId – bot only
router.get('/:groupId', async (req, res) => {
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden: Only bot may use this route' });
  }

  try {
    const group = await Group.findOne({ id: req.params.groupId });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    logger.error('[GET /group/:groupId] Error:', err);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

module.exports = router;