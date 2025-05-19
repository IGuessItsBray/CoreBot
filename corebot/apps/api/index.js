const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectToDatabase } = require('../../shared/utils/mongoClient');
const config = require('../../config/configLoader');
const createLogger = require('../../shared/utils/logger');
const logger = createLogger('API');
const System = require('../../shared/db/schemas/system');
const app = express();
const port = config.apiPort || 3341;

// Routes
const userRoutes = require('./routes/user');
const proxyRoutes = require('./routes/member');
const groupRoutes = require('./routes/group');
const systemRoutes = require('./routes/system');
const verifyToken = require('./middleware/verifyToken');
const Member = require('../../shared/db/schemas/member');

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Public auth
app.use('/auth', require('./routes/auth'));

// Protected API routes
app.use('/user', verifyToken, userRoutes);
app.use('/proxy', verifyToken, proxyRoutes);
app.use('/group', verifyToken, groupRoutes);
app.use('/system', verifyToken, systemRoutes);

// Bot-only system-scoped proxy routes
const botProxyRouter = express.Router();
botProxyRouter.use(verifyToken);

// POST /system/:systemId/proxies
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

// PUT /system/:systemId/proxies/:proxyId
botProxyRouter.put('/:systemId/proxies/:proxyId', async (req, res) => {
  if (req.user.discordId !== 'bot') return res.status(403).json({ error: 'Forbidden' });

  const { systemId, proxyId } = req.params;
  logger.info('[PUT] System ID:', systemId);
  logger.info('[PUT] Proxy ID:', proxyId);
  logger.info('[PUT] Body:', req.body);

  try {
    const updated = await Member.findOneAndUpdate(
      { id: proxyId, systemId: systemId },
      req.body,
      { new: true }
    );

    if (!updated) {
      logger.warn('[PUT] No match for query:', { id: proxyId, systemId: systemId });
      return res.status(404).json({ error: 'Proxy not found' });
    }

    res.json(updated);
  } catch (err) {
    logger.error('[PUT /system/:systemId/proxies/:proxyId] Error:', err);
    res.status(500).json({ error: 'Failed to update proxy' });
  }
});

// DELETE /system/:systemId/proxies/:proxyId
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
// GET /system/:systemId/proxies
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
// GET /system/:systemId → fetch a system (bot only)
botProxyRouter.get('/:systemId', async (req, res) => {
  if (req.user.discordId !== 'bot') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const system = await System.findOne({ id: req.params.systemId });
    if (!system) return res.status(404).json({ error: 'System not found' });
    res.json(system);
  } catch (err) {
    logger.error('[GET /system/:systemId] Error:', err);
    res.status(500).json({ error: 'Failed to fetch system' });
  }
});

app.use('/system', botProxyRouter);
app.use('/system/:systemId/groups', verifyToken, groupRoutes);
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Start server
(async () => {
  await connectToDatabase();
  app.listen(port, () => {
    logger.info(`\u{1F680} API listening at http://localhost:${port}`);
  });
})();