module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'leave',
    description: 'have the bot Leave your channel',
    type: 'CHAT_INPUT', // CHAT_INPUT, USER, MESSAGE
    guild_id: [],
    enabled: true,

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