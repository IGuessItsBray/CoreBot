const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'leave',
    description: 'have the bot Leave your channel',
    type: 'CHAT_INPUT', // CHAT_INPUT, USER, MESSAGE
    guild_id: [],
    enabled: true,
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

    async execute(interaction, ephemeral = true) {
        require('../../modules/ctv').leaveChannel(interaction.guild);

        await interaction.reply({
            content: '**Left!**',
            ephemeral,
        });
    },

    // ------------------------------------------------------------------------------
};