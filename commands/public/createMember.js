const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
const { createMember } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'create-member',
    description: 'create a new proxy member',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'name',
            description: 'The name for the member',
            type: OPTION.STRING,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const name = interaction.options.getString('name');
        const userID = interaction.user.id
        await createMember(name, userID)
        interaction.reply({ content: `New member created with name of ${name}`, ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};