const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'didsystem',
    description: 'Are you a System?',
    type: 'CHAT_INPUT',
    guild_id: [`944832140028297246`],
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
                    .setCustomId('rolebutton_945042143385354240')
                    .setLabel('Singlet')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945042913526698084')
                    .setLabel('DID System')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945043102262001694')
                    .setLabel('OSDD System')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945043167705722890')
                    .setLabel('Polyfragmented System')
                    .setStyle('PRIMARY'),
            );

        await interaction.reply({ content: 'Select your age:', components: [row] });
    },

    // ------------------------------------------------------------------------------
};