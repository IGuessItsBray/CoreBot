const fs = require("fs")
const path = require("path")

const configPath = path.join(__dirname, "../../config/config.json")

let config = {}

try {
  const raw = fs.readFileSync(configPath)
  config = JSON.parse(raw)
} catch (err) {
  console.error("Failed to load config.json")
  console.error(err)
  process.exit(1)
}

module.exports = config