const { MessageEmbed } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'purge',
    description: 'purge',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'number',
            description: '1-100',
            type: OPTION.INTEGER,
            required: true
        }
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const msgnum = interaction.options.getInteger('number')
        interaction.channel.bulkDelete(msgnum);
        interaction.reply({ content: 'Messages Deleted!', ephemeral: true });
        //interaction.channel.send({ content: 'Messages Deleted', ephemeral: true });
    },

    // ------------------------------------------------------------------------------
};