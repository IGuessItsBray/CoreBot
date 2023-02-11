const fn = require('../util/genUtils')
const { Permissions } = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message } = require('discord.js');
const { getMmCatagory, getMmChannel, setMmInfo } = require('../db/dbAccess');
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'modmail Buttons',
    type: 'interactionCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId.startsWith('newTicket')) {
            const guildId = interaction.guild.id
            const userId = interaction.user.id
            const guild = interaction.guild
            const c = await getMmCatagory(guildId)
            const lc = await getMmChannel(guildId)
            const catagory = c.catagory
            const logChannel = await interaction.client.channels.fetch(lc.channel);
            const modal = new Modal()
                .setCustomId('newTicket')
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
                if (modal.customId === 'newTicket') {
                    const reason = modal.getTextInputValue('reason');
                    const ticket = await guild.channels.create(`${interaction.user.username}s ticket`, {
                        type: 'GUILD_TEXT',
                        topic: `Ticket for ${interaction.user.username}#${interaction.user.discriminator}`,
                        parent: catagory,
                        permissionOverwrites: [
                            {
                                id: interaction.user.id,
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
A new modmail ticket was opened by <@${interaction.user.id}> - <#${ticket.id}>
Reason:
\`\`\`${reason}\`\`\``)
                        .setFooter("Corebot")
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] });
                    ticket.send(`This ticket is now active!
Ticket opened by: <@${interaction.user.id}>
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


        }
    }




    // ------------------------------------------------------------------------------
};