const { time } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { getMmCatagory, getMmChannel, setMmInfo } = require('../../db/dbAccess');
const { Permissions } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'newticket',
    description: 'Manually start a ticket with a user',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

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
        const modal = new Modal()
            .setCustomId('newTicketMan')
            .setTitle('New ticket!')
            .addComponents(
                new TextInputComponent() // We create a Text Input Component
                    .setCustomId('reason')
                    .setLabel('Reason')
                    .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                    .setPlaceholder('Why are you starting this thread?')
                    .setRequired(true), // If it's required or not.
            );
        showModal(modal, {
            client: interaction.client, // Client to show the Modal through the Discord API.
            interaction: interaction, // Show the modal with interaction data.
        });
        interaction.client.on('modalSubmit', async (modal) => {
            if (modal.customId === 'newTicketMan') {
                const reason = modal.getTextInputValue('reason');
                const ticket = await guild.channels.create(`${member.user.username}s ticket`, {
                    type: 'GUILD_TEXT',
                    topic: `Ticket for ${member.user.username}#${member.user.discriminator}`,
                    parent: catagory,
                    permissionOverwrites: [
                        {
                            id: member.user.id,
                            allow: [
                                Permissions.FLAGS.VIEW_CHANNEL,
                                Permissions.FLAGS.SEND_MESSAGES,
                            ],
                        },
                    ],
                })
                ticket.permissionOverwrites.create(ticket.guild.roles.everyone, { VIEW_CHANNEL: false });
                const embed = new MessageEmbed()
                    .setColor("#3a32a8")
                    .setAuthor("New ticket!")
                    .setDescription(`
A new staff ticket was opened by <@${interaction.user.id}> for <@${member.user.id}> - <#${ticket.id}>
Reason:
\`\`\`${reason}\`\`\``)
                    .setFooter("Corebot")
                    .setTimestamp();
                await logChannel.send({ embeds: [embed] });
                ticket.send(`This ticket is now active!
Ticket opened by: <@${interaction.user.id}>
Ticket opened for: <@${member.user.id}>
With reason: 
\`\`\`${reason}\`\`\``)
                modal.reply({
                    content:
                        `
Thread opened!
<#${ticket.id}>
\`\`\`${reason}\`\`\`
                    `, ephemeral: true
                })
                const channelId = ticket.id
                await setMmInfo(guildId, userId, channelId, reason)
            }
        });
        //interaction.reply({ content: 'Message sent', ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};