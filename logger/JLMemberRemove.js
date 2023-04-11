const fn = require('../util/genUtils')
const { getLeave } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
const { badges } = require('../util/localStorage').emotes;
const { dev, tester, networkadmin } = require('../config.json');
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