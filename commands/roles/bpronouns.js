const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'pronoun',
    description: 'Select your pronouns',
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
                        .setCustomId('rolebutton_947338734129516556')
                        .setLabel('He/Him')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947338857672749056')
                        .setLabel('She/Her')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947338938832523354')
                        .setLabel('They/Them')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947339120819191870')
                        .setLabel('Ask')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947342124712611881')
                        .setLabel('It/Its')
                        .setStyle('PRIMARY'),
                );
                const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_947339179463954475')
                        .setLabel('NeoPronouns')
                        .setStyle('PRIMARY'),
                );

            await interaction.reply({ content: 'Text', components: [row, row2] });
    },

    // ------------------------------------------------------------------------------
};