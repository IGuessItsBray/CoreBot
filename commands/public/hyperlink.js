const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message, MessageButton } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'hyperlink',
    description: 'Create a hyperlink',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
            {
                name: 'text',
                description: 'The text of the message',
                type: OPTION.STRING,
                options: []
            },
            {
                name: 'link',
                description: 'The link of the message',
                type: OPTION.STRING,
                options: []
            },
            {
                name: 'channel',
                description: 'The channel to send to',
                type: OPTION.CHANNEL,
                required: false,
            },
        ],

        // ------------------------------------------------------------------------------
        // Execution
        // ------------------------------------------------------------------------------

        async execute(interaction, ephemeral = true) {
            const msg = interaction.options.getString('text');
            const link = interaction.options.getString('link');
            const channel = interaction.options.getChannel('channel') ?? interaction.channel;
            const content = `[${msg}](${link})`
            await channel.send(content)
            interaction.reply({ content: `Hyperlink sent in ${channel}`, ephemeral: true })
        },

    // ------------------------------------------------------------------------------
};