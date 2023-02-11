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

    name: 'setcatagory',
    description: 'Set the catagory of modmail threads',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'catagory',
            description: 'The catagory to open threads within',
            type: OPTION.CHANNEL,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
       const catagory = interaction.options.getChannel('catagory')
       const guildId = interaction.guild.id
       await setMmCatagory(guildId, catagory)
       interaction.reply("Catagory set!")
    },

    // ------------------------------------------------------------------------------
};