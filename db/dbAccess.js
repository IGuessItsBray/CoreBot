// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require('./mongo').mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------

const warningSchema = require('./schemas/warningSchema');
const rolebuttonSchema = require('./schemas/rolebuttonSchema');

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
	newWarning,
	//delWarning,
	//getWarning,
	getWarnings,
	updateRoleButtons,
	getRoleButtons,
	// deleteRoleButtons,
	getGuildRolebuttons,
};

// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

//Warnings

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

//Role Buttons

async function updateRoleButtons(id, guild, embedTitle, embedText, embedFooter, buttons) {
	if (id && !buttons) throw 'No buttons provided';

	id = id ?? (Math.round(Date.now())).toString(36).toUpperCase();
	buttons = buttons ?? [];

	return await mongo().then(async () => {
		try {
			return await rolebuttonSchema.findOneAndUpdate(
				{
					_id: id,
				},
				{
					_id: id,
					guild: guild?.id ?? guild,
					embed: {
						title: embedTitle,
						text: embedText,
						footer: embedFooter,
					},
					buttons: buttons,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getRoleButtons(id, guild) {
	return await mongo().then(async () => {
		try {
			return await rolebuttonSchema.findOne({
				_id: id,
				guild: guild,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getGuildRolebuttons(guild) {
    return await mongo().then(async () => {
        try {
            return await rolebuttonSchema.find({
                guild: guild,
            });
        }
        catch (e) {
            console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
        }
    });
}