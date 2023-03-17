const { time } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, Events, PermissionsBitField, PermissionFlagsBits, ChannelType } = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { setAvatar, setTags } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'settags',
    description: 'Add proxy tags',
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
            name: 'tag',
            description: 'Tag for the member (Tags are at the start of a message)',
            type: OPTION.STRING,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const _id = interaction.options.getString('member')
        const t = interaction.options.getString('tag');
        const tags = `${t}`
        const member = await setTags(_id, tags)
        interaction.reply(`
tag set!
${tags}`)

    },

    // ------------------------------------------------------------------------------
};