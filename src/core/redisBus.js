const Redis = require("ioredis")
const config = require("../../config/config.json")

class RedisBus {

  constructor(container) {

    this.logger = container.get("logger")

    this.publisher = new Redis(config.redis)
    this.subscriber = new Redis(config.redis)

    this.handlers = new Map()

  }

  async start() {

    this.subscriber.on("message", (channel, message) => {

      try {

        const data = JSON.parse(message)

        const handler = this.handlers.get(channel)

        if (handler) {
          handler(data)
        }

      } catch (err) {

        this.logger.error(err, "Redis message error")

      }

    })

    this.logger.info("Redis bus started")

  }

  async subscribe(channel, handler) {

    this.handlers.set(channel, handler)

    await this.subscriber.subscribe(channel)

    this.logger.info(`Subscribed to channel: ${channel}`)

  }

  async publish(channel, payload) {

    await this.publisher.publish(
      channel,
      JSON.stringify(payload)
    )

  }

  async broadcast(event, data) {

    await this.publish("corebot:broadcast", {
      event,
      data
    })

  }

}

module.exports = RedisBus