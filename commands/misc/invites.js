const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
const everyone = require('../../config.json').PERMS.EVERYONE;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'invites',
    description: 'Generates invites for all servers the bot is in',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: true,
    default_permission: false,
    permissions: [
        ...admin_roles.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: true,
            };
        }),
        ...everyone.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: false,
            };
        }),
        ...dev_users.map(user => {
            return {
                id: user,
                type: 'USER',
                permission: true,
            };
        }),
    ],

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