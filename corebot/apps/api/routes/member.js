// /apps/api/routes/member.js
const express = require('express');
const router = express.Router();
const Member = require('../../../shared/db/schemas/member');
const Group = require('../../../shared/db/schemas/group');
const createLogger = require('../../../shared/utils/logger');
const verifyToken = require('../middleware/verifyToken');
const logger = createLogger('ProxyAPI');

// Middleware
router.use(verifyToken);

// ========================
// GET: Groups a proxy is in
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

// GET: All proxies in current user's system
router.get('/system', async (req, res) => {
  try {
    const proxies = await Member.find({ systemId: req.user.systemId });
    res.json(proxies);
  } catch (err) {
    logger.error('[GET /proxy/system] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET: All proxies in specified system (bot only)
router.get('/system/:systemId', async (req, res) => {
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Only bot can access this endpoint' });
  }
  try {
    const proxies = await Member.find({ systemId: req.params.systemId });
    res.json(proxies);
  } catch (err) {
    logger.error('[GET /proxy/system/:systemId] Error:', err);
    res.status(500).json({ error: 'Failed to fetch proxies for system' });
  }
});

// GET: Single proxy by ID
router.get('/:id', async (req, res) => {
  try {
    const proxy = await Member.findOne({ id: req.params.id });
    if (!proxy) return res.status(404).json({ error: 'Proxy not found' });
    res.json(proxy);
  } catch (err) {
    logger.error('[GET /proxy/:id] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST: Create a new proxy in user's system
router.post('/', async (req, res) => {
  try {
    const { proxyTags, ...rest } = req.body;
    const newProxy = {
      ...rest,
      systemId: req.user.systemId,
      proxyTags: {
        prefix: Array.isArray(proxyTags?.prefix) ? proxyTags.prefix : [],
        suffix: Array.isArray(proxyTags?.suffix) ? proxyTags.suffix : [],
      },
    };
    const proxy = await Member.create(newProxy);
    res.status(201).json(proxy);
  } catch (err) {
    logger.error('[POST /proxy] Error:', err);
    res.status(500).json({ error: 'Failed to create proxy' });
  }
});

// PUT: Update an existing proxy (must belong to user)
router.put('/:id', async (req, res) => {
  try {
    const { proxyTags, ...rest } = req.body;
    const updateData = {
      ...rest,
    };
    if (proxyTags) {
      updateData.proxyTags = {
        prefix: Array.isArray(proxyTags.prefix) ? proxyTags.prefix : [],
        suffix: Array.isArray(proxyTags.suffix) ? proxyTags.suffix : [],
      };
    }
    const updated = await Member.findOneAndUpdate(
      { id: req.params.id, systemId: req.user.systemId },
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Proxy not found' });
    res.json(updated);
  } catch (err) {
    logger.error('[PUT /proxy/:id] Error:', err);
    res.status(500).json({ error: 'Failed to update proxy' });
  }
});

// DELETE: Delete a proxy from user's system
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

// POST: Log a message to a proxy (must belong to user unless bot)
router.post('/:id/log', async (req, res) => {
  const { guild, channel, content, timestamp, messageId, messageLink } = req.body;
  if (!guild || !channel || !content) {
    return res.status(400).json({ error: 'Missing required fields (guild, channel, content)' });
  }
  try {
    const query = req.user.discordId === 'bot'
      ? { id: req.params.id }
      : { id: req.params.id, systemId: req.user.systemId };

    const proxy = await Member.findOne(query);
    if (!proxy) return res.status(404).json({ error: 'Proxy not found' });

    proxy.messageCount = (proxy.messageCount || 0) + 1;
    proxy.characterCount = (proxy.characterCount || 0) + content.length;

    let guildLog = proxy.guildLogs.find(g => g.guildId === guild);
    if (!guildLog) {
      guildLog = { guildId: guild, messages: [] };
      proxy.guildLogs.push(guildLog);
    }

    guildLog.messages.push({
      guild,
      channel,
      content,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      messageId,
      messageLink,
    });

    await proxy.save();
    res.status(201).json({ success: true });
  } catch (err) {
    logger.error('[POST /proxy/:id/log] Error:', err);
    res.status(500).json({ error: 'Failed to log message' });
  }
});

// POST /system/:systemId/proxies – create proxy (bot only)
router.post('/system/:systemId/proxies', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  const { proxyTags, ...rest } = req.body;
  const proxy = await Member.create({
    ...rest,
    systemId: req.params.systemId,
    proxyTags: {
      prefix: Array.isArray(proxyTags?.prefix) ? proxyTags.prefix : [],
      suffix: Array.isArray(proxyTags?.suffix) ? proxyTags.suffix : [],
    },
  });
  res.status(201).json(proxy);
});

// PUT /system/:systemId/proxies/:proxyId – update proxy (bot only)
router.put('/system/:systemId/proxies/:proxyId', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  const { proxyTags, ...rest } = req.body;
  const updateData = {
    ...rest,
  };
  if (proxyTags) {
    updateData.proxyTags = {
      prefix: Array.isArray(proxyTags.prefix) ? proxyTags.prefix : [],
      suffix: Array.isArray(proxyTags.suffix) ? proxyTags.suffix : [],
    };
  }
  const updated = await Member.findOneAndUpdate(
    { id: req.params.proxyId, systemId: req.params.systemId },
    updateData,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Proxy not found' });
  res.json(updated);
});

// DELETE /system/:systemId/proxies/:proxyId – delete proxy (bot only)
router.delete('/system/:systemId/proxies/:proxyId', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  const deleted = await Member.findOneAndDelete({
    id: req.params.proxyId,
    systemId: req.params.systemId,
  });
  if (!deleted) return res.status(404).json({ error: 'Proxy not found' });
  res.json({ message: 'Proxy deleted' });
});

// GET: All proxies (bot only)
router.get('/', async (req, res) => {
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden: Bot-only route' });
  }
  try {
    const proxies = await Member.find({});
    res.json(proxies);
  } catch (err) {
    logger.error('[GET /proxy] Error fetching all proxies:', err);
    res.status(500).json({ error: 'Failed to fetch all proxies' });
  }
});

module.exports = router;