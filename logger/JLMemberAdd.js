const fn = require('../util/genUtils')
const { getJoin } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
const badges = require('../config.json').emotes;
const { dev, tester, networkadmin } = require('../config.json');
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