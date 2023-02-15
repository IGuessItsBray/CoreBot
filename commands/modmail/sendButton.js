const { time } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, TextInputBuilder, ModalBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { setMmCatagory, setMmLogChannel, setMmChannel, setMmInfo, getMmCatagory, getMmChannel } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'sendbutton',
    description: 'Send the start modmail button!',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'channel',
            description: 'The channel to send the button to',
            type: OPTION.CHANNEL,
            required: false,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const embed = new EmbedBuilder()
            .setColor("#3a32a8")
            .setAuthor({ name: 'Modmail' })
            .setDescription("Press this button to open a modmail thread!")
            .setFooter({ text: `CoreBot` })
            .setTimestamp();
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('nt')
                    .setLabel('Open a thread!')
                    .setStyle(ButtonStyle.Primary),
            );
        await channel.send({ embeds: [embed], components: [row] });
        interaction.reply({ content: 'Message sent', ephemeral: true })
    },
    buttonHandling: async function (interaction) {
        if (interaction.isButton() && interaction.customId.startsWith('nt')) {
            //console.log(interaction)
            const modal = new ModalBuilder()
                .setCustomId('ntms')
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
        }
    },
    modalHandling: async function (interaction) {
        if (interaction.isModalSubmit() && interaction.customId.startsWith('ntms')) {
            //console.log(interaction)
            const guildId = interaction.guild.id
            const userId = interaction.user.id
            const guild = interaction.guild
            const c = await getMmCatagory(guildId)
            const lc = await getMmChannel(guildId)
            const catagory = c.catagory
            const logChannel = await interaction.client.channels.fetch(lc.channel);
            const reason = interaction.fields.getTextInputValue('reason');
            const ticket = await guild.channels.create({
                name: `${interaction.user.username}s ticket`,
                type: ChannelType.GuildText,
                topic: `Ticket for ${interaction.user.username}#${interaction.user.discriminator}`,
                parent: catagory,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
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
A new ticket was opened by <@${interaction.user.id}> - <#${ticket.id}>
Reason:
\`\`\`${reason}\`\`\``)
                .setFooter({ text: `CoreBot` })
                .setTimestamp();
            await logChannel.send({ embeds: [embed] });
            ticket.send(`This ticket is now active!
Ticket opened by: <@${interaction.user.id}>
With reason: 
\`\`\`${reason}\`\`\``)
            const channelId = ticket.id
            await setMmInfo(guildId, userId, channelId, reason)
            interaction.reply({ content: `Ticket opened - <#${ticket.id}>`, ephemeral: true })
        }
    }

    // ------------------------------------------------------------------------------
};