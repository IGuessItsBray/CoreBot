// corebot/apps/bot/shard.js
import { ShardingManager } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../../config/configLoader.js';
import createLogger from '../../shared/utils/logger.js';
import * as Sentry from '@sentry/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logger = createLogger('ShardManager');

// Init Sentry
if (config.sentry?.enabled) {
  Sentry.init({
    dsn: config.sentry.dsn,
    tracesSampleRate: 1.0,
  });
  logger.info('Sentry initialized in ShardManager');
}

// Create Sharding Manager
const manager = new ShardingManager(path.join(__dirname, 'index.js'), {
  token: config.token,
});

// Logging
manager.on('shardCreate', shard => {
  logger.info(`Launched shard ${shard.id}`);
});

// Spawn shards
manager.spawn().catch(err => {
  logger.error('Failed to spawn shards:', err);
  if (config.sentry?.enabled) Sentry.captureException(err);
});