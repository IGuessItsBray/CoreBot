const { time } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, Events, PermissionsBitField, PermissionFlagsBits, ChannelType } = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { setAvatar, setColor } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'setcolor',
    description: 'Set the members color',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'member',
            description: 'The member to add proxy tags',
            type: OPTION.STRING,
            required: true,
            autocomplete: true,
        },
        {
            name: 'color',
            description: 'color for the member',
            type: OPTION.STRING,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const _id = interaction.options.getString('member')
        const color = interaction.options.getString('color');
        const member = await setColor(_id, color)
        interaction.reply(`
color set!
${color}`)

    },

    // ------------------------------------------------------------------------------
};