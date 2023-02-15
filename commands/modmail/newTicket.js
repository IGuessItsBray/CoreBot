const { time } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, Events, PermissionsBitField, PermissionFlagsBits, ChannelType } = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { getMmCatagory, getMmChannel, setMmInfo } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'newticket',
    description: 'Manually start a ticket with a user',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The user to start a ticket with',
            type: OPTION.USER,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const member = interaction.options.getMember('user')
        const guildId = interaction.guild.id
        const userId = member.user.id
        const guild = interaction.guild
        const c = await getMmCatagory(guildId)
        const lc = await getMmChannel(guildId)
        const catagory = c.catagory
        const logChannel = await interaction.client.channels.fetch(lc.channel);
        const modal = new ModalBuilder()
            .setCustomId('newTicketMan')
            .setTitle('New ticket!')
        const reason = new TextInputBuilder()
            .setCustomId('reason')
            .setLabel('Reason')
            .setStyle('Paragraph')
            .setPlaceholder('Why are you starting this thread?')
            .setRequired(true)
        const row = new ActionRowBuilder().addComponents(reason);
        modal.addComponents(row);
        await interaction.showModal(modal);
        interaction.client.on(Events.InteractionCreate, async (interaction) => {
            if (interaction.isModalSubmit() && interaction.customId.startsWith('newTicketMan')) {
                const guild = interaction.guild
                const reason = interaction.fields.getTextInputValue('reason');
                const ticket = await guild.channels.create({
                    name: `${member.user.username}s ticket`,
                    type: ChannelType.GuildText,
                    topic: `Ticket for ${member.user.username}#${member.user.discriminator}`,
                    parent: catagory,
                    permissionOverwrites: [
                        {
                            id: member.user.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages,
                            ],
                        },
                    ],
                })
                ticket.permissionOverwrites.create(ticket.guild.roles.everyone, { ViewChannel: false });
                const embed = new EmbedBuilder()
                    .setColor("#3a32a8")
                    .setAuthor({ name: 'New Ticket' })
                    .setDescription(`
A new staff ticket was opened by <@${interaction.user.id}> for <@${member.user.id}> - <#${ticket.id}>
Reason:
\`\`\`${reason}\`\`\``)
                    .setFooter({ text: `CoreBot` })
                    .setTimestamp();
                await logChannel.send({ embeds: [embed] });
                ticket.send(`This ticket is now active!
Ticket opened by: <@${interaction.user.id}>
Ticket opened for: <@${member.user.id}>
With reason: 
\`\`\`${reason}\`\`\``)
                const channelId = ticket.id
                await setMmInfo(guildId, userId, channelId, reason)
                interaction.reply({ content: `Ticket opened - <#${ticket.id}>`, ephemeral: true })
            }
        })
    },

    // ------------------------------------------------------------------------------
};