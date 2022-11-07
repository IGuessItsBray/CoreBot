const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
const { getMember } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'proxy-info',
    description: 'finds the info for a specific proxy',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'member',
            description: 'The member to search',
            type: OPTION.STRING,
            required: true,
            autocomplete: true
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const id = interaction.options.getString('member')
        const member = await getMember(id)
        const embed = new MessageEmbed()
        .setColor(member.color)
        .setAuthor({ name: member.name, iconURL: member.avatar})
        .setThumbnail(member.avatar)
        .setDescription(`
        Pronouns: ${member.pronouns}
        Proxy: ${member.proxy}
        Color: ${member.color}`)
        .setFooter("CB | Proxy")
        .setTimestamp();
        interaction.reply({embeds: [embed], ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};