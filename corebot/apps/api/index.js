const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectToDatabase } = require('../../shared/utils/mongoClient');
const config = require('../../config/configLoader');
const createLogger = require('../../shared/utils/logger');
const logger = createLogger('API');
const System = require('../../shared/db/schemas/system');
const Member = require('../../shared/db/schemas/member');
const userRoutes = require('./routes/user');
const proxyRoutes = require('./routes/member');
const systemRoutes = require('./routes/system');
const groupRoutes = require('./routes/group');
const app = express();
const port = config.apiPort || 3341;

app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend dev server
  credentials: true                // Optional, for cookies/auth
}));
// Middleware
app.use(helmet());
app.use(express.json());

// Auth middleware
const verifyToken = require('./middleware/verifyToken');

// Public routes
app.use('/auth', require('./routes/auth'));

// Bot-only system-scoped routes (MUST be mounted before /system user routes)
const botProxyRouter = express.Router();
botProxyRouter.use(verifyToken);

// Create proxy
botProxyRouter.post('/:systemId/proxies', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  try {
    const proxy = await Member.create({ ...req.body, systemId: req.params.systemId });
    res.status(201).json(proxy);
  } catch (err) {
    logger.error('[POST /system/:systemId/proxies] Error:', err);
    res.status(500).json({ error: 'Failed to create proxy' });
  }
});

// Update proxy
botProxyRouter.put('/:systemId/proxies/:proxyId', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  try {
    const updated = await Member.findOneAndUpdate(
      { id: req.params.proxyId, systemId: req.params.systemId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Proxy not found' });
    res.json(updated);
  } catch (err) {
    logger.error('[PUT /system/:systemId/proxies/:proxyId] Error:', err);
    res.status(500).json({ error: 'Failed to update proxy' });
  }
});

// Delete proxy
botProxyRouter.delete('/:systemId/proxies/:proxyId', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  try {
    const deleted = await Member.findOneAndDelete({
      id: req.params.proxyId,
      systemId: req.params.systemId
    });
    if (!deleted) return res.status(404).json({ error: 'Proxy not found' });
    res.json({ message: 'Proxy deleted' });
  } catch (err) {
    logger.error('[DELETE /system/:systemId/proxies/:proxyId] Error:', err);
    res.status(500).json({ error: 'Failed to delete proxy' });
  }
});

// Get proxies
botProxyRouter.get('/:systemId/proxies', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  try {
    const proxies = await Member.find({ systemId: req.params.systemId });
    res.json(proxies);
  } catch (err) {
    logger.error('[GET /system/:systemId/proxies] Error:', err);
    res.status(500).json({ error: 'Failed to fetch proxies' });
  }
});

// Get system by ID
botProxyRouter.get('/:systemId', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  try {
    const system = await System.findOne({ id: req.params.systemId });
    if (!system) return res.status(404).json({ error: 'System not found' });
    res.json(system);
  } catch (err) {
    logger.error('[GET /system/:systemId] Error:', err);
    res.status(500).json({ error: 'Failed to fetch system' });
  }
});

// Change member ID
botProxyRouter.patch('/:systemId/member/:memberId/setid', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  const { newId } = req.body;
  if (!/^[A-Z0-9]{2,9}$/.test(newId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    const updated = await Member.findOneAndUpdate(
      { id: req.params.memberId, systemId: req.params.systemId },
      { id: newId },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Member not found' });
    res.json(updated);
  } catch (err) {
    logger.error(`[PATCH /system/${req.params.systemId}/member/${req.params.memberId}/setid] Error:`, err);
    res.status(500).json({ error: 'Failed to update proxy ID' });
  }
});
app.get('/export/:discordId', verifyToken, async (req, res) => {
  const { discordId } = req.params;

  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden: Bot access only' });
  }

  try {
    const userRes = await fetch(`${config.apiBaseUrl}/user/${discordId}`, {
      headers: { Authorization: `Bearer ${config.botAPIToken}` }
    });
    if (!userRes.ok) return res.status(404).json({ error: 'User not found' });

    const userData = await userRes.json();
    const systemId = userData.systemId;
    if (!systemId) return res.status(404).json({ error: 'User has no system' });

    // Fetch system, members, and groups
    const [systemRes, proxiesRes, groupsRes] = await Promise.all([
      fetch(`${config.apiBaseUrl}/system?systemId=${systemId}`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      }),
      fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      }),
      fetch(`${config.apiBaseUrl}/system/${systemId}/groups`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      }),
    ]);

    const system = await systemRes.json();
    const members = await proxiesRes.json();
    const groups = await groupsRes.json();

    const exportData = {
      platform: "corebot",
      version: config.exportVersion || "4",
      system: {
        id: system.id,
        name: system.name,
        memberCount: members.length,
        groupCount: groups.length
      },
      members: members.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description || "",
        pronouns: m.pronouns || "",
        proxyTags: m.proxyTags || [],
        groups: groups
          .filter(g => Array.isArray(g.members) && g.members.includes(m.id))
          .map(g => g.id)
      })),
      groups: groups.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description || "",
        members: g.members || []
      }))
    };

    return res.json(exportData);

  } catch (err) {
    logger.error(`[GET /export/${discordId}] Error:`, err);
    return res.status(500).json({ error: 'Failed to export user data' });
  }
});
// Change system ID
botProxyRouter.patch('/:systemId/setid', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  const { newId } = req.body;
  if (!/^[A-Z0-9]{2,9}$/.test(newId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    const existing = await System.findOne({ id: newId });
    if (existing) return res.status(409).json({ error: 'ID already in use' });

    const updated = await System.findOneAndUpdate(
      { id: req.params.systemId },
      { id: newId },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'System not found' });
    res.json(updated);
  } catch (err) {
    logger.error(`[PATCH /system/${req.params.systemId}/setid] Error:`, err);
    res.status(500).json({ error: 'Failed to update system ID' });
  }
});

// Register bot routes BEFORE user routes
app.use('/system', botProxyRouter);

// Verified user API routes
app.use('/user', verifyToken, userRoutes);
app.use('/proxy', verifyToken, proxyRoutes);
app.use('/group', verifyToken, groupRoutes);
app.use('/system', verifyToken, systemRoutes);
app.use('/system/:systemId/groups', verifyToken, groupRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Startup
(async () => {
  await connectToDatabase();
  app.listen(port, () => {
    logger.info(`\u{1F680} API listening at http://localhost:${port}`);
  });
})();
