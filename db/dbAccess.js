// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require('./mongo').mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------

const warningSchema = require('./schemas/warningSchema');

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
	newWarning,
	//delWarning,
	//getWarning,
	getWarnings,
};

// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

async function newWarning(guild, user, mod, reason) {

	// Define the variables that are set automatically
	// we don't want to set these manually every time we call this function
	const id = (Math.round(Date.now())).toString(36).toUpperCase();
	const date = Date.now();

	return await mongo().then(async () => {
		try {
			//console.log(`dbAccess: ${arguments.callee.name}: using ${JSON.stringify(Object.values(arguments))}`);

			// Create the new warning using warningSchema.create
			return await warningSchema.create({
				_id: id,
				guildId: guild.id,
				userId: user.id,
				modId: mod.id,
				reason: reason.slice(0, 250), // Max 250 characters
				timestamp: date,
			});

		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
async function getWarnings(guild, user) {
	return await mongo().then(async () => {
		try {
			return await warningSchema.find({
				guildId: guild.id,
				userId: user?.id ?? user,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}