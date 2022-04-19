const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'tiktok',
    description: 'The link to bugs tiktok!',
    type: 'CHAT_INPUT',
    guild_id: [`945205088287326248`],
    enabled: true,
    default_permission: true,
    permissions: [
    ],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = true) {
        await interaction.reply('https://www.tiktok.com/@.___.bug');
    },

    // ------------------------------------------------------------------------------
};