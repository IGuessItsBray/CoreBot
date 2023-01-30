const fn = require('../../util/genUtils')
const { getModmailChannel } = require('../../db/dbAccess');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message, MessageButton } = require('discord.js');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'Modmail',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(modmail) {
        if (modmail.author.bot) return;
        if (modmail.channel.type == 'DM') {
            if (modmail.content === "!newthread") {
                const embed = new MessageEmbed()
                    .setAuthor('CoreBot')
                    .setDescription("Click me to select a server and start a ModMail thread")
                    .setFooter({ text: "Corebot | ModMail" })
                    .setTimestamp();
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('nt')
                            .setLabel('New Thread!')
                            .setStyle('PRIMARY'),
                    );
                await modmail.author.send({ embeds: [embed], components: [row] })
            }
        }
    }




    // ------------------------------------------------------------------------------
};