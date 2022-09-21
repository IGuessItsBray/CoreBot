const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message, MessageButton } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'newthread',
    description: 'Start a new modmail thread',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = true) {
        if (interaction.channel.type == 'GUILD_TEXT') {
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
            await interaction.user.send({ embeds: [embed], components: [row] })
            interaction.reply({ content: 'Check your DMs!', ephemeral: true })
        }
        if (interaction.channel.type == 'DM') {
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
            await interaction.user.send({ embeds: [embed], components: [row] })
            interaction.reply({ content: 'Click the button to start a modmail thread!', ephemeral: true })
        }
    },

    // ------------------------------------------------------------------------------
};