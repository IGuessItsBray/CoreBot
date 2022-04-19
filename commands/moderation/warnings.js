const warnModel = require('../../models/warnModel');
//const moment = require('moment');
const { MessageEmbed } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'warnings',
    description: 'Shows a users warnings',
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
            description: 'The person who you want to view warnings of',
            type: 'USER',
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const user = interaction.options.getUser("user");
        const userWarnings = await warnModel.find({
            userId: user.id,
            guildId: interaction.guildID
        })

        if (!userWarnings?.length)
            return interaction.reply({
                content: `${user} has no warnings in this server!`
            })
        const embedDescription = userWarnings.map((warn) => {
            const moderator = interaction.guild.members.cache.get(
                warn.moderatorId
            );

            return [
                `warnId: ${warn._id}`,
                `Moderator: ${moderator || `Is no longer in the server`}`,
                //`Date: ${moment(warn.timestamp).format("MMMM Do YYYY")}`,
                `Reason: ${warn.reason}`,
            ].join("\n");
        })
            .join("\n\n");

        const embed = new MessageEmbed()
            .setTitle(`${user.tag}'s warnings`)
            .setDescription(embedDescription)
            .setColor("RANDOM")

        interaction.reply({ embeds: [embed] });
    },

    // ------------------------------------------------------------------------------
};