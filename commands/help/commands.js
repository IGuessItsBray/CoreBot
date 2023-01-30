const { MessageEmbed } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'commands',
    description: 'Lists all server commands!',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

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