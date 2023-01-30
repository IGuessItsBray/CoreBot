const fn = require('../util/genUtils')
const { getModmailChannel } = require('../db/dbAccess');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message, MessageAttachment } = require('discord.js');
const { createMember } = require('../db/dbAccess');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'ModalSubmit',
    type: 'modalSubmit',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(modal) {
        if (modal.customId === 'newproxymember') {
            const name = modal.getTextInputValue('name');
            const pronouns = modal.getTextInputValue('prns');
            const desc = modal.getTextInputValue('desc');
            const owner = modal.user.id
            createMember(owner, name, desc, pronouns)
            modal.reply(
`Name: **${name}**
Pronouns: *${pronouns}*
Description: \`\`\`${desc}\`\`\``,
            );
        }
    },




    // ------------------------------------------------------------------------------
};