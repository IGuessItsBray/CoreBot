// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require("./mongo").mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------
const serverSettingsSchema = require("./schemas/serverSettingsSchema");
const tboxSchema = require("./schemas/tboxLogger");
const userCountsSchema = require("./schemas/userCountsSchema");
const messageCreateSchema = require("./schemas/messageCreateSchema");
const userData = require("./schemas/userDataSchema");
const proxySchema = require("./schemas/proxySchema");
const logSchema = require("./schemas/logSchema");
const proxyGroupSchema = require("./schemas/proxyGroupSchema");
const proxyMsgCreateSchema = require("./schemas/proxyMsgCreateSchema");
const userDataSchema = require("./schemas/userDataSchema");
const punishmentSchema = require("./schemas/punishmentSchema");
// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
  getServerSettings,
  //----
  //Logs
  //----
  setLogChannel,

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
  purgeUserInfo,
  addPunishments,
  getPunishments,

  //----
  //Guild Tracking
  //----
  purgeGuildConfig,
  addMasterLog,
  getMasterLogs,
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
    } catch (e) {
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
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function getTboxContent(guild) {
  return await mongo().then(async () => {
    try {
      return await tboxSchema.findOne({ _id: guild });
    } catch (e) {
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

//-------------------------------
//User Data
//-------------------------------

//Message/Char counter
async function addToUser(userId, guildId, messageInc, characterInc) {
  return await mongo().then(async () => {
    try {
      return await userCountsSchema.findOneAndUpdate(
        {
          user: userId,
          guild: guildId,
        },
        {
          $inc: {
            messages: messageInc,
            characters: characterInc,
          },
        },
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function findUserCount(userId, guildId) {
  return await mongo().then(async () => {
    try {
      return await userCountsSchema.findOne({
        user: userId,
        guild: guildId,
      });
    } catch (e) {
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
          userMentions: mentions.users.map((u) => u.id ?? u),
          roleMentions: mentions.roles.map((r) => r.id ?? r),
          timestamp: createdAt,
          edited: editedAt ? true : false,
          editedTimestamp: editedAt,
          deleted: false,
          attachments: attachments.map((a) => a.url ?? a),
          messageLink: url,
          messageId: id,
        },
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

//Message Logger (deleted)
async function setDeletedMessageLog(messageObj) {
  const { id } = messageObj;

  return await mongo().then(async () => {
    try {
      return await messageCreateSchema.findOneAndUpdate(
        { messageId: id },
        {
          deleted: true,
        },
        { upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}
async function findMessageLog(user, guild) {
  return await mongo().then(async () => {
    try {
      return await messageCreateSchema.find({
        user: user,
        guild: guild
      });
    } catch (e) {
      console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function findMessages(user) {
  return await mongo().then(async () => {
    try {
      return await messageCreateSchema.find({});
    } catch (e) {
      console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function purgeUserInfo(user) {
  let owner = user;
  return await mongo().then(async () => {
    try {
      await messageCreateSchema.deleteMany({ user: user });
      await proxyGroupSchema.deleteMany({ owner: owner });
      await proxySchema.deleteMany({ owner: owner });
      await userCountsSchema.deleteMany({ user: user });
      await userDataSchema.deleteMany({ user: user });
    } catch (e) {
      console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

//-------------------------------
//Guild Logging
//-------------------------------

async function purgeGuildConfig(guildId) {
  return await mongo().then(async () => {
    try {
      return await serverSettingsSchema.deleteMany({ _id: guildId });
    } catch (e) {
      console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function addMasterLog(message) {
  return await mongo().then(async () => {
    try {
      return await logSchema.create({
        time: new Date(),
        message,
      });
    } catch (e) {
      console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

// get x number of most recent logs, all logs if x is not specified
async function getMasterLogs(x) {
  return await mongo().then(async () => {
    try {
      return (await logSchema.find().sort({ time: -1 }).limit(x)) ?? [];
    } catch (e) {
      console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}
