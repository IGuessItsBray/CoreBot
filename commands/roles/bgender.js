const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'gender',
    description: 'Select your gender!',
    type: 'CHAT_INPUT',
    guild_id: [`945205088287326248`],
    enabled: true,
    default_permission: false,
    permissions: [
        {
            id: "948663216353976350",
            type: "ROLE",
            permission: true
        },
        {
            id: "945205088287326248",
            type: "ROLE",
            permission: false
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
                    .setCustomId('rolebutton_947339067090169867')
                    .setLabel('Male')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_948662136631070740')
                    .setLabel('Female')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_948662194776702986')
                    .setLabel('Transgender')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_948662191932981370')
                    .setLabel('NonBinary')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_948662189009555456')
                    .setLabel('Genderfluid')
                    .setStyle('PRIMARY'),
            );
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_948662198698377266')
                    .setLabel('Questioning')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_948662202854932490')
                    .setLabel('Other')
                    .setStyle('PRIMARY'),
            );
        await interaction.reply({ content: 'Text', components: [row, row2] });

    },

    // ------------------------------------------------------------------------------
};