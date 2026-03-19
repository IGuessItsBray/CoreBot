const { REST, Routes } = require("discord.js")
const config = require("../src/core/config")

const commands = [
  {
    name: "ping",
    description: "Ping the bot"
  }
]

const rest = new REST({ version: "10" }).setToken(config.discord.token)

async function deploy() {

  await rest.put(
    Routes.applicationCommands(config.discord.clientId),
    { body: commands }
  )

  console.log("Commands deployed")

}

deploy()