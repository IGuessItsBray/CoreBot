module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'leave',
    description: 'have the bot Leave your channel',
    type: 'CHAT_INPUT', // CHAT_INPUT, USER, MESSAGE
    guild_id: [],
    enabled: true,
    default_permission: false,
    default_member_permissions: 0x8,
    permissions: [],

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