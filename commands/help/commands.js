const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'commands',
    description: 'Lists all server commands!',
    type: ApplicationCommandType.ChatInput,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],

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

        const embed = new EmbedBuilder();

        guildCommands.map(command => {
            embed.addField(command.name, command.description);
        });

        await interaction.reply({
            embeds: [embed],
        });
    },

    // ------------------------------------------------------------------------------
};