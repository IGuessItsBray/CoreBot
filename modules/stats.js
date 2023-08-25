const { ButtonComponent } = require("@discordjs/builders");
const Discord = require("discord.js");
const {
  Client,
  Intents,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const fs = require("fs");
const config = require("../util/localStorage");
const { getTotalMembers, findMessages } = require("../db/dbProxy");

module.exports = (client) => {
  const express = require("express");
  const app = express();
  app.enable("trust proxy");
  app.set("etag", false); //disable cache
  app.use(express.static(__dirname + "./frontend"));
  const { ip, port } = require("../util/localStorage").config;
  app.listen(port);
  // app.use((req, res, next) => {
  // 	console.log(`- ${req.method}: ${req.url} ${res.statusCode} ( by: ${req.ip} )`)
  // 	next()
  // })

  app.get("/", async (req, res) => {
    const guilds = client.guilds.cache.size;
    var totalUsers = 0;

    client.guilds.cache.forEach((guild) => {
      totalUsers += guild.memberCount;
    });

    const users = totalUsers;
    const shards = client.options.shardCount;
    const proxyMsgs = (await findMessages()).length;
    const proxyMembers = (await getTotalMembers()).length;
    //res.sendFile("./frontend/html/home.html", { root: __dirname });
    let file = fs.readFileSync("./frontend/html/stats.html", {
      encoding: "utf8",
    });
    file = file.replace("$$guilds$$", guilds);
    file = file.replace("$$users$$", users);
    file = file.replace("$$shards$$", shards);
    file = file.replace("$$pmsgs$$", proxyMsgs);
    file = file.replace("$$pmems$$", proxyMembers);
    res.send(file);
  });
  console.log(`STATS: Listening at ${ip}:${port}`);
};
