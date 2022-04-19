const { ContextMenuInteraction, MessageEmbed, Intents } = require("discord.js");
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'userinfo',
    description: '',
    type: 'USER',
    guild_id: [],
    enabled: true,

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const Response = new MessageEmbed()
            .setColor("AQUA")
            .setAuthor(target.user.tag, target.user.avatarURL({
                dynamic: true,
                size: 512
            }))
            .setThumbnail(target.user.avatarURL({
                dynamic: true,
                size: 512
            }))
            .addField("ID", `${target.user.id}`)
            .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "none"}`)
            .addField("Member Since", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
            .addField("Discord User Since", `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)

        interaction.reply({
            embeds: [Response],
            ephemeral: true
        })
    },

    // ------------------------------------------------------------------------------
};