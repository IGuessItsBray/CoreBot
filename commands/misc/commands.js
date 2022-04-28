const { MessageEmbed } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'commands',
    description: 'Lists all server commands!',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: true,
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
        const guildCommands =
            (await interaction.guild.commands.fetch())
                .map(command => {
                    return {
                        name: command.name,
                        description: command.description ?? '*No description*',
                    };
                });

        const embed = new MessageEmbed();

        guildCommands.map(command => {
            embed.addField(command.name, command.description);
        });

        await interaction.reply({
            embeds: [embed],
        });
    },

    // ------------------------------------------------------------------------------
};