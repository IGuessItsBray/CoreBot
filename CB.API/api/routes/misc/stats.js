// ------------------------------------------------------------------------------
// stats.js
// get stats for the bot
// ------------------------------------------------------------------------------

module.exports = async function (req, res) {
  const { client } = require("../../../api");
    const {
      getTotalMembers,
      findMessages,
    } = require("../../../../CB.bot/db/dbProxy");
  const guilds = client.guilds.cache;
  const gsize = client.guilds.cache.size;
  const csize = client.channels.cache.size;
  const shardCount = client.options.shardCount;
  const proxyMsgs = (await findMessages()).length;
  const totalProxyMembers = (await getTotalMembers()).length;
  const stats = { gsize, csize, shardCount, proxyMsgs, totalProxyMembers }
    res.status(200).json(stats);
};

// ------------------------------------------------------------------------------
