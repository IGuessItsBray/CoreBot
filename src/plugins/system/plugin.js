module.exports = {
  name: "system",
  enabled: true,
  
  async init(container) {
    this.container = container;
    this.logger = container.get("logger");
  },

  async start() {
    this.bootTime = Date.now();
    this.logger.info("System plugin started.");
  },

  async stop() {
    // If we had intervals running for health checks, we'd clear them here.
    this.logger.info("System plugin stopped.");
  }
};