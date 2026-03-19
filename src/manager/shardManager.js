const { ShardingManager } = require("discord.js")
const config = require("../core/config")

const manager = new ShardingManager("./src/bot.js", {
  token: config.discord.token,
  totalShards: "auto"
})

manager.on("shardCreate", shard => {
  console.log(`Launched shard ${shard.id}`)
})

manager.spawn()