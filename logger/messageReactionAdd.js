const fn = require('../util/genUtils')
const { getReportChannel } = require('../db/dbAccess');
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
    async execute(reaction, user) {
        if (reaction.emoji.name === '🚫') {
            if (reaction.partial) {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message:', error);
                    return;
                }
            }
            const content = reaction.message.content
            const msgauthor = reaction.message.author
            const reportUser = user.id
            const msgchannel = reaction.message.channelId
            const msgLink = reaction.message.url
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
                        .setCustomId('dismiss')
                        .setLabel('Dismiss')
                        .setStyle('SECONDARY'),
                );

            await reportChannel.send({ embeds: [embed], components: [actions] });
            reaction.message.reactions.cache.get('🚫').remove()
            reaction.client.on('interactionCreate', interaction => {
                if (interaction.isButton() && interaction.customId.startsWith('kick')) {
                    msgauthor.send(`You were kicked from **\`${interaction.guild.name}\`** after being reported. You were kicked by ${interaction.member}`).catch(err => { })
                    msgauthor.kick("Kicked via report");
                    interaction.reply(`${msgauthor} kicked by ${interaction.member}`);
                }
                if (interaction.isButton() && interaction.customId.startsWith('ban')) {
                }
                if (interaction.isButton() && interaction.customId.startsWith('dismiss')) {
                }
            });
        }

    },

    // ------------------------------------------------------------------------------
};