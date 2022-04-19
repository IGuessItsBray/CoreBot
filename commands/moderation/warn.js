const warnModel = require('../../models/warnModel');

const { MessageEmbed } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'warn',
    description: 'Warns a user',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: false,
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

    options: [
        {
            name: 'user',
            description: 'The person who you want to warn',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason to warn     member',
            type: 'STRING',
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        new warnModel({
            userId: user.id,
            guildId: interaction.guild_id,
            moderatorId: interaction.user.id,
            reason,
            timestamp: Date.now(),

        }).save();

        user.send(
            `You have been warned in ${interaction.guild.name} for ${reason}`).catch(console.log);

        interaction.reply({
            content: `${user} has been warned for ${reason}`
        })
    },

    // ------------------------------------------------------------------------------
};