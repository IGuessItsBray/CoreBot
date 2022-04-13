const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'pings',
    description: 'Select your pingable roles!',
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
                        .setCustomId('rolebutton_940775123991027823')
                        .setLabel('TGMD Role')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945775787976564816')
                        .setLabel('Gaming Role')
                        .setStyle('PRIMARY'),
                );
            await interaction.reply({ content: 'Select your ping roles:', components: [row] });
    },

    // ------------------------------------------------------------------------------
};