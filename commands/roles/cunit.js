const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'unit',
    description: 'Select your unit!',
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
                        .setCustomId('rolebutton_943338720856256543')
                        .setLabel('80 Air')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945775521508261988')
                        .setLabel('530 Air')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_943338749696278558')
                        .setLabel('1569 Army')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('rolebutton_943338639734214717')
                        .setLabel('94 Sea')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945775438523949158')
                        .setLabel('40 Sea')
                        .setStyle('SECONDARY'),
                );

            await interaction.reply({ content: 'Select your unit:', components: [row] });
    },

    // ------------------------------------------------------------------------------
};