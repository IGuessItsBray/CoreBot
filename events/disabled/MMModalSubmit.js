const fn = require('../util/genUtils')
const { MessageEmbed, MessageActionRow, MessageSelectmodal, Message } = require('discord.js');
const { Modal, TextInputComponent, SelectmodalComponent, showModal } = require('discord-modals');
const { getModmailGuild, getModmailChannel } = require('../db/dbAccess');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'Modmail Modal Submit',
    type: 'modalSubmit',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(modal) {
        if (modal.customId.startsWith('info')) {
            if (modal.content === "!newthread") return;
            const reason = modal.getTextInputValue('ctr');
            const UserId = modal.user.id;
            const guild = await getModmailGuild(UserId)
            const guildId = guild.guildId
            const channel = await modal.client.channels.fetch((await getModmailChannel(guildId)).modMailChannel);
            const threads = (await channel.threads.fetchActive()).threads;
            const existingThread = threads.find(thread => thread.name.startsWith(modal.user.id));
            if (!existingThread) {
                channel.threads.create({
                    name: `${modal.user.id}`,
                    autoArchiveDuration: 1440,
                    reason: `Modmail thread for user: ${modal.user.id}`,
                }).then(channel => channel.send(`New ModMail Thread by: <@${modal.user.id}> \`${modal.user.username}#${modal.user.discriminator}\`
                Reason for contact:
                \`\`\`${reason}\`\`\``));
            }
        }
    }




    // ------------------------------------------------------------------------------
};