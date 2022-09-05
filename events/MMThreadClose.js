const fn = require('../util/genUtils')
const { getModmailChannel } = require('../db/dbAccess');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message, MessageAttachment } = require('discord.js');
const { findMMMessageLog } = require('../db/dbAccess');
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
            if (modmail.content === "!close") {
                const guild = modmail.guild.id
                const channel = await modmail.client.channels.fetch((await getModmailChannel(guild)).modMailChannel);
                const thread = modmail.channelId
                const threadInfo = await channel.threads.fetch(thread)
                const user = threadInfo.name
                const id = threadInfo.id
                const threads = channel.threads.cache.find(x => x.name === user);

                const embed = new MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor(`${user}'s messages`)
                    .setDescription(`Messages from <@${user}>`)
                    .setFooter({ text: "Corebot" })
                    .setTimestamp();
                const messages = await findMMMessageLog(id);
                const messagesFormatted = messages.map(m =>
                    `${m.timestamp.toLocaleString()} ${m.type} ${m.UserName}(${m.UserId}): ${m.message.replaceAll('\n', ' ')}`,
                );
                const file = new MessageAttachment(
                    Buffer.from(messagesFormatted.join('\n')),
                    `ModMailLog.txt`,
                );
                await channel.send({
                    content: `Thread deleted by <@${modmail.author.id}>`,
                    embeds: [embed],
                    files: [file],
                });

                await threads.delete();
            }
        }
    },




    // ------------------------------------------------------------------------------
};