const { time } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { setMmCatagory, setMmChannel } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'setchannel',
    description: 'Set the channel of modmail logs',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'channel',
            description: 'The channel to send logs to',
            type: OPTION.CHANNEL,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
       const channel = interaction.options.getChannel('channel')
       const guildId = interaction.guild.id
       await setMmChannel(guildId, channel)
       interaction.reply("Channel set!")
    },

    // ------------------------------------------------------------------------------
};