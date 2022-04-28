const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'invites',
    description: 'Generates invites for all servers the bot is in',
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
        var invites = [];
        await Promise.all(
            interaction.client.guilds.cache.map(async guild => {
                const channel = guild.channels.cache
                    .filter((channel) => channel.type === 'GUILD_TEXT')
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