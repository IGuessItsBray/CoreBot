const fn = require('../util/genUtils')
const { newWarning, addPunishments, getReportChannel } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents, MessageActionRow, MessageButton } = require("discord.js");
const report = require('../modules/report');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageReactionAdd Example',
    type: 'messageReactionAdd',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(reaction, usr) {
        if (reaction.emoji.name === '🚫') {
            if (reaction.partial) {
                try {
                    await reaction.fetch();
                    //console.log(usr.id)
                } catch (error) {
                    console.error('Something went wrong when fetching the message:', error);
                    return;
                }
            }
            const content = reaction.message.content
            const msgauthor = reaction.message.author
            const guild = await reaction.message.guild.fetch()
            const userdata = await guild.members.fetch(msgauthor)
            const user = userdata.user.id
            const reportUser = usr.id
            const msgchannel = reaction.message.channelId
            const msgLink = reaction.message.url
            const message = content
            const msgId = reaction.message.id
            const guildId = reaction.message.guildId
            const reportChannel = await reaction.client.channels.fetch((await getReportChannel(guildId)).channelId);
            const messageTime = Math.floor(reaction.message.createdAt.getTime() / 1000.0);
            const timestamp = `<t:${messageTime}:R>, <t:${messageTime}:F>`
            const embed = new MessageEmbed()
                .setColor('#E10600')
                .setAuthor('Report!')
                .setDescription(`Report from <@${reportUser}> in <#${msgchannel}>
                Message from: ${msgauthor}
                \`\`\`
${content}
                \`\`\`
                Sent: ${timestamp}
                [Message](<${msgLink}}>)`)
                .setFooter({ text: "Corebot" })
                .setTimestamp();
            const actions = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('kick')
                        .setLabel('Kick')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('ban')
                        .setLabel('Ban')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('warn')
                        .setLabel('Warn')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('timeout')
                        .setLabel('Timeout')
                        .setStyle('DANGER'),
                );
            const actions2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('delete')
                        .setLabel('Delete Msg')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('dismiss')
                        .setLabel('Dismiss')
                        .setStyle('SECONDARY'),
                );
            await reportChannel.send({ embeds: [embed], components: [actions, actions2] });
            const type = "report"
            const staffUser = reportUser
            //console.log(reportUser)
            addPunishments(
                guildId,
                user,
                type,
                message,
                timestamp,
                staffUser
            )
            reaction.message.reactions.cache.get('🚫').remove()
            reaction.client.on('interactionCreate', interaction => {
                if (interaction.isButton() && interaction.customId.startsWith('kick')) {
                    userdata.send(`You were kicked from **\`${interaction.guild.name}\`** after being reported. You were kicked by ${interaction.member}`).catch(err => { })
                    userdata.kick("Kicked via report");
                    interaction.reply(`${msgauthor} kicked by ${interaction.member}`);
                    interaction.message.fetch(interaction.message.id).then(msg => msg.delete());
                    const type = "kick"
                    const staffUser = interaction.member.id
                    addPunishments(
                        guildId,
                        user,
                        type,
                        message,
                        timestamp,
                        staffUser
                    )
                }
                if (interaction.isButton() && interaction.customId.startsWith('ban')) {
                    userdata.send(`You were banned from **\`${interaction.guild.name}\`** after being reported. You were banned by ${interaction.member}`).catch(err => { })
                    userdata.ban("Banned via report");
                    interaction.reply(`${msgauthor} banned by ${interaction.member}`);
                    interaction.message.fetch(interaction.message.id).then(msg => msg.delete());
                    const type = "ban"
                    const staffUser = interaction.member.id
                    addPunishments(
                        guildId,
                        user,
                        type,
                        message,
                        timestamp,
                        staffUser
                    )
                }
                if (interaction.isButton() && interaction.customId.startsWith('timeout')) {
                    const reason = "Timed out for reported message!"
                    userdata.send(`You were timed out in **\`${interaction.guild.name}\`** after being reported. You were timed out by ${interaction.member}. This timeout lasts for 10 minutes!`).catch(err => { })
                    userdata.timeout(10 * 60 * 1000, reason);
                    interaction.reply(`${msgauthor} timed out by ${interaction.member}`);
                    interaction.message.fetch(interaction.message.id).then(msg => msg.delete());
                    const type = "timeout"
                    const staffUser = interaction.member.id
                    addPunishments(
                        guildId,
                        user,
                        type,
                        message,
                        timestamp,
                        staffUser
                    )
                }
                if (interaction.isButton() && interaction.customId.startsWith('warn')) {
                    const reason = "Warning for reported message!"
                    const warning = newWarning(
                        guild,
                        user,
                        interaction.user,
                        reason
                    );
                    interaction.reply(`Warned ${msgauthor} for ${reason}`)
                    interaction.message.fetch(interaction.message.id).then(msg => msg.delete());
                    const type = "warn"
                    const staffUser = interaction.member.id
                    addPunishments(
                        guildId,
                        user,
                        type,
                        message,
                        timestamp,
                        staffUser
                    )
                }
                if (interaction.isButton() && interaction.customId.startsWith('delete')) {
                    reaction.message.fetch(reaction.message.id).then(msg => msg.delete());
                    interaction.reply(`Message deleted by ${interaction.user}`)
                    interaction.message.fetch(interaction.message.id).then(msg => msg.delete());
                    const type = "msgdelete"
                    const staffUser = interaction.member.id
                    addPunishments(
                        guildId,
                        user,
                        type,
                        message,
                        timestamp,
                        staffUser
                    )
                }
                if (interaction.isButton() && interaction.customId.startsWith('dismiss')) {
                    interaction.reply(`Report dismissed by ${interaction.user}`)
                    interaction.message.fetch(interaction.message.id).then(msg => msg.delete());
                }
            });
        }

    },

    // ------------------------------------------------------------------------------
};