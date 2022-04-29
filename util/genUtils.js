// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------
module.exports = {
	getAppFacts,
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