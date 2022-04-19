const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction} = require('discord.js');
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
        //Brays Place
        {
            id: "804915620654350346",
            type: "ROLE",
            permission: false
        },
        {
            id: "938247355684249631",
            type: "ROLE",
            permission: true
        },
        {
            id: "938244544653320272",
            type: "ROLE",
            permission: true
        },
        //Bug
        {
            id: "948663216353976350",
            type: "ROLE",
            permission: true
        },
        {
            id: "945205088287326248",
            type: "ROLE",
            permission: false
        },
        //Brays User ID
        {
            id: "530845321270657085",
            type: "USER",
            permission: true
        },
        {
            id: "952281210229522482",
            type: "ROLE",
            permission: true
        },
        {
            id: "944832140028297246",
            type: "ROLE",
            permission: false
        },
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
        interaction.client.guilds.cache.forEach(async (guild) => {
            const channel = guild.channels.cache
                .filter((channel) => channel.type === 'text')
                .first();
            await channel
            guild.invites.create(channel)
                .then(async (invite) => {
                    invites.push(`${guild.name} - ${invite.url}`);
                })
                .catch((error) => console.log(error));
            console.log(invites);
        });
        await channel.send(invites)
        await interaction.editReply(`Invites sent`, { ephemeral: true });
    },

    // ------------------------------------------------------------------------------
};