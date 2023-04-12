const fn = require('../util/genUtils')
const { getLeave } = require('../db/dbAccess');
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'guildMemberRemove JL stuff',
    type: 'guildMemberRemove',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const message = (await getLeave(channel.guild.id)).message
        const sendchannel = await channel.client.channels.fetch((await getLeave(channel.guild.id)).channel);
        const user = channel.user.id
        await sendchannel.send(`<@${user}>, ${message}`);
    },

    // ------------------------------------------------------------------------------
};