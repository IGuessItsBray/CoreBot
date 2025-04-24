// ------------------------------------------------------------------------------
// info.js
// /api/client
// Get information about the api and the bot
// ------------------------------------------------------------------------------

// const axios = require('axios');
const { client } = require("../../../api");
const { execSync } = require('child_process');

module.exports = info;

// ------------------------------------------------------------------------------

async function info (req, res) {
    res.status(200).json({
        bot: {
            name: client.user.username,
            avatar: client.user.avatarURL({ size: 512 }) || client.user.defaultAvatarURL,
        },
        api: {
            tag: execSync('git describe --tags --always').toString().trim(),
        },
    });
}