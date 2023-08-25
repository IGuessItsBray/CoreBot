// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require('./mongo').mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------
const serverSettingsSchema = require("./schemas/serverSettingsSchema");
const tboxSchema = require("./schemas/tboxLogger");
const userCountsSchema = require("./schemas/userCountsSchema");
const messageCreateSchema = require("./schemas/messageCreateSchema");
// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
  //----
  //Logs
  //----
  setLogChannel,
  getServerSettings,

  //----
  //User
  //----
  setTboxContent,
  getTboxContent,
  addToUser,
  findUserCount,
  updateMessageLog,
  setDeletedMessageLog,
  findMessageLog,
  findMessages,
};

// ------------------------------------------------------------------------------
// Server Setup
// ------------------------------------------------------------------------------

//Audit logs

async function setLogChannel(guildId, logChannel, name) {
  return await mongo().then(async () => {
    try {
      return await serverSettingsSchema.findOneAndUpdate(
        { _id: guildId },
        {
          _id: guildId,
          logChannel: logChannel,
          name: name,
        },
        { new: true, upsert: true }
      );
    } catch (e) {
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

//-------------------------------
//User Data
//-------------------------------

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

async function findMessages(user) {
	return await mongo().then(async () => {
		try {
			return await messageCreateSchema.find({
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}
