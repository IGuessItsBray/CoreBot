const { time } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { setMmCatagory, setMmLogChannel, setMmChannel } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'sendbutton',
    description: 'Send the start modmail button!',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

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
        const embed = new MessageEmbed()
            .setColor("#3a32a8")
            .setAuthor("Modmail!")
            .setDescription("Press this button to open a modmail thread!")
            .setFooter("Corebot")
            .setTimestamp();
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('newTicket')
                    .setLabel('Open a thread!')
                    .setStyle('PRIMARY'),
            );
        await channel.send({ embeds: [embed], components: [row] });
        interaction.reply({ content: 'Message sent', ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};