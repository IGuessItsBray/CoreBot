const { InteractionType } = require('discord.js');
// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------
module.exports = {
	getAppFacts,
	getDateAndTime,
	messageComponentCollector,
	color: {
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		reset: '\x1b[0m',
	},
};

// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

async function getAppFacts(client) {

	// Dev Application Info
	const application = await client.application.fetch();

	const adminUsers =
		// team ownership / members
		application.owner.members?.map(m => m.user.id) ??
		// individual application ownership
		[application.owner.id];

	return {
		adminUsers,
	};
}

async function getDateAndTime(dateValue, style) {
	// get the "smart" discord time for either a specificed time, or right now
	try {
		let now = '';
		if (dateValue) {
			now = Math.floor(dateValue / 1000.0);
		}
		else {
			now = Math.floor(new Date().getTime() / 1000.0);
		}
		let time = '';
		switch (style) {
			case 'Full D/T':
				time = `<t:${now}:F>`;
				break;
			case 'Short D/T':
				time = `<t:${now}:f>`;
				break;
			case 'Relative':
				time = `<t:${now}:R>`;
				break;
			default:
				time = `<t:${now}:R>`;
		}
		return time;
	}
	catch {
		console.log(red('error getting time'));
	}
};
async function messageComponentCollector(sourceMessage, timeoutMins = 2) {
	/*
		Remember to fetchReply if calling from command interaction reply!

		const message = await interaction.reply({
			...
			fetchReply: true
		});
	*/
	try {
		const messageComponentInteraction
			= await sourceMessage.channel.awaitMessageComponent({
				filter: i => (i.message.id === sourceMessage.id)
					&& i.type === InteractionType.MessageComponent,
				time: timeoutMins * 60 * 1000,
			});
		return messageComponentInteraction;
	}
	catch (e) {
		if (e?.message?.toLowerCase().includes('reason: time')) { return undefined; }
		else {
			console.error(`genUtils: componentCollector: ${e}`);
			Sentry.captureException(e);
		}
	}
}
