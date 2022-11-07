const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
const { listProxy, getMembers } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'list-proxy',
    description: 'lists all proxies for a user',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'ephemeral',
            description: 'Is the message ephemeral?',
            type: OPTION.BOOLEAN,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const ephemeralSetting = interaction.options.getBoolean('ephemeral');
        const uid = interaction.user.id
        const members = await getMembers(
            uid,
        );
        interaction.reply({ content: `Members belonging to <@${uid}>:
        ${members}`, ephemeral: ephemeralSetting })
    },

    // ------------------------------------------------------------------------------
};