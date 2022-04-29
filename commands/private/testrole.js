const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'testrole',
    description: 'Test to ensure the bots role assignment is correctly functioning.',
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
    
    async execute(interaction, ephemeral = false) {
        //command contents go here, just like in builders
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_955276079474561024')
                        .setLabel('Test role')
                        .setStyle('PRIMARY'),
                );

            await interaction.reply({ content: 'Press to test if role buttons are functioning.', components: [row] });
    },

    // ------------------------------------------------------------------------------
};