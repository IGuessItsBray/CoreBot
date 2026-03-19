class PluginManager {

  constructor(logger) {

    this.logger = logger
    this.plugins = new Map()

  }

  register(plugin) {

    if (!plugin.name) {
      throw new Error("Plugin missing name")
    }

    this.plugins.set(plugin.name, plugin)

  }

  resolveLoadOrder() {

    const resolved = []
    const unresolved = new Set()

    const visit = (plugin) => {

      if (resolved.includes(plugin)) return

      if (unresolved.has(plugin.name)) {
        throw new Error(`Circular dependency detected: ${plugin.name}`)
      }

      unresolved.add(plugin.name)

      const deps = plugin.dependencies || []

      for (const dep of deps) {

        const depPlugin = this.plugins.get(dep)

        if (!depPlugin) {
          throw new Error(
            `Plugin "${plugin.name}" requires missing dependency "${dep}"`
          )
        }

        visit(depPlugin)

      }

      unresolved.delete(plugin.name)

      resolved.push(plugin)

    }

    for (const plugin of this.plugins.values()) {
      visit(plugin)
    }

    return resolved

  }

}

module.exports = PluginManager