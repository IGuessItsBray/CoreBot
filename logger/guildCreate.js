const fn = require('../util/genUtils')
const { getServerSettings } = require('../db/dbAccess');
const { CommandInteraction, EmbedBuilder, Intents, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'guildCreate',
    type: 'guildCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(g) {
       // const channel = g.channels.cache.find(channel => channel.type === "GUILD_TEXT")
        //console.log(channel)
        //const row = new ActionRowBuilder()
			//.addComponents(
				//new ButtonBuilder()
					//.setCustomId('begin')
					//.setLabel('Begin!')
					//.setStyle(ButtonStyle.Primary),
			//);
       // const embed = new EmbedBuilder()
       // .setColor('#2f3136')
       // .setDescription(`Hello, I am <@950525282434048031>! Please do the following to begin your server setup
       // 1. Run /serversetup setauditlogchannel to set your audit logging channel!! `)
       /// await channel.send({
        //    //components: [row],
         //   embeds: [ embed ],
         //   allowedMentions: { parse: [] },
        //});
    },

    // ------------------------------------------------------------------------------
};