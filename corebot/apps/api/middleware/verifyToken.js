const jwt = require('jsonwebtoken');
const config = require('../../../config/configLoader');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing or invalid token' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    // Recognize bot token
    if (decoded.discordId === 'bot') {
      req.user = { discordId: 'bot', isBot: true };
    } else {
      req.user = { discordId: decoded.discordId, isBot: false };
    }

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};