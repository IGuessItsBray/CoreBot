class EventRouter {
  constructor(container) {
    this.container = container;
    this.client = container.get("client");
    this.logger = container.get("logger");
    
    // Moved inside the class to ensure each router instance manages its own state
    this.listeners = new Map(); 
  }

  /**
   * Registers all events defined in a plugin and tracks them for later removal.
   * Expected format: plugin.events = [{ event: 'ready', once: true, handler: (container, ...) => {} }]
   */
  registerEvents(plugin) {
    if (!plugin.events || !Array.isArray(plugin.events)) return;

    const pluginListeners = [];

    for (const event of plugin.events) {
      // Create a wrapped handler to inject the container and preserve context
      const wrapped = (...args) => {
        try {
          event.handler(this.container, ...args);
        } catch (err) {
          this.logger.error(err, `Error in event ${event.event} for plugin ${plugin.name}`);
        }
      };

      if (event.once) {
        this.client.once(event.event, wrapped);
      } else {
        this.client.on(event.event, wrapped);
      }

      pluginListeners.push({
        event: event.event,
        handler: wrapped
      });
    }

    this.listeners.set(plugin.name, pluginListeners);
    this.logger.debug(`Registered ${pluginListeners.length} events for plugin: ${plugin.name}`);
  }

  /**
   * Physically detaches all listeners associated with a specific plugin.
   * Crucial for the reload lifecycle to prevent "ghost" listeners.
   */
  removePluginEvents(pluginName) {
    const pluginListeners = this.listeners.get(pluginName);

    if (!pluginListeners) {
      this.logger.debug(`No active listeners found to remove for plugin: ${pluginName}`);
      return;
    }

    for (const listener of pluginListeners) {
      // Physically remove the specific wrapped function from the EventEmitter
      this.client.removeListener(
        listener.event,
        listener.handler
      );
    }

    this.listeners.delete(pluginName);
    this.logger.debug(`Successfully removed listeners for plugin: ${pluginName}`);
  }
}

module.exports = EventRouter;