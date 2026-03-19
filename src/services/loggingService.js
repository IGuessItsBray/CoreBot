const { EmbedBuilder } = require("discord.js");
const Guild = require("../models/Guild");

class LoggingService {
  constructor(container) {
    this.container = container;
    this.client = container.get("client");
    this.logger = container.get("logger");
    this.redisService = container.get("redis");
  }

  /**
   * Internal helper to resolve the active Redis publisher client.
   * Since your RedisService split Pub/Sub, we use the publisher for data ops.
   */
  get _redis() {
    return this.redisService.publisher;
  }

  /**
   * Sends a formatted log embed to the designated log channel for a guild.
   */
  async send(guildId, { title, content, color = 0x5865F2, fields = [], footer = null }) {
    try {
      const cacheKey = `config:${guildId}:logChannel`;
      const redis = this._redis;

      // 1. Check Cache
      let logChannelId = await redis.get(cacheKey);

      if (!logChannelId) {
        // 2. Cache Miss: Query MongoDB
        const guildData = await Guild.findOne({ guildId });
        
        if (!guildData || !guildData.logChannelId) return;

        logChannelId = guildData.logChannelId;

        // 3. Update Cache (1 hour)
        await redis.set(cacheKey, logChannelId, "EX", 3600);
        this.logger.debug(`Cache miss for guild ${guildId}. Log channel ${logChannelId} cached.`);
      }

      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) return;

      const channel = guild.channels.cache.get(logChannelId);
      if (!channel) {
        this.logger.warn(`Log channel ${logChannelId} not found in guild ${guildId}.`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(content || null)
        .setColor(color)
        .addFields(fields)
        .setTimestamp();

      if (footer) embed.setFooter({ text: footer });

      await channel.send({ embeds: [embed] });

    } catch (err) {
      this.logger.error(err, `LoggingService failed to send log for guild ${guildId}`);
    }
  }

  /**
   * Invalidate the cache.
   */
  async clearCache(guildId) {
    const cacheKey = `config:${guildId}:logChannel`;
    try {
      await this._redis.del(cacheKey);
      this.logger.debug(`Invalidated log channel cache for guild ${guildId}`);
    } catch (err) {
      this.logger.error(err, `LoggingService: Failed to clear Redis cache for ${guildId}`);
    }
  }
}

module.exports = LoggingService;