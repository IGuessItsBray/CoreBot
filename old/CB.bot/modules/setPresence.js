const { ButtonComponent } = require("@discordjs/builders");
const Discord = require("discord.js");
const {
  Client,
  Intents,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ActivityType,
} = require("discord.js");
const fs = require("fs");
const config = require("../util/localStorage");

module.exports = (client) => {
   const guilds = client.guilds.cache;
   var totalUsers = 0;

   guilds.forEach((guild) => {
     totalUsers += guild.memberCount;
   });

   console.log(client.shard.count);
   if (client.user.id === "955267092800733214") {
     const status = [
       `Dev build`,
       "Not a production version",
       "Made with ♥️",
       "Unstable!",
       "I probably crashed lol",
       `Serving ${totalUsers} users!`,
     ];
     setInterval(() => {
       const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
       const newActivity = status[randomIndex];
       client.user.setPresence({
         activities: [
           {
             type: ActivityType.Custom,
             name: `${newActivity}`,
           },
         ],
         status: "dnd",
       });
     }, 10000);
   }
   if (client.user.id === "950525282434048031") {
     const status = [
       `CB v4.0.0`,
       "Made with ♥️",
       "Built on DJS14",
       "Hi Seth!",
       `Serving ${totalUsers} users!``${client.guilds.cache.size} Discord Servers`,
     ];
     setInterval(() => {
       const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
       const newActivity = status[randomIndex];
       client.user.setPresence({
         activities: [
           {
             type: ActivityType.Custom,
             name: `${newActivity}`,
           },
         ],
         status: "online",
       });
     }, 10000);
   }
   if (client.user.id === "1019253573139316776") {
     const status = [
       `CB Beta v4.0.0`,
       "Not prod lol",
       "Made with ♥️",
       "Built on DJS14",
       "Updates daily!",
       `${client.guilds.cache.size} Servers | ${totalUsers} users!`,
     ];
     setInterval(() => {
       const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
       const newActivity = status[randomIndex];
       client.user.setPresence({
         activities: [
           {
             type: ActivityType.Custom,
             name: `${newActivity}`,
           },
         ],
         status: "idle",
       });
     }, 10000);
   }
};
