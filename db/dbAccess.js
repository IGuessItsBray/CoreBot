// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require('./mongo').mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------

const warningSchema = require('./schemas/warningSchema');
const rolebuttonSchema = require('./schemas/rolebuttonSchema');
const tagSchema = require('./schemas/tagSchema');
const setupSchema = require('./schemas/setupSchema');
const verifySchema = require('./schemas/verifySchema');
const messageCreateSchema = require('./schemas/messageCreateSchema');
const userCountsSchema = require('./schemas/userCountsSchema');
const crosschatSchema = require('./schemas/crosschatSchema');
const reportSchema = require('./schemas/reportSchema');

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
	newWarning,
	//delWarning,
	getWarnings,
	updateRoleButtons,
	getRoleButtons,
	//delRoleButtons,
	getGuildRolebuttons,
	newTag,
	//delTag,
	getTag,
	getGuildTags,
	updateGuild,
	getLogChannel,
	getVerifyConfig,
	setVerifyChannel,
	setVerifyPassword,
	setVerifySuccessMessage,
	setVerifyFailMessage,
	setVerifyRoleAdd,
	updateMessageLog,
	setDeletedMessageLog,
	findMessageLog,
	addToUser,
	findUserCount,
	//----
	//CrossChat
	//----
	setCrossChatChannel,
	getCrossChatChannel,
	//----
	//Reports
	//----
	setReportChannel,
	getReportChannel,
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

//Tags
async function newTag(id, guild, embedTitle, embedText, embedFooter, buttons) {

	id = id ?? (Math.round(Date.now())).toString(36).toUpperCase();
	buttons = buttons ?? [];

	return await mongo().then(async () => {
		try {
			return await tagSchema.findOneAndUpdate(
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
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getTag(id, guild) {
	return await mongo().then(async () => {
		try {
			return await tagSchema.findOne({
				_id: id,
				guild: guild,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getGuildTags(guild) {
	return await mongo().then(async () => {
		try {
			return await tagSchema.find({
				guild: guild,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

// ------------------------------------------------------------------------------
// Server Setup
// ------------------------------------------------------------------------------

//Audit logs

async function updateGuild(guildId, logChannel) {
	return await mongo().then(async () => {
		try {
			return await setupSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					_id: guildId,
					logChannel: logChannel,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getLogChannel(guildId) {
	return await mongo().then(async () => {
		try {
			return await setupSchema.findOne({ _id: guildId });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}


//Verify

//Fail msg
async function setVerifyFailMessage(guildId, failMessage) {
	return await mongo().then(async () => {
		try {
			return await verifySchema.findOneAndUpdate(
				{
					guildId: guildId,
				},
				{
					failMessage: failMessage,
				},
				{ new: true, upsert: true },
			);
		}
		catch (e) {
			console.error(`dbAccess: ${e}`);
		}
	});
}

//Success Msg
async function setVerifySuccessMessage(guildId, successMessage) {
	return await mongo().then(async () => {
		try {
			return await verifySchema.findOneAndUpdate(
				{
					guildId: guildId,
				},
				{
					successMessage: successMessage,
				},
				{ new: true, upsert: true },
			);
		}
		catch (e) {
			console.error(`dbAccess: ${e}`);
		}
	});
}

//Password
async function setVerifyPassword(guildId, password) {
	return await mongo().then(async () => {
		try {
			return await verifySchema.findOneAndUpdate(
				{
					guildId: guildId,
				},
				{
					password: password,
				},
				{ new: true, upsert: true },
			);
		}
		catch (e) {
			console.error(`dbAccess: ${e}`);
		}
	});
}

//Role
async function setVerifyRoleAdd(guildId, role) {
	return await mongo().then(async () => {
		try {
			return await verifySchema.findOneAndUpdate(
				{
					guildId: guildId,
				},
				{
					addRole: role,
				},
				{ new: true, upsert: true },
			);
		}
		catch (e) {
			console.error(`dbAccess: ${e}`);
		}
	});
}

//Channel
async function setVerifyChannel(guildId, channel) {
	return await mongo().then(async () => {
		try {
			return await verifySchema.findOneAndUpdate(
				{
					guildId: guildId,
				},
				{
					channelId: channel,
				},
				{ new: true, upsert: true },
			);
		}
		catch (e) {
			console.error(`dbAccess: ${e}`);
		}
	});
}

//Get Config
async function getVerifyConfig(guild) {
	return await mongo().then(async () => {
		try {
			return await verifySchema.findOne({
				guildId: guild,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
//Message Logger (Not deleted)
async function updateMessageLog(messageObj) {
	const {
		guild,
		channel,
		author,
		content,
		mentions,
		createdAt,
		editedAt,
		attachments,
		url,
		id,
	} = messageObj;

	return await mongo().then(async () => {
		try {
			return await messageCreateSchema.findOneAndUpdate(
				{ messageId: id },
				{
					guild: guild.id,
					channel: channel.id,
					user: author.id,
					content: content,
					userMentions: mentions.users.map(u => u.id ?? u),
					roleMentions: mentions.roles.map(r => r.id ?? r),
					timestamp: createdAt,
					edited: editedAt ? true : false,
					editedTimestamp: editedAt,
					deleted: false,
					attachments: attachments.map(a => a.url ?? a),
					messageLink: url,
					messageId: id,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

//Message Logger (deleted)
async function setDeletedMessageLog(messageObj) {
	const {
		id,
	} = messageObj;

	return await mongo().then(async () => {
		try {
			return await messageCreateSchema.findOneAndUpdate(
				{ messageId: id },
				{
					deleted: true,
				},
				{ upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
async function findMessageLog(user) {
	return await mongo().then(async () => {
		try {
			return await messageCreateSchema.find({
				user: user,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

//Message/Char counter
async function addToUser(userId, guildId, messageInc, characterInc) {
	return await mongo().then(async () => {
		try {
			return await userCountsSchema.findOneAndUpdate(
				{
					'user': userId,
					'guild': guildId,
				},
				{
					$inc: {
						'messages': messageInc,
						'characters': characterInc,
					},
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function findUserCount(userId, guildId) {
	return await mongo().then(async () => {
		try {
			return await userCountsSchema.findOne({
				'user': userId,
				'guild': guildId,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

//----------
//Crosschat
//----------
async function setCrossChatChannel(guildId, channel, whId, whToken) {
	return await mongo().then(async () => {
		try {
			return await crosschatSchema.findOneAndUpdate(
				{
					guildId: guildId,
				},
				{
					channelId: channel,
					webhookId: whId,
					webhookToken: whToken,
				},
				{ new: true, upsert: true },
			);
		}
		catch (e) {
			console.error(`dbAccess: ${e}`);
		}
	});
}
async function getCrossChatChannel() {
	return await mongo().then(async () => {
		try {
			return await crosschatSchema.find({});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

//-----------
//Reporting
//-----------
async function setReportChannel(guildId, channelId) {
	return await mongo().then(async () => {
		try {
			return await reportSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					_id: guildId,
					channelId: channelId,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getReportChannel(guildId) {
	return await mongo().then(async () => {
		try {
			return await reportSchema.findOne({ _id: guildId });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}