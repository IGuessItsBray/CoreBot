const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../../util/enum').Types;
const { createMember } = require('../../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'whsetup',
    description: 'Setup a webhook for proxying',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        interaction.channel.createWebhook('CB | Proxy Webhook', {
            avatar: 'https://i.imgur.com/AfFp7pu.png',
        })
            .then(webhook => interaction.reply(`Created webhook ${webhook}`))
            .catch(console.error);
    },

    // ------------------------------------------------------------------------------
};