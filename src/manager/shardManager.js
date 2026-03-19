const { ShardingManager } = require('discord.js');
const config = require('../core/config');
const logger = require('../utils/logger');

const manager = new ShardingManager('./src/bot.js', {
  token: config.discord.token,
  totalShards: 'auto'
});

manager.on('shardCreate', shard => logger.info(`Launched shard ${shard.id}`));

// 🔹 CRITICAL: Add the .catch() here
manager.spawn().catch(err => {
  console.error("[ShardManager] Failed to spawn shards:");
  // This will log the actual response object causing the crash
  console.error(err); 
  process.exit(1);
});