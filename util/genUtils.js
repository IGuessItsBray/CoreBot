// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------
module.exports = {
	getAppFacts,
	getDateAndTime
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
