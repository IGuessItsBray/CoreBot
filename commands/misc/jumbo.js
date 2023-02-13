const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'jumbo',
    description: 'Make an emoji big.',
    type: ApplicationCommandType.ChatInput,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
			name: 'in',
			description: 'The emoji to make jumbo!',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
		const emojiRegex = /(<(a)?:.+?:|)(\d+|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])(>|)/g;
		const rawEmotes = [];
		const files = [];

		// Get the input of emote(s)
		const input = interaction.options.getString('in');

		// Get the emojis from the input && add them to the rawEmotes array
		// preserve EITHER the ID of custom emoji, or unicode
		let lastMatch;
		while (emojiRegex.global && (lastMatch = emojiRegex.exec(input))) {
			// if the element is a custom emoji
			// determine if it is animated, and add the appropriate file extension
			if(lastMatch[1]) {
				if(lastMatch[2]) rawEmotes.push(lastMatch[3] + '.gif');
				else rawEmotes.push(lastMatch[3] + '.png');
			}
			// if the element is a unicode emoji
			// add the unicode to the array with no file extension
			else {
				rawEmotes.push(lastMatch[3]);
			}
		}

		// Get the files from the rawEmotes array and format them as files
		// TODO swap this for a MAP
		rawEmotes.forEach(e => {
			if(/\d+?/.test(e)) files.push({ attachment: `https://cdn.discordapp.com/emojis/${e}` });
			else files.push({ attachment: `https://twemoji.maxcdn.com/v/latest/72x72/${e.codePointAt(0).toString(16)}.png` });
		});

		// Send the files, or don't if no emotes were found in the input
		if(!files.length) await interaction.reply({ ephemeral: true, content: 'You need to send an emote!' });
		else await interaction.reply({ files: [...files] });
	},

    // ------------------------------------------------------------------------------
};