// generateBotToken.js
const jwt = require('jsonwebtoken');
const config = require('./config/configLoader');

const payload = {
  discordId: 'bot',
  username: 'CoreBot',
  tag: 'corebot@0'
};

const token = jwt.sign(payload, config.jwtSecret, {
  expiresIn: '10y' // basically "permanent"
});

console.log('Bot API Token:', token);