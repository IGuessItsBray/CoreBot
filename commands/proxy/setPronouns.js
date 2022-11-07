const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
const { setPronouns } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'set-pronouns',
    description: 'adds pronouns to a member',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'member',
            description: 'The member to add pronouns to',
            type: OPTION.STRING,
            required: true,
            autocomplete: true
        },
        {
            name: 'pronouns',
            description: 'The pronouns for the member',
            type: OPTION.STRING,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const id = interaction.options.getString('member')
        const pronouns = interaction.options.getString('pronouns');
        await setPronouns(id, pronouns)
        interaction.reply({ content: `Pronouns ${pronouns} added to member!`, ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};