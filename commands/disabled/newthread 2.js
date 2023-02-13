const { Flags } = require('discord.js').PermissionsBitField;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle, MessageSelectMenu, AttachmentBuilder, StringSelectMenuBuilder, TextInputBuilder, ModalBuilder, ApplicationCommandType, Collection, ApplicationCommandOptionType } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'newthread',
    description: 'Start a new modmail thread',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = true) {
        if (interaction.channel.type == 'GUILD_TEXT') {
            const embed = new EmbedBuilder()
                .setAuthor('CoreBot')
                .setDescription("Click me to select a server and start a ModMail thread")
                .setFooter({ text: "Corebot | ModMail" })
                .setTimestamp();
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('nt')
                        .setLabel('New Thread!')
                        .setStyle(ButtonStyle.Primary),
                );
            await interaction.user.send({ embeds: [embed], components: [row] })
            interaction.reply({ content: 'Check your DMs!', ephemeral: true })
        }
        if (interaction.channel.type == 'DM') {
            const embed = new EmbedBuilder()
                .setAuthor('CoreBot')
                .setDescription("Click me to select a server and start a ModMail thread")
                .setFooter({ text: "Corebot | ModMail" })
                .setTimestamp();
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('nt')
                        .setLabel('New Thread!')
                        .setStyle(ButtonStyle.Primary),
                );
            await interaction.user.send({ embeds: [embed], components: [row] })
            interaction.reply({ content: 'Click the button to start a modmail thread!', ephemeral: true })
        }
    },

    // ------------------------------------------------------------------------------
};