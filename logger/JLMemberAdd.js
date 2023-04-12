const fn = require('../util/genUtils')
const { getJoin } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'guildMemberAdd Example',
    type: 'guildMemberAdd',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const message = (await getJoin(channel.guild.id)).message
        const sendchannel = await channel.client.channels.fetch((await getJoin(channel.guild.id)).channel);
        const user = channel.user.id
        await sendchannel.send(`<@${user}>, ${message}`);
    },

    // ------------------------------------------------------------------------------
};