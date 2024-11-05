const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'sample',
    description: 'An example command',
    type: ApplicationCommandType.ChatInput,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        //{
			//name: '',
			//description: '',
			//type: ApplicationCommandOptionType.String,
			//required: true,
		//},
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
	},

    // ------------------------------------------------------------------------------
};