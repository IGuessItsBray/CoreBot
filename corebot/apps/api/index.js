const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectToDatabase } = require('../../shared/utils/mongoClient');
const config = require('../../config/configLoader');
const createLogger = require('../../shared/utils/logger');
const logger = createLogger('API');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const System = require('../../shared/db/schemas/system');
const Member = require('../../shared/db/schemas/member');
const Incident = require('../../shared/db/schemas/incident');
const StatusReport = require('../../shared/db/schemas/statusReport');

const userRoutes = require('./routes/user');
const proxyRoutes = require('./routes/member');
const systemRoutes = require('./routes/system');
const groupRoutes = require('./routes/group');

const app = express();
const port = config.apiPort || 3341;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

const verifyToken = require('./middleware/verifyToken');
app.use('/auth', require('./routes/auth'));

const botProxyRouter = express.Router();
botProxyRouter.use(verifyToken);

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

// ===== STATUS ROUTES =====
const statusRouter = express.Router();
statusRouter.use(verifyToken);

statusRouter.use((req, res, next) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });
  next();
});

statusRouter.get('/ping', (req, res) => {
  res.json({
    latency: Date.now() - (req.requestTime || Date.now()),
    service: config.serviceName || 'api',
    timestamp: new Date().toISOString()
  });
});

statusRouter.post('/report', async (req, res) => {
  const { source = config.serviceName || 'unknown', latency, shardStatus, additional } = req.body;

  if (typeof latency !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid latency' });
  }

  try {
    const report = await StatusReport.findOneAndUpdate(
      { source },
      {
        source,
        timestamp: new Date(),
        latency,
        ...(shardStatus && { shardStatus }),
        ...(additional && { additional })
      },
      { upsert: true, new: true }
    );
    res.status(200).json(report);
  } catch (err) {
    logger.error('[POST /status/report] Error:', err);
    res.status(500).json({ error: 'Failed to update status report' });
  }
});

statusRouter.get('/reports', async (req, res) => {
  try {
    const reports = await StatusReport.find().sort({ timestamp: -1 });
    res.json(reports);
  } catch (err) {
    logger.error('[GET /status/reports] Error:', err);
    res.status(500).json({ error: 'Failed to fetch status reports' });
  }
});

statusRouter.get('/shards', async (req, res) => {
  res.json({ shards: [{ id: 0, status: 'unknown', ping: -1 }] });
});

statusRouter.get('/incidents', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ timestamp: -1 }).limit(50);
    res.json(incidents);
  } catch (err) {
    logger.error('[GET /status/incidents] Error:', err);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

statusRouter.get('/incidents/active', async (req, res) => {
  try {
    const activeIncidents = await Incident.find({ resolved: false }).sort({ timestamp: -1 });
    res.json(activeIncidents);
  } catch (err) {
    logger.error('[GET /status/incidents/active] Error:', err);
    res.status(500).json({ error: 'Failed to fetch active incidents' });
  }
});

statusRouter.post('/incident', async (req, res) => {
  const { title, severity = 'low', type = 'outage', source = config.serviceName || 'unknown', updates = [] } = req.body;

  if (!title || updates.length === 0 || !updates[0].message) {
    return res.status(400).json({ error: 'Title and at least one update with a message are required.' });
  }

  try {
    const incident = await Incident.create({
      title,
      type,
      severity,
      source,
      updates: updates.map(u => ({ message: u.message, timestamp: u.timestamp || new Date() })),
      resolved: false
    });
    res.status(201).json(incident);
  } catch (err) {
    logger.error('[POST /status/incident] Error:', err);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

statusRouter.patch('/incident/:id/resolve', async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    logger.error(`[PATCH /status/incident/${req.params.id}/resolve] Error:`, err);
    res.status(500).json({ error: 'Failed to resolve incident' });
  }
});

statusRouter.patch('/incident/:id/edit', async (req, res) => {
  const { title, severity, type } = req.body;
  try {
    const updated = await Incident.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(severity && { severity }),
        ...(type && { type })
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Incident not found' });
    res.json(updated);
  } catch (err) {
    logger.error(`[PATCH /status/incident/${req.params.id}/edit] Error:`, err);
    res.status(500).json({ error: 'Failed to edit incident' });
  }
});
statusRouter.get('/incidents/all', async (req, res) => {
  try {
    const allIncidents = await Incident.find().sort({ createdAt: -1 });
    res.json(allIncidents);
  } catch (err) {
    logger.error('[GET /status/incidents/all] Error:', err);
    res.status(500).json({ error: 'Failed to fetch all incidents' });
  }
});
statusRouter.patch('/incident/:id/add-update', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Update message is required.' });

  try {
    const updated = await Incident.findByIdAndUpdate(
      req.params.id,
      { $push: { updates: { message, timestamp: new Date() } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Incident not found' });
    res.json(updated);
  } catch (err) {
    logger.error(`[PATCH /status/incident/${req.params.id}/add-update] Error:`, err);
    res.status(500).json({ error: 'Failed to add update' });
  }
});

app.use('/status', statusRouter);

app.use('/system', botProxyRouter);
app.use('/user', verifyToken, userRoutes);
app.use('/proxy', verifyToken, proxyRoutes);
app.use('/group', verifyToken, groupRoutes);
app.use('/system', verifyToken, systemRoutes);
app.use('/system/:systemId/groups', verifyToken, groupRoutes);

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

    const [systemRes, proxiesRes, groupsRes] = await Promise.all([
      fetch(`${config.apiBaseUrl}/system?systemId=${systemId}`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      }),
      fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      }),
      fetch(`${config.apiBaseUrl}/system/${systemId}/groups`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      })
    ]);

    const system = await systemRes.json();
    const members = await proxiesRes.json();
    const groups = await groupsRes.json();

    const exportData = {
      platform: 'corebot',
      version: config.exportVersion || '4',
      system: {
        id: system.id,
        name: system.name,
        memberCount: members.length,
        groupCount: groups.length
      },
      members: members.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description || '',
        pronouns: m.pronouns || '',
        proxyTags: m.proxyTags || [],
        groups: groups.filter(g => Array.isArray(g.members) && g.members.includes(m.id)).map(g => g.id)
      })),
      groups: groups.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description || '',
        members: g.members || []
      }))
    };

    return res.json(exportData);
  } catch (err) {
    logger.error(`[GET /export/${discordId}] Error:`, err);
    return res.status(500).json({ error: 'Failed to export user data' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

(async () => {
  await connectToDatabase();
  app.listen(port, () => {
    logger.info(`🚀 API listening at http://localhost:${port}`);
  });

  // ============================
  // Latency Reporting to API
  // ============================
  setInterval(async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/status/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.botAPIToken}`,
        },
        body: JSON.stringify({
          source: config.serviceName || 'api',
          latency: 0,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        logger.warn(`[Latency] Failed to post API latency report: ${res.status}`);
      }
    } catch (err) {
      logger.error('[Latency] Error posting API status report:', err);
    }
  }, 30_000);
})();
