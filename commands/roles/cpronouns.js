const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'pronouns',
    description: 'Select your Pronouns!',
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
                        .setCustomId('rolebutton_945504345804386324')
                        .setLabel('He/Him')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504417468264458')
                        .setLabel('They/Them')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504389571952660')
                        .setLabel('She/Her')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504468722651208')
                        .setLabel('Ask my pronouns')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945775954024857700')
                        .setLabel('Any pronouns')
                        .setStyle('PRIMARY'),
                );

            await interaction.reply({ content: 'Select your pronouns:', components: [row] });
    },

    // ------------------------------------------------------------------------------
};