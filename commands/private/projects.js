const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const GitHubProject = import("github-project")
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'projects',
    description: 'Outputs a list of all things in the CoreBot repo\'s project',
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

    async execute(interaction) {
        const { default: GitHubProject } = await import('github-project');
        const project = new GitHubProject({
            owner: "IGuessItsBray",
            number: 1,
            token: "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",
        });
        const items = await project.items.list()
        console.log(await project.items.list());
        const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setAuthor(`CoreBot Projects`)
            .setDescription(`CB Projects:
            ${items}`)
            .setFooter("CoreBot 2022")
            .setTimestamp();
        interaction.reply({ embeds: [embed]});
    },

    // ------------------------------------------------------------------------------
};