const jwt = require('jsonwebtoken');
const config = require('../../../config/configLoader');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // now you can access req.user.discordId etc.
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};