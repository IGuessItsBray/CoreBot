module.exports = {

  name: "core",
  version: "1.0.0",
  dependencies: [],
  enabled: true,

  events: [
    {
      event: "ready",
      once: true,
      handler: async (container) => {

        const logger = container.get("logger")
        logger.info("Core plugin ready")

      }
    }
  ],

  async init(container) {

    const logger = container.get("logger")
    logger.info("Core plugin initialized")

  },

  async start(container) {

    const logger = container.get("logger")
    logger.info("Core plugin started")

  },

  async stop(container) {

    const logger = container.get("logger")
    logger.info("Core plugin stopped")

  }

}