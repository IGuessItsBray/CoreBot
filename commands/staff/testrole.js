const { Client, Intents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType } = require('discord.js');
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'testrole',
    description: 'Test to ensure the bots role assignment is correctly functioning.',
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
    
    async execute(interaction, ephemeral = false) {
        //command contents go here, just like in builders
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('rolebutton_955276079474561024')
                        .setLabel('Test role')
                        .setStyle(ButtonStyle.Primary),
                );

            await interaction.reply({ content: 'Press to test if role buttons are functioning.', components: [row] });
    },

    // ------------------------------------------------------------------------------
};