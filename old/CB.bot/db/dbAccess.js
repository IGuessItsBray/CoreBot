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
const mmSchema = require("./schemas/modMailSchema");
const userMmSchema = require("./schemas/userMmSchema");
const crosschatSchema = require("./schemas/crossChatSchema");
const errorSchema = require("./schemas/errorSchema");
const { type } = require("../events/CCMessageCreate");
// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
  getServerSettings,
  getManyServerSettings,
  setCrossChatChannel,
  getCrossChatChannel,
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

  //----
  //Verify
  //----
  setVerifyChannel,
  setVerifyPassword,
  setVerifySuccessMessage,
  setVerifyFailMessage,
  setVerifyRoleAdd,

  //----
  //CrossChat
  //----
  setCrossChatChannel,

  //----
  //Reports
  //----
  setReportChannel,

  //Modmail
  setMmCatagory,
  setMmChannel,
  getMmCatagory,
  getMmChannel,
  setMmInfo,
  getMmInfo,
  deleteMmInfo,

  setJoin,
  setLeave,

  //----
  //Error Hadnling
  //----
  addException,
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

async function getManyServerSettings() {
  return await mongo().then(async () => {
    try {
      return await serverSettingsSchema.find({});
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
        { new: true, upsert: true }
      );
    } catch (e) {
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
        { new: true, upsert: true }
      );
    } catch (e) {
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
        { new: true, upsert: true }
      );
    } catch (e) {
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
        { new: true, upsert: true }
      );
    } catch (e) {
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
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`dbAccess: ${e}`);
    }
  });
}

//Crosschat
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
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`dbAccess: ${e}`);
    }
  });
}
async function getCrossChatChannel() {
  return await mongo().then(async () => {
    try {
      return await crosschatSchema.find({});
    } catch (e) {
      console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

//Reporting
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
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}
//Join/Leave
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
        { new: true, upsert: true }
      );
    } catch (e) {
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
        { new: true, upsert: true }
      );
    } catch (e) {
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
        { new: true, upsert: true }
      );
    } catch (e) {
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
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function getMmCatagory(guildId) {
  return await mongo().then(async () => {
    try {
      return await mmSchema.findOne({ _id: guildId });
    } catch (e) {
      console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function getMmChannel(guildId) {
  return await mongo().then(async () => {
    try {
      return await mmSchema.findOne({ _id: guildId });
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function setMmInfo(guildId, userId, channelId, reason) {
  const id = Math.round(Date.now()).toString(36).toUpperCase();
  return await mongo().then(async () => {
    try {
      return await userMmSchema.findOneAndUpdate(
        { _id: id },
        {
          guildId: guildId,
          userId: userId,
          channelId: channelId,
          reason: reason,
        },
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbAccess: ${arguments.callee.name}: ${e}`);
    }
  });
}

//-----------
//Punishment Tracking
//-----------
async function addPunishments(
  guild,
  user,
  type,
  message,
  timestamp,
  staffUser
) {
  return await mongo().then(async () => {
    try {
      return await punishmentSchema.create({
        guild: guild,
        user: user,
        type: type,
        message: message,
        timestamp: timestamp,
        staffUser: staffUser,
      });
    } catch (e) {
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
    } catch (e) {
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
        guild: guild,
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

//-----------
//Error Handling
//-----------
async function addException(exception, interaction, guild, channel, user) {
    return await mongo().then(async () => {
        try {
            return await errorSchema.create({
                time: new Date(),
                identifier: Math.random().toString(36).substring(2, 12).toUpperCase(),
                exception,
                interaction,
                type,
                guild,
                channel,
                user,
            });
        }
        catch (err) {
            console.error(err);
        }
    });
}