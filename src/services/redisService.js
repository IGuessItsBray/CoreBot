const Redis = require("ioredis")
const config = require("../../config/config.json")

class RedisService {
  constructor() {
    // Separate connections for pub/sub
    this.publisher = new Redis(config.redis) // auto-connects
    this.subscriber = new Redis(config.redis) // auto-connects
  }

  // optional if you want to keep it, just check if already connected
  async connect() {
    if (!this.publisher.status || this.publisher.status === "end") {
      await this.publisher.connect()
    }
    if (!this.subscriber.status || this.subscriber.status === "end") {
      await this.subscriber.connect()
    }
  }

  getPublisher() {
    return this.publisher
  }

  getSubscriber() {
    return this.subscriber
  }
}

module.exports = RedisService