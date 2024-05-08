// ------------------------------------------------------------------------------
// index.js
// The actual running of the bot
// ------------------------------------------------------------------------------

const { config } = require("./util/localStorage");
const fs = require("node:fs");
const express = require("express");
const app = express();
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const { token } = require("./util/localStorage").config;
const { blue, bold, underline, yellow, red, green } = require("colorette");
const { getTotalMembers, findMessages } = require("./db/dbProxy");
const { boot } = require("./errors/watchtower");
//const {totalUsers} = require("./util/totalUsers.js");
//const {statusChanger} = require("./util/status");
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

module.exports = { client };

// ------------------------------------------------------------------------------
// Initializing Bot Components
// ------------------------------------------------------------------------------



client.login(token);
client.once("ready", async () => {
  require("./db/mongo").init();
  require("./init/initCommands").init(client);
  require("./init/initEvents").init(client);
  require("./init/initLogs").init(client);
  
  const proxyMsgs = (await findMessages()).length;
  const proxyMembers = (await getTotalMembers()).length;
  const guilds = client.guilds.cache;
  const gsize = client.guilds.cache.size;
  const csize = client.channels.cache.size;
  const shardCount = client.options.shardCount;
  const data = { proxyMsgs, proxyMembers, gsize, csize, shardCount };
  const bootData = await boot(client, data);
  var totalUsers = 0;

  guilds.forEach((guild) => {
    totalUsers += guild.memberCount;
  });
  console.info(
    underline(
      blue(`
	Ready & Running as ${client.user.tag}
	${gsize} Guilds - ${csize} Channels - ${totalUsers} Users - ${shardCount} shards - ${proxyMembers} Proxy Members - ${proxyMsgs} Proxied messages`)
    )
  );
  console.log(
    blue(`
${client.user.tag}
Made with ♥️ by iguessitsbray, seth and pmass
For help, contact iguessitsbray
Support server: https://discord.gg/GAAj6DDrCJ
`)

  );
  // ------------------------------------------------------------------------------
  // Addons
  // ------------------------------------------------------------------------------
  //Modules
  const buttons = require("./modules/buttons");
  console.log(green("✅ Buttons │ Buttons online!"));
  buttons(client);
  console.log(green("✅ Reminders │ Remind online!"));
  const setPresence = require("./modules/setPresence");
  console.log(green("✅ setPresence │ setPresence online!"));
  setPresence(client);
  
});
