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
const messageCreateSchema = require('./schemas/messageCreateSchema');
const userCountsSchema = require('./schemas/userCountsSchema');
const punishmentSchema = require('./schemas/punishmentSchema');
const mediaChannelSchema = require('./schemas/mediaChannelSchema')
const proxySchema = require('./schemas/proxySchema')
const serverSettingsSchema = require('./schemas/serverSettingsSchema');
const userSchema = require('./schemas/userSchema');
const mmSchema = require('./schemas/modMailSchema');
const userMmSchema = require('./schemas/userMmSchema');
const tboxSchema = require('./schemas/tboxLogger');
// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
	//----
	//Warnings
	//----
	newWarning,
	//delWarning,
	getWarnings,
	//----
	//Role Buttons
	//----
	updateRoleButtons,
	getRoleButtons,
	//delRoleButtons,
	getGuildRolebuttons,
	//----
	//Tags
	//----
	newTag,
	//delTag,
	getTag,
	getGuildTags,
	//----
	//Logs
	//----
	updateGuild,
	//----
	//Verify
	//----
	setVerifyChannel,
	setVerifyPassword,
	setVerifySuccessMessage,
	setVerifyFailMessage,
	setVerifyRoleAdd,
	//----
	//Message Log
	//----
	updateMessageLog,
	setDeletedMessageLog,
	findMessageLog,
	//----
	//Message Count
	//----
	addToUser,
	findUserCount,
	//----
	//CrossChat
	//----
	setCrossChatChannel,
	//----
	//Reports
	//----
	setReportChannel,
	//----
	//Punishment Tracker
	//----
	addPunishments,
	getPunishments,
	//----
	//Join/leave
	//----
	setJoin,
	setLeave,
	//----
	//Modmail
	setMmCatagory,
	setMmChannel,
	getMmCatagory,
	getMmChannel,
	setMmInfo,
	getMmInfo,
	deleteMmInfo,
	//----
	//Media Channel
	//----
	setMediaChannel,
	getMediaChannel,
	//----
	//Proxying
	//----
	createMember,
	setAvatar,
	setTags,

	getServerSettings,

	getMembers,
	getMembersByTag,
	getMemberByID,
	setColor,

	//----
	//User
	//----
	//NupdateMessageLog,
	//NsetDeletedMessageLog,
	//NfindMessageLog,
	//NaddPunishment,
	//NgetPunishment,
	//NaddMmThread,
	//NgetMmThread,
	//NaddToUser,
	//NfindUserCount,
	setTboxContent,
	getTboxContent,
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

async function updateGuild(guildId, logChannel, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					_id: guildId,
					logChannel: logChannel,
					name: name,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getServerSettings(guildId) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOne({ _id: guildId });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}


//Verify

//Fail msg
async function setVerifyFailMessage(guildId, failMessage, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					failMessage: failMessage,
					name: name,
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
async function setVerifySuccessMessage(guildId, successMessage, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					successMessage: successMessage,
					name: name,
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
async function setVerifyPassword(guildId, password, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					password: password,
					name: name,
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
async function setVerifyRoleAdd(guildId, role, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					addRole: role,
					name: name,
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
async function setVerifyChannel(guildId, channel, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					verifyChannelId: channel,
					name: name,
				},
				{ new: true, upsert: true },
			);
		}
		catch (e) {
			console.error(`dbAccess: ${e}`);
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
async function setCrossChatChannel(guildId, channel, whId, whToken, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					ccChannelId: channel,
					webhookId: whId,
					webhookToken: whToken,
					name: name,
				},
				{ new: true, upsert: true },
			);
		}
		catch (e) {
			console.error(`dbAccess: ${e}`);
		}
	});
}

//-----------
//Reporting
//-----------
async function setReportChannel(guildId, channelId, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					_id: guildId,
					reportChannelId: channelId,
					name: name,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
//-----------
//Punishment Tracking
//-----------
async function addPunishments(guild, user, type, message, timestamp, staffUser) {
	return await mongo().then(async () => {
		try {
			return await punishmentSchema.create(
				{
					guild: guild,
					user: user,
					type: type,
					message: message,
					timestamp: timestamp,
					staffUser: staffUser
				},
			);
		}
		catch (e) {
			console.error(`dbAccess: ${e}`);
		}
	});
}
async function getPunishments(user) {
	return await mongo().then(async () => {
		try {
			return await punishmentSchema.find({
				//guild: guild,
				user: user,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
//-----------
//Join/Leave
//-----------
async function setJoin(guildId, channel, message, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					_id: guildId,
					joinChannel: channel,
					joinMessage: message,
					name: name,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
async function setLeave(guildId, channel, message, name) {
	return await mongo().then(async () => {
		try {
			return await serverSettingsSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					_id: guildId,
					leaveChannel: channel,
					leaveMessage: message,
					name: name,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
//-----------
//Modmail
//-----------
async function setMmCatagory(guildId, catagory) {
	return await mongo().then(async () => {
		try {
			return await mmSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					guildId: guildId,
					catagory: catagory,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
async function setMmChannel(guildId, channel) {
	return await mongo().then(async () => {
		try {
			return await mmSchema.findOneAndUpdate(
				{ _id: guildId },
				{
					guildId: guildId,
					channel: channel,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getMmCatagory(guildId) {
	return await mongo().then(async () => {
		try {
			return await mmSchema.findOne({ _id: guildId });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getMmChannel(guildId) {
	return await mongo().then(async () => {
		try {
			return await mmSchema.findOne({ _id: guildId });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getMmInfo(guildId, userId) {
	return await mongo().then(async () => {
		try {
			return await userMmSchema.findOne({
				guildId,
				userId,
			});
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function deleteMmInfo(guildId, userId, channelId) {
	return await mongo().then(async () => {
		try {
			return await userMmSchema.findOneAndDelete({
				guildId,
				userId,
				channelId,
			});
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function setMmInfo(guildId, userId, channelId, reason) {
	const id = (Math.round(Date.now())).toString(36).toUpperCase();
	return await mongo().then(async () => {
		try {
			return await userMmSchema.findOneAndUpdate(
				{ _id: id },
				{
					guildId: guildId,
					userId: userId,
					channelId: channelId,
					reason: reason
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
//-----------
//Media Channel
//-----------
async function setMediaChannel(guild, channel) {
	return await mongo().then(async () => {
		try {
			return await mediaChannelSchema.findOneAndUpdate(
				{ _id: guild },
				{
					_id: guild,
					channel: channel,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getMediaChannel(guild) {
	return await mongo().then(async () => {
		try {
			return await mediaChannelSchema.findOne({ _id: guild });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
//-----------
//Proxying
//-----------
async function createMember(owner, name, desc, pronouns) {
	const id = (Math.round(Date.now())).toString(36).toUpperCase();
	const date = Date.now();
	return await mongo().then(async () => {
		try {
			return await proxySchema.findOneAndUpdate(
				{ _id: id },
				{
					_id: id,
					owner: owner,
					name: name,
					desc: desc,
					pronouns: pronouns,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function setAvatar(id, avatar) {
	return await mongo().then(async () => {
		try {
			return await proxySchema.findOneAndUpdate(
				{ _id: id },
				{
					avatar: avatar,
				},
				{ new: false, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function setTags(id, tags) {
	return await mongo().then(async () => {
		try {
			return await proxySchema.findOneAndUpdate(
				{ _id: id },
				{
					tags: tags,
				},
				{ new: false, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getMembers(owner) {
	return await mongo().then(async () => {
		try {
			return await proxySchema.find({
				owner: owner,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getMembersByTag(owner, tags) {
	return await mongo().then(async () => {
		try {
			return await proxySchema.find({
				owner: owner,
				tags: tags,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getMemberByID(id) {
	return await mongo().then(async () => {
		try {
			return await proxySchema.findOne(
				{ _id: id },
			);
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function setColor(id, color) {
	return await mongo().then(async () => {
		try {
			return await proxySchema.findOneAndUpdate(
				{ _id: id },
				{
					color: color,
				},
				{ new: false, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

//-------------------------------
//TBox Logger Fix
//-------------------------------
async function setTboxContent(guild, content) {
	return await mongo().then(async () => {
		try {
			return await tboxSchema.findOneAndUpdate(
				{ _id: guild },
				{
					guild: guild,
					content: content,
				},
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getTboxContent(guild) {
	return await mongo().then(async () => {
		try {
			return await tboxSchema.findOne({ _id: guild });
		}
		catch (e) {
			console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}