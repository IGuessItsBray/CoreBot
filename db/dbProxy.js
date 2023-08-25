// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require("./mongo").mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------
const serverSettingsSchema = require("./schemas/serverSettingsSchema");
const userData = require("./schemas/userDataSchema");
const proxySchema = require("./schemas/proxySchema");
const proxyMsgCreateSchema = require("./schemas/proxyMsgCreateSchema");
// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
  getServerSettings,
  //Proxy AP state
  setAPState,
  setAPMember,
  getAPState,
  //Proxy Setup
  createMember,
  setAvatar,
  setTags,
  setID,
  deleteMember,

  getMembers,
  getMembersByTag,
  getMemberByID,
  setColor,

  getTotalMembers,

  addToProxy,
  findProxyCount,
  updateMessageLog,
  setDeletedMessageLog,
  findMessageLog,
  findMessages,
  findOneMessage,
};

async function getServerSettings(guildId) {
  return await mongo().then(async () => {
    try {
      return await serverSettingsSchema.findOne({ _id: guildId });
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function createMember(
  owner,
  name,
  desc,
  pronouns,
  avatar,
  tags,
  color,
  id
) {
  id =
    id ??
    require("crypto")
      .createHash("sha256")
      .update(Math.random().toString(36).substring(2, 10))
      .digest("hex")
      .substring(0, 8);
  const date = Date.now();
  return await mongo().then(async () => {
    try {
      return await proxySchema.findOneAndUpdate(
        { _id: id },
        {
          _id: id,
          owner: owner,
          name: name,
          desc: desc ?? null,
          pronouns: pronouns ?? null,
          avatar: avatar ?? null,
          tags: tags ?? null,
          color: color,
        },
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}
async function deleteMember(id) {
  return await mongo().then(async () => {
    try {
      return await proxySchema.findOneAndDelete({ _id: id });
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
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
        { new: false, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
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
        { new: false, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function setID(owner, tags, id) {
  return await mongo().then(async () => {
    try {
      return await proxySchema.findOneAndUpdate(
        {
          owner: owner,
          tags: tags,
        },
        {
          _id: id,
        },
        { new: false, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function getMembers(owner) {
  return await mongo().then(async () => {
    try {
      return await proxySchema.find({
        owner: owner,
      });
    } catch (e) {
      console.error(`dbProxy: ${arguments.callee.name}: ${e}`);
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
    } catch (e) {
      console.error(`dbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function getMemberByID(id) {
  return await mongo().then(async () => {
    try {
      return await proxySchema.findOne({ _id: id });
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
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
        { new: false, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function setAPState(id, aps) {
  return await mongo().then(async () => {
    try {
      return await userData.findOneAndUpdate(
        { _id: id },
        {
          user: id,
          autoproxy_state: aps,
        },
        { new: false, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function getAPState(id, aps) {
  return await mongo().then(async () => {
    try {
      return await userData.findOne({ _id: id });
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function setAPMember(id, apmid) {
  return await mongo().then(async () => {
    try {
      return await userData.findOneAndUpdate(
        { _id: id },
        {
          user: id,
          autoproxy_member_id: apmid,
        },
        { new: false, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function getTotalMembers() {
  return await mongo().then(async () => {
    try {
      return await proxySchema.find({});
    } catch (e) {
      console.error(`dbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}
//Message/Char counter
async function addToProxy(_id, messageInc, characterInc) {
  return await mongo().then(async () => {
    try {
      return await proxySchema.findOneAndUpdate(
        {
          _id: _id,
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
      console.error(`dbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function findProxyCount(_id) {
  return await mongo().then(async () => {
    try {
      return await proxySchema.findOne({
        _id: _id,
      });
    } catch (e) {
      console.error(`dbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

//Message Logger (Not deleted)
async function updateMessageLog(guild, channel, author, content, timestamp, attachments, messageId, messageLink, proxy) {

  return await mongo().then(async () => {
    try {
      return await proxyMsgCreateSchema.findOneAndUpdate(
        { messageId: messageId },
        {
          guild: guild.id,
          channel: channel.id,
          author: author.id,
          content: content,
          timestamp: timestamp,
          attachments: attachments,
          messageId: messageId,
          messageLink: messageLink,
          proxy: proxy,
        },
        { new: true, upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

//Message Logger (deleted)
async function setDeletedMessageLog(messageObj) {
  const { id } = messageObj;

  return await mongo().then(async () => {
    try {
      return await proxyMsgCreateSchema.findOneAndUpdate(
        { messageId: id },
        {
          deleted: true,
        },
        { upsert: true }
      );
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}
async function findMessageLog(user) {
  return await mongo().then(async () => {
    try {
      return await proxyMsgCreateSchema.find({
        user: user,
      });
    } catch (e) {
      console.error(`dbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function findMessages() {
  return await mongo().then(async () => {
    try {
      return await proxyMsgCreateSchema.find({});
    } catch (e) {
      console.error(`dbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}

async function findOneMessage(messageLink) {
  return await mongo().then(async () => {
    try {
      return await proxyMsgCreateSchema.findOne({ messageLink: messageLink });
    } catch (e) {
      console.error(`Mongo:\tdbProxy: ${arguments.callee.name}: ${e}`);
    }
  });
}