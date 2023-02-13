const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'ping',
    description: 'Replies with Pong!',
    type: 'CHAT_INPUT',
    guild_id: [],
    type: ApplicationCommandType.ChatInput,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = true) {

        await interaction.reply({
            content: '**Pong!**',
            ephemeral
        });
    },

    // ------------------------------------------------------------------------------
};