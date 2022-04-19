const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'join',
    description: 'have the bot Join your channel',
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

        const member = await interaction.member.fetch(true);
        const voiceId = member.voice.channelId;

        if(!voiceId) return;

        const voiceChannel = await interaction.client.channels.fetch(voiceId);

        require('../../modules/ctv').joinChannel(voiceChannel);

        await interaction.reply({
            content: '**Joined!**',
            ephemeral,
        });
    },

    // ------------------------------------------------------------------------------
};