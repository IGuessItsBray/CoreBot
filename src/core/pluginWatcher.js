const chokidar = require("chokidar")
const path = require("path")

class PluginWatcher {

  constructor(pluginLoader, logger) {

    this.pluginLoader = pluginLoader
    this.logger = logger

  }

  start() {

    const pluginsPath = path.join(__dirname, "../plugins")

    const watcher = chokidar.watch(pluginsPath, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    })

    watcher.on("change", async file => {

      this.logger.info(`File changed: ${file}`)

      const pluginFolder = this.getPluginFolder(file)

      if (!pluginFolder) return

      await this.pluginLoader.reloadPlugin(pluginFolder)

    })

  }

  getPluginFolder(filePath) {

    const parts = filePath.split(path.sep)

    const pluginIndex = parts.indexOf("plugins")

    if (pluginIndex === -1) return null

    return parts[pluginIndex + 1]

  }

}

module.exports = PluginWatcher