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
const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/verifyToken');
// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/auth', require('./routes/auth')); // public
app.use('/user', verifyToken, require('./routes/user')); // protected now
app.use('/proxy', verifyToken, proxyRoutes);
app.use('/group', verifyToken, groupRoutes);
app.use('/system', verifyToken, systemRoutes);
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