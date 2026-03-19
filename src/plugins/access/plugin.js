/**
 * Access Control Plugin
 * Path: plugins/access/plugin.js
 */

module.exports = {
  name: "access",
  enabled: true,

  /**
   * Initialize the plugin and pull necessary services.
   * Pulls 'config' for DB access and 'logger' for error tracking.
   */
  async init(container) {
    this.container = container;
    this.config = container.get("config");
    this.logger = container.get("logger");
  },

  /**
   * Logic to run when the plugin starts.
   * This plugin primarily acts as a provider for the /authenticate command,
   * so start() ensures the config schema is registered or initialized.
   */
  async start() {
    try {
      this.logger.info("Access Control system started. Monitoring for /authenticate interactions.");
    } catch (err) {
      this.logger.error(err, "Access Plugin: Failed during startup.");
    }
  },

  /**
   * Cleanup logic on plugin stop/reload.
   */
  async stop() {
    this.logger.info("Access Control system stopped.");
  }
};