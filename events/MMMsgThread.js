const fn = require('../util/genUtils')
const { getModmailChannel } = require('../db/dbAccess');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message } = require('discord.js');
const { getModmailGuild, updateMMMessageLog, getMediaChannel } = require('../db/dbAccess');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'Modmail Thread Message Create Event',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(modmail) {
        if (modmail.author.bot) return;
        if (modmail.channel.type === 'GUILD_PUBLIC_THREAD' || modmail.channel.type === 'GUILD_PRIVATE_THREAD') {
            if (modmail.content.startsWith("!r")) {
                const guildId = modmail.guild.id
                const channel = await modmail.client.channels.fetch(modmail.channelId);
                const sendUser = await modmail.guild.members.fetch(channel.name)
                const mediaChannel = await modmail.client.channels.fetch('1016439163760939068')
                const content = modmail.content
                const cleanContent = content.replace(/^!r/i, '').trim()
                const embed = new MessageEmbed()
                    .setAuthor({
                        name: `${modmail.author.tag}`,
                        //iconURL: `${modmail.author.avatarURL()}`
                    })
                    .setDescription(`${cleanContent}`)
                    .setFooter({ text: "Corebot ModMail" })
                    .setTimestamp();
                const attachments = modmail.attachments.map(a => { return { attachment: a.url } });
                if (modmail.attachments.size !== 0) {
                    const newMessage = await mediaChannel.send({
                        files: attachments.length > 0 ? attachments : undefined,
                    });
                    const urls = newMessage.attachments.map(a => a.url).join('\n');
                    const message = `${cleanContent}\n${urls}`
                    await sendUser.send({
                        content: urls,
                        embeds: [embed]
                    });
                } else {
                    await sendUser.send({
                        embeds: [embed]
                    });
                }

                const guild = guildId
                const UserId = modmail.author.id
                const UserName = modmail.author.tag
                const message = `${cleanContent}`
                const type = "Thread Msg"
                const timestamp = modmail.createdAt
                const id = modmail.channelId
                await updateMMMessageLog(guild, UserId, UserName, message, type, timestamp, id)

            }
        }
    },




    // ------------------------------------------------------------------------------
};