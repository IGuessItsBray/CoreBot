const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'tag',
    description: 'Test tags.',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: true,
    default_permission: true,
    permissions: [],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    
    async execute(interaction, ephemeral = false) {
        const { guild } = interaction;
        const target = await interaction.guild.members.fetch(interaction.targetId);
        const Embed = new MessageEmbed()
            .setColor("000000")
            .addFields(
                {
                    name: "Tag Test",
                    value: [
                        `Name: <@950525282434048031>`,
                    ].join("\n"),
                },
            )
            .setFooter({ text: "o/ Hi There" })
            .setTimestamp();

        interaction.reply({ embeds: [Embed] });
    },

    // ------------------------------------------------------------------------------
};