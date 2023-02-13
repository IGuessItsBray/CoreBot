const { time } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { Modal, TextInputBuilder, SelectMenuComponent, showModal } = require('discord-modals');
const { setMmCatagory, setMmChannel } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'setcatagory',
    description: 'Set the catagory of modmail threads',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

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