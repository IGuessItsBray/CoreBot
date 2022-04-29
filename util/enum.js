// ------------------------------------------------------------------------------
// enum.js
// In lieu of discord.js 14, I'm defining some of my own bootleg enums.
// enums that work the way I want them to suck in pure javascript
// so I freeze everything - it works but it's not very nice.
// ------------------------------------------------------------------------------

const applicationCommandTypes = Object.freeze({
	CHAT_INPUT: 			Number(1),
	USER: 					Number(2),
	MESSAGE: 				Number(3),
});

const applicationCommandOptionTypes = Object.freeze({
	SUB_COMMAND:			Number(1),
	SUB_COMMAND_GROUP:		Number(2),
	STRING:					Number(3),
	INTEGER:				Number(4),
	BOOLEAN:				Number(5),
	USER:					Number(6),
	CHANNEL:				Number(7),
	ROLE:					Number(8),
	MENTIONABLE:			Number(9),
	NUMBER:					Number(10),
	ATTACHMENT:				Number(11),
});

const channelTypes = Object.freeze({
	GUILD_TEXT:				Number(0),
	DM:						Number(1),
	GUILD_VOICE:			Number(2),
	GROUP_DM:				Number(3),
	GUILD_CATEGORY:			Number(4),
	GUILD_NEWS:				Number(5),
	GUILD_NEWS_THREAD:		Number(10),
	GUILD_PUBLIC_THREAD:	Number(11),
	GUILD_PRIVATE_THREAD:	Number(12),
	GUILD_STAGE_VOICE:		Number(13),
	GUILD_DIRECTORY:		Number(14),
	GUILD_FORUM:			Number(15),
});


// ------------------------------------------------------------------------------

class Types {
	static COMMAND = applicationCommandTypes;
	static OPTION = applicationCommandOptionTypes;
	static CHANNEL = channelTypes;
}

// ------------------------------------------------------------------------------

Object.freeze(Types);

Object.freeze(module.exports = {
	Types,
});

// ------------------------------------------------------------------------------