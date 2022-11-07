const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { setAvatar } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'set-avatar',
    description: 'adds an avatar to a member',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'member',
            description: 'The member to add proxy to',
            type: OPTION.STRING,
            required: true,
            autocomplete: true
        },
        {
            name: 'avatar',
            description: 'Upload an avatar for your proxy!',
            type: OPTION.ATTACHMENT,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const id = interaction.options.getString('member')
        const image = interaction.options.getAttachment('avatar');
        const avatar = image.url
        await setAvatar(id, avatar)
        interaction.reply({ content: `Avatar set!`, files: image ? [{ attachment: image.url }] : undefined, ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};