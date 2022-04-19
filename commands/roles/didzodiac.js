const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'didzodiac',
    description: 'What is your zodiac sign?',
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
                    .setCustomId('rolebutton_945047094891261992')
                    .setLabel('Aries')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047095298097294')
                    .setLabel('Taurus')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047095763693673')
                    .setLabel('Gemini')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047096451547186')
                    .setLabel('Cancer')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047096564801648')
                    .setLabel('Leo')
                    .setStyle('PRIMARY'),
            );
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_945047097370091602')
                    .setLabel('Virgo')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047097735016448')
                    .setLabel('Libra')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047098053767208')
                    .setLabel('Scorpio')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047098968125471')
                    .setLabel('Sagittarius')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047099530170398')
                    .setLabel('Capricorn')
                    .setStyle('PRIMARY'),
            );
        const row3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_945047099945418773')
                    .setLabel('Aquarius')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047100532609094')
                    .setLabel('Pisces')
                    .setStyle('PRIMARY'),
            );

        await interaction.reply({ content: 'Select your age:', components: [row, row2, row3] });
    },

    // ------------------------------------------------------------------------------
};