const fn = require('../util/genUtils')
const { getModmailChannel } = require('../db/dbAccess');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { getModmailGuild, updateMMMessageLog, getMediaChannel } = require('../db/dbAccess');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'Modmail DM Message Create Event',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(modmail) {
        if (modmail.author.bot) return;
        if (modmail.channel.type == 'DM') {
            const UserId = modmail.author.id;
            const guild = await getModmailGuild(UserId)
            const guildId = guild.guildId
            const channel = await modmail.client.channels.fetch((await getModmailChannel(guildId)).modMailChannel);
            const mediaChannel = await modmail.client.channels.fetch('1016439163760939068')
            const threads = (await channel.threads.fetchActive()).threads;
            const existingThread = threads.find(thread => thread.name.startsWith(UserId));
            if (!existingThread) {
                channel.threads.create({
                    name: `${modmail.author.id}`,
                    autoArchiveDuration: 1440,
                    reason: `Modmail thread for user: ${modmail.author}`,
                }).then(channel => channel.send(`New ModMail Thread by: <@${modmail.author.id}> \`${modmail.author.tag}\``));
            }
            else {
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
                    await existingThread.send({
                        content: message,
                        embeds: [embed]
                    });

                    const guild = guildId
                    const UserId = modmail.author.id
                    const UserName = modmail.author.tag
                    const type = "DM Msg"
                    const timestamp = modmail.createdAt
                    const thread = channel.threads.cache.find(x => x.name === UserId);
                    const id = thread.id
                    await updateMMMessageLog(guild, UserId, UserName, message, type, timestamp, id)
                }
            }
        }
    },




    // ------------------------------------------------------------------------------
};