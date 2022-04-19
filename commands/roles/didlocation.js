const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'didlocation',
    description: 'Select your location!',
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
                    .setCustomId('rolebutton_945046953786474497')
                    .setLabel('Europe')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945046954658906183')
                    .setLabel('North America')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945046955015409705')
                    .setLabel('South America')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945046955816538132')
                    .setLabel('Asia')
                    .setStyle('PRIMARY'),
            );
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_945046957133553694')
                    .setLabel('Africa')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945046956516978778')
                    .setLabel('Oceania')
                    .setStyle('PRIMARY'),
            );

        await interaction.reply({ content: 'Select your age:', components: [row, row2] });
    },

    // ------------------------------------------------------------------------------
};