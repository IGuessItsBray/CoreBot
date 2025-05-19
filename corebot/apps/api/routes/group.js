const express = require('express');
const router = express.Router();
const Group = require('../../../shared/db/schemas/group');
const createLogger = require('../../../shared/utils/logger');
const verifyToken = require('../middleware/verifyToken');
const logger = createLogger('GroupAPI');

router.use(verifyToken);

// ========================
// GET /group/:id
// ========================
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findOne({ id: req.params.id });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    logger.error('[GET /group/:id] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========================
// GET /group/system/:systemId
// Only bots can access arbitrary systemId
// ========================
router.get('/system/:systemId', async (req, res) => {
  try {
    if (req.user.discordId !== 'bot') {
      return res.status(403).json({ error: 'Forbidden: Only bot may use this route' });
    }
    const groups = await Group.find({ systemId: req.params.systemId });
    res.json(groups);
  } catch (err) {
    logger.error('[GET /group/system/:systemId] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========================
// POST /group
// Bots must specify systemId
// ========================
router.post('/', async (req, res) => {
  try {
    const { name, members } = req.body;
    const systemId = req.user.discordId === 'bot' ? req.body.systemId : req.user.systemId;

    if (!systemId) {
      return res.status(400).json({ error: 'Missing systemId' });
    }

    const group = await Group.create({ name, systemId, members });
    res.status(201).json(group);
  } catch (err) {
    logger.error('[POST /group] Error:', err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// ========================
// PUT /group/:id
// ========================
router.put('/:id', async (req, res) => {
  try {
    const updated = await Group.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Group not found' });
    res.json(updated);
  } catch (err) {
    logger.error('[PUT /group/:id] Error:', err);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

// ========================
// DELETE /group/:id
// ========================
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Group.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Group not found' });
    res.json({ message: 'Group deleted' });
  } catch (err) {
    logger.error('[DELETE /group/:id] Error:', err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

// ========================
// PATCH /system/:systemId/groups/:groupId/setid
// Bot only
// ========================
router.patch('/system/:systemId/groups/:groupId/setid', async (req, res) => {
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden: Only bot may use this route' });
  }

  const { groupId } = req.params;
  const { newId } = req.body;

  if (!/^[A-Z0-9]{2,9}$/.test(newId)) {
    return res.status(400).json({ error: 'Invalid ID format: must be 2–9 uppercase letters or digits' });
  }

  const existing = await Group.findOne({ id: newId });
  if (existing) return res.status(400).json({ error: 'ID already in use' });

  const group = await Group.findOneAndUpdate({ id: groupId }, { id: newId }, { new: true });
  if (!group) return res.status(404).json({ error: 'Group not found' });

  return res.json(group);
});

module.exports = router;