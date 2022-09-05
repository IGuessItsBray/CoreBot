const fn = require('../util/genUtils')
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message } = require('discord.js');
const { Modal, TextInputComponent, SelectMenuComponent, showModal  } = require('discord-modals');
const { updateModmailGuild } = require('../db/dbAccess');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'Modmail Menu Submit',
    type: 'interactionCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(modmail) {
        if (modmail.channel.type == 'DM') {
            if (modmail.isSelectMenu() && modmail.customId.startsWith('server')) {
                const UserId = modmail.user.id
                const guildId = modmail.values[0]
                await updateModmailGuild(UserId, guildId)
                const modal = new Modal()
                    .setCustomId('info')
                    .setTitle('Modal')
                    .addComponents(
                        new TextInputComponent()
                            .setCustomId('ctr')
                            .setLabel('Reason for contacting Mods?')
                            .setStyle('LONG')
                            .setPlaceholder('Write your reason for contacting us here!')
                    );
                showModal(modal, {
                    client: modmail.client,
                    interaction: modmail,
                });
            }
        }
    }




    // ------------------------------------------------------------------------------
};