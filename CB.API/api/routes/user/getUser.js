// ------------------------------------------------------------------------------
// getUser.js
// /api/user/:id
// returns a user object of the user with the given id
// ------------------------------------------------------------------------------

module.exports = async function (req, res) {
    const { client } = require('../../../api');

    const id = req.params.id ?? req.token.user;

    const user = await client.users.fetch(id);

    res.send(user);

}

// ------------------------------------------------------------------------------