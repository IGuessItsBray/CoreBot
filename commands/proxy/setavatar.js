const { time } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, Events, PermissionsBitField, PermissionFlagsBits, ChannelType } = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { setAvatar } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'setavatar',
    description: 'Add an avatar to a member',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'member',
            description: 'The member to add an avatar to',
            type: OPTION.STRING,
            required: true,
            autocomplete: true,
        },
        {
            name: 'avatar',
            description: 'The avatar for your member',
            type: OPTION.ATTACHMENT,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const config = require('../../util/localStorage');
        const channel = await interaction.client.channels.fetch(config.PROXYAVATARSTORAGE)
        const _id = interaction.options.getString('member')
        const a = interaction.options.getAttachment('avatar');
        const message = await channel.send({
            files: [a]
        });
        const { url } = message.attachments.first();
        const avatar = url
        const member = await setAvatar(_id, avatar)
        interaction.reply(`
Avatar set!
${avatar}`)
    },

    // ------------------------------------------------------------------------------
};