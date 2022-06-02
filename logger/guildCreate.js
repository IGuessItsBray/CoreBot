const fn = require('../util/genUtils')
const { getLogChannel } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents, MessageActionRow, MessageButton } = require("discord.js");
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
        const channel = g.channels.cache.find(channel => channel.type === 'GUILD_TEXT')
        //console.log(channel)
        //const row = new MessageActionRow()
			//.addComponents(
				//new MessageButton()
					//.setCustomId('begin')
					//.setLabel('Begin!')
					//.setStyle('PRIMARY'),
			//);
        const embed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`Hello, I am <@950525282434048031>! Please do the following to begin your server setup
        1. Run /serversetup setauditlogchannel to set your audit logging channel!! `)
        await channel.send({
            //components: [row],
            embeds: [ embed ],
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};