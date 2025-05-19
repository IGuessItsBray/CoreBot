const express = require('express');
const router = express.Router();
const Member = require('../../../shared/db/schemas/member');
const Group = require('../../../shared/db/schemas/group');
const createLogger = require('../../../shared/utils/logger');
const verifyToken = require('../middleware/verifyToken');
const logger = createLogger('ProxyAPI');

// Middleware to protect routes
router.use(verifyToken);

// ========================
// GET: Groups a member is in
// ========================
router.get('/:id/groups', async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.id }).select('id name');
    res.json(groups);
  } catch (err) {
    logger.error('[GET /proxy/:id/groups] Error:', err);
    res.status(500).json({ error: 'Failed to fetch groups for proxy' });
  }
});

// ========================
// CRUD for Proxies
// ========================

// GET /proxy/system - fetch all proxies for current user's system
router.get('/system', async (req, res) => {
  try {
    const members = await Member.find({ systemId: req.user.systemId });
    res.json(members);
  } catch (err) {
    logger.error('[GET /proxy/system] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /proxy/:id - fetch single proxy
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findOne({ id: req.params.id });
    if (!member) return res.status(404).json({ error: 'Proxy not found' });
    res.json(member);
  } catch (err) {
    logger.error('[GET /proxy/:id] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /proxy - create a new proxy
router.post('/', async (req, res) => {
  try {
    const member = await Member.create({ ...req.body, systemId: req.user.systemId });
    res.status(201).json(member);
  } catch (err) {
    logger.error('[POST /proxy] Error:', err);
    res.status(500).json({ error: 'Failed to create proxy' });
  }
});

// PUT /proxy/:id - update an existing proxy
router.put('/:id', async (req, res) => {
  try {
    const updated = await Member.findOneAndUpdate({ id: req.params.id, systemId: req.user.systemId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Proxy not found' });
    res.json(updated);
  } catch (err) {
    logger.error('[PUT /proxy/:id] Error:', err);
    res.status(500).json({ error: 'Failed to update proxy' });
  }
});

// DELETE /proxy/:id - remove a proxy
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Member.findOneAndDelete({ id: req.params.id, systemId: req.user.systemId });
    if (!deleted) return res.status(404).json({ error: 'Proxy not found' });
    res.json({ message: 'Proxy deleted' });
  } catch (err) {
    logger.error('[DELETE /proxy/:id] Error:', err);
    res.status(500).json({ error: 'Failed to delete proxy' });
  }
});

// ========================
// Logging
// ========================

// POST /proxy/:id/log - log a proxied message
router.post('/:id/log', async (req, res) => {
  const { guild, channel, content, timestamp, messageId, messageLink } = req.body;

  if (!guild || !channel || !content) {
    return res.status(400).json({ error: 'Missing required fields (guild, channel, content)' });
  }

  try {
    const member = await Member.findOne({ id: req.params.id, systemId: req.user.systemId });
    if (!member) return res.status(404).json({ error: 'Proxy not found' });

    member.messageCount = (member.messageCount || 0) + 1;
    member.characterCount = (member.characterCount || 0) + content.length;

    let guildLog = member.guildLogs.find(g => g.guildId === guild);
    if (!guildLog) {
      guildLog = { guildId: guild, messages: [] };
      member.guildLogs.push(guildLog);
    }

    guildLog.messages.push({
      guild,
      channel,
      content,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      messageId,
      messageLink
    });

    await member.save();
    res.status(201).json({ success: true });
  } catch (err) {
    logger.error('[POST /proxy/:id/log] Error:', err);
    res.status(500).json({ error: 'Failed to log message' });
  }
});
// GET /proxy/system/:systemId - get all proxies in a system
router.get('/system/:systemId', async (req, res) => {
  try {
    const proxies = await Member.find({ systemId: req.params.systemId });
    res.json(proxies);
  } catch (err) {
    logger.error('[GET /proxy/system/:systemId] Error:', err);
    res.status(500).json({ error: 'Failed to fetch proxies for system' });
  }
});

module.exports = router;
