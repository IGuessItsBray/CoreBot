const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, `${env}.json`);

if (!fs.existsSync(configPath)) {
  throw new Error(`Missing config file for NODE_ENV=${env}`);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
module.exports = config;