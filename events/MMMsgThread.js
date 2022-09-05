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
            const UserId = modmail.author.id;
            const guild = await getModmailGuild(UserId)
            const guildId = guild.guildId
            const channel = await modmail.client.channels.fetch((await getModmailChannel(guildId)).modMailChannel);
            const mediaChannel = await modmail.client.channels.fetch('1016439163760939068')
                        const threads = (await channel.threads.fetchActive()).threads;
            const existingThread = threads.find(thread => thread.name.startsWith(UserId));
            if (existingThread.id !== modmail.channel.id) return;
            const userId = existingThread.name
            const user = await modmail.guild.members.fetch(userId)
            if (modmail.content.startsWith("!r")) {
                const content = modmail.content
                const cleanContent = content.replace(/^!r/i, '').trim()
                const embed = new MessageEmbed()
                    .setAuthor({
                        name: `${modmail.author.tag}`,
                        iconURL: `${modmail.author.avatarURL()}`
                    })
                    .setDescription(`${cleanContent}`)
                    .setFooter({ text: "Corebot ModMail" })
                    .setTimestamp();
                const attachments = modmail.attachments.map(a => { return { attachment: a.url } });
                const newMessage = await mediaChannel.send({
                    files: attachments.length > 0 ? attachments : undefined,
                });
                const urls = newMessage.attachments.map(a => a.url).join('\n');
                const message = `${cleanContent}\n${urls}`
                await user.send({
                    content: message,
                    embeds: [embed]
                });

                const guild = guildId
                const UserId = modmail.author.id
                const UserName = modmail.author.tag
                const type = "Thread Msg"
                const timestamp = modmail.createdAt
                const id = existingThread.id
                await updateMMMessageLog(guild, UserId, UserName, message, type, timestamp, id)
            }
        }
        else if (modmail.channel.type !== 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD') {
        }
    },




    // ------------------------------------------------------------------------------
};