class EventBus {
  constructor(container) {
    this.logger = container.get("logger")
    this.redisPub = container.get("redis").getPublisher()
    this.redisSub = container.get("redis").getSubscriber()
    this.handlers = new Map()
  }

  async start() {
    this.redisSub.on("message", (channel, message) => {
      try {
        const payload = JSON.parse(message)
        const handler = this.handlers.get(channel)
        if (handler) handler(payload)
      } catch (err) {
        this.logger.error(err, "EventBus message error")
      }
    })

    this.logger.info("EventBus started")
  }

  async subscribe(channel, handler) {
    this.handlers.set(channel, handler)
    await this.redisSub.subscribe(channel)
    this.logger.info(`Subscribed to ${channel}`)
  }

  async publish(channel, payload) {
    await this.redisPub.publish(channel, JSON.stringify(payload))
  }
}

module.exports = EventBus