const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction, MessageAttachment } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { findMMMessageLog } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'mmtest',
    description: 'modmail log test',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The user to get the info of',
            type: OPTION.USER,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const user = interaction.options.getMember('user');
        const guild = interaction.guild.id

        const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setAuthor(`${user.user.username}#${user.user.discriminator}'s messages`)
            .setDescription(`Messages from ${user}`)
            .setFooter({ text: "Corebot" })
            .setTimestamp();
        const userId = (await findMMMessageLog(guild, user.id)).UserId
        const userName = (await findMMMessageLog(guild, user.id)).UserName
        const messages = await findMMMessageLog(guild, user.id);
        const messagesFormatted = messages.map(m =>
            `${m.timestamp.toLocaleString()} ${m.type} ${userName}(${userId}): ${m.message.replaceAll('\n', ' ')}`,
        );
        const file = new MessageAttachment(
            Buffer.from(messagesFormatted.join('\n')),
            `ModMailLog.txt`,
        );
        await interaction.reply({
            embeds: [embed],
            files: [file],
        });
    },

    // ------------------------------------------------------------------------------
};