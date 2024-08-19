// ------------------------------------------------------------------------------
// getRegisteredMembers.js
// Get your registered members via api
// ------------------------------------------------------------------------------

module.exports = async function (req, res) {
  const { getMembers } = require("../../../db/dbProxy");
  const owner = req.user
  const userProxyMembers = await getMembers(owner);
  const membersArray = Array.from(userProxyMembers);
  res.status(200).json(membersArray);
};

// ------------------------------------------------------------------------------
