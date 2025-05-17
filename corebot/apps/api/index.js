const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectToDatabase } = require('../../shared/utils/mongoClient');
const config = require('../../config/configLoader');
const createLogger = require('../../shared/utils/logger');
const logger = createLogger('API');

const app = express();
const port = config.apiPort || 3341;
const userRoutes = require('./routes/user');
const proxyRoutes = require('./routes/member');
const groupRoutes = require('./routes/group');
const systemRoutes = require('./routes/system');
// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/proxy', proxyRoutes);
app.use('/group', groupRoutes);
app.use('/system', systemRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Start server
(async () => {
  await connectToDatabase();

  app.listen(port, () => {
    logger.info(`🚀 API listening at http://localhost:${port}`);
  });
})();