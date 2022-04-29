const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'help',
    description: 'Replies with the bots information and commands',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'page',
            description: 'The sytle of the button',
            choices: [
                { name: 'Page 1 | About', value: '1' },
                { name: 'Page 2 | Commands', value: '2' },
                { name: 'Page 3 | ', value: '3' },
                { name: 'Page 4 | ', value: '4' },
            ],
            type: OPTION.STRING,
            required: false,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const page = interaction.options.getString('page');
        if (page === '1') {

            const { guild } = interaction;
            const target = await interaction.guild.members.fetch(interaction.targetId);
            const Embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor({
                    name: "Help and Info!",
                    iconURL: guild.iconURL({ dynamic: true }),
                })
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields(
                    {
                        name: "***Bot Info***",
                        value: [
                            `Name: <@950525282434048031>`,
                            `Bot Owner: <@530845321270657085>`,
                            `Description: This bot is a multi-purpose Discord bot, Coded in Discord.js by <@530845321270657085> containing work from <@111592329424470016>`,
                        ].join("\n"),
                    },
                    {
                        name: "***Features***",
                        value: [
                            `Corebot also contains other features, such as:`,
                            `Connect To Voice - always active connection to a VC`,
                            `24/7 Hosting`,
                            `ModMail support`,
                            `Music support`,
                            `React roles via Discord buttons`,
                            `Audit Logs`,
                            `Join and Leave messages`,
                            `Cross Server Chat`,
                        ].join("\n"),
                    },
                    {
                        name: "***Coming soon!***",
                        value: [
                            `Twitch live alerts`,
                        ].join("\n"),
                    },
                    {
                        name: "***Credits***",
                        value: [
                            `Credits to <@111592329424470016> for development help`,
                            `Credits to Khaaz for Cross Server Chat`,
                            `Credits to FlisherOfatale for audit logs`,
                        ].join("\n"),
                    }
                )
                .setFooter({ text: "Contact Bray#1051 with any issues, questions, or suggestions!" })
                .setTimestamp();

            interaction.reply({ embeds: [Embed] });
        }
        else if (page === '2') {
            const Commands =
                (await interaction.client.application.commands.fetch())
                    .map(command => {
                        return {
                            name: command.name,
                            description: command.description ?? '*No description*',
                        };
                    });

            const embed = new MessageEmbed();
            console.log(Commands)
            Commands.map(command => {
                embed.setTitle("Commands!")
                embed.addField(command.name, command.description);
            });

            await interaction.reply({
                embeds: [embed],
            });
        }
    },

    // ------------------------------------------------------------------------------
};