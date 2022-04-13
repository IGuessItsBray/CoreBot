const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'dms',
    description: 'Select your DM Status',
    type: 'CHAT_INPUT',
    guild_id: [`940774597287112766`],
    enabled: true,
    default_permission: false,
    permissions: [
        {
            id: "530845321270657085",
            type: "USER",
            permission: true
        },
    ],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_945504514750943232')
                        .setLabel('DMs Open')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504558749216850')
                        .setLabel('DMs Closed')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504591993249803')
                        .setLabel('Ask to DM')
                        .setStyle('PRIMARY'),
                );

            await interaction.reply({ content: 'Select your DM status:', components: [row] });
    },

    // ------------------------------------------------------------------------------
};