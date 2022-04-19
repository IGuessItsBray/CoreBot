const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'element',
    description: 'Select your Element!',
    type: 'CHAT_INPUT',
    guild_id: [`940774597287112766`],
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
                .setCustomId('rolebutton_945776263367372850')
                .setLabel('Air')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('rolebutton_945776318681849926')
                .setLabel('Army')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('rolebutton_945776387728482354')
                .setLabel('Sea')
                .setStyle('PRIMARY'),
        );

    await interaction.reply({ content: 'Select your element:', components: [row] });
    },

    // ------------------------------------------------------------------------------
};