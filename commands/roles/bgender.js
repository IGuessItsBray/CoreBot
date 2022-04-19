const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
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
        ...admin_roles.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: true,
            };
        }),
        ...dev_users.map(user => {
            return {
                id: user,
                type: 'USER',
                permission: true,
            };
        }),
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