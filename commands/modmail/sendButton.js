const { time } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType } = require("discord.js");
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { setMmCatagory, setMmLogChannel, setMmChannel } = require('../../db/dbAccess');
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
                    .setCustomId('newTicket')
                    .setLabel('Open a thread!')
                    .setStyle(ButtonStyle.Primary),
            );
        await channel.send({ embeds: [embed], components: [row] });
        interaction.reply({ content: 'Message sent', ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};