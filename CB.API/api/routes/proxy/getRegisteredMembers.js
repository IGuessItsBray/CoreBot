// ------------------------------------------------------------------------------
// getRegisteredMembers.js
// Get your registered members via api
// ------------------------------------------------------------------------------

module.exports = async function (req, res) {
  const { getMembers } = require("../../../../CB.bot/db/dbProxy");
  const userProxyMembers = await getMembers(req.user);
  const membersArray = Array.from(userProxyMembers);
  res.status(200).json(membersArray);
};

// ------------------------------------------------------------------------------
