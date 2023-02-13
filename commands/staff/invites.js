const { Client, Intents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, CommandInteraction, ApplicationCommandType, ChannelType } = require('discord.js');
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'invites',
    description: 'Generates invites for all servers the bot is in',
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

    async execute(interaction) {
        var invites = [];
        await Promise.all(
            interaction.client.guilds.cache.map(async guild => {
                const channel = guild.channels.cache
                    .filter((channel) => channel.type === ChannelType.GuildText)
                    .first();
                await channel.guild.invites.create(channel, { temporary: true, maxuses: 1, maxAge: 300 })
                    .then(async (invite) => {
                        invites.push(`${guild.name} - ${invite.url}`);
                    })
                    .catch((error) => console.log(error));
            })
        );
        await interaction.reply({ content: `Invites:\n${invites.join('\n')}`, ephemeral: false });
    },

    // ------------------------------------------------------------------------------
};