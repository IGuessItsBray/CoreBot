const warnModel = require('../../models/warnModel');
const { MessageEmbed } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'rmvwarn',
    description: 'Removes a warning from a user',
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
            name: 'warnid',
            description: 'The warn ID you want to delete',
            type: 'STRING',
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const warnId = interaction.options.getString("warnid");
        const data = await warnModel.findById(warnId);

        if (!data)
            return interaction.reply({
                content: `${warnId} is not a valid ID!`
            })

        data.delete();
        const user = interaction.guild.members.cache.get(data.userId)
        return interaction.reply({ content: `Removed one of ${user}'s warnings!`})
    },

    // ------------------------------------------------------------------------------
};