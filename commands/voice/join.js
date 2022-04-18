module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'join',
    description: 'have the bot Join your channel',
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