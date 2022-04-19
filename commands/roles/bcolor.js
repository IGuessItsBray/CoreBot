const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'color',
    description: 'Select your role color!',
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
                    .setCustomId('rolebutton_947347470353063996')
                    .setLabel('Baby Blue')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947348023061671936')
                    .setLabel('Forest Green')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947348214124802059')
                    .setLabel('Sage Green')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947348468035379200')
                    .setLabel('Grey Blue')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947348549530701854')
                    .setLabel('Crayon Red')
                    .setStyle('PRIMARY'),
            );
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_947358864066621440')
                    .setLabel('Dark Yellow')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947358962150428683')
                    .setLabel('Pastel Purple')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947359046271393843')
                    .setLabel('Dark Pink')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947359149224779806')
                    .setLabel('Dark Orange')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947359335443468298')
                    .setLabel('Pastel Red')
                    .setStyle('PRIMARY'),
            );
        const row3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_947357241286205461')
                    .setLabel('Banana Yellow')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947357303588388895')
                    .setLabel('Orange')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947357564256002089')
                    .setLabel('Sunset Purple')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_947357654727135283')
                    .setLabel('Light Pink')
                    .setStyle('PRIMARY'),
            );
        await interaction.reply({ content: 'Text', components: [row, row2, row3] });
    },

    // ------------------------------------------------------------------------------
};