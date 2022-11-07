const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { getMemberByID } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'infocontext',
    type: COMMAND.MESSAGE,
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


        const message = await interaction.targetMessage.fetch()
        const { content, webhookId } = message;

        if (!webhookId) return await interaction.reply({content: 'This is a non-proxied message!', ephemeral: true});

        //console.log(content);

        const metaRegex = /\[\u200b\]\(meta?:((.*,?)+)\)/
        const [authorId, proxyId] = content.match(metaRegex)[1].split(',')

        //console.log(authorId)
        //console.log(proxyId)
        const _id = proxyId
        const member = await getMemberByID(_id)
        const embed = new MessageEmbed()
        .setColor(member.color)
        .setAuthor({ name: member.name, iconURL: member.avatar})
        .setThumbnail(member.avatar)
        .setDescription(`
        Pronouns: ${member.pronouns}
        Proxy: ${member.proxy}
        Color: ${member.color}
        Member ID: ${member._id}
        Main Account: <@${member.userID}>`)
        .setFooter("CB | Proxy")
        .setTimestamp();
        interaction.reply({embeds: [embed], ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};