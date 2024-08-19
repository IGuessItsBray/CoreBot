// ------------------------------------------------------------------------------
// guilds.js
// /api/client/guild
// Get all guilds the user is in
// or the guild that is passed in
// ------------------------------------------------------------------------------

const axios = require('axios');
const { client } = require("../../../api");
const { PermissionsBitField: Permissions } = require('discord.js');


module.exports = {
    guild,
    guilds,
}

// ------------------------------------------------------------------------------

async function guild (req, res) {


    res.status(200).json({ message: 'nice' });
}

// ------------------------------------------------------------------------------

async function guilds (req, res) {
    const default_icon = client.user.avatarURL();

    const botGuilds = (await client.guilds.fetch()).map(guild => guild.id);
    const userGuilds = (await requestGuilds(req.token))
        .map(g => {
            const permissions = new Permissions(g.permissions_new).toArray();
            delete g.features;
            delete g.permissions_new;
            delete g.permissions;
            return {
                ...g,
                icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : default_icon,
                admin: permissions.includes('Administrator'),
                mod: permissions.includes('KickMembers') || permissions.includes('BanMembers') || permissions.includes('Administrator')|| g.owner,
                bot: botGuilds.find(b => b === g.id) ? true : false,
                canAdd: permissions.includes('ManageGuild'),
            };
        });

    const guildsWithoutBot = userGuilds.filter(g => !g.bot && (g.owner || g.admin || g.mod));//.sort(sortGuilds2);
    const guildsWithBot = userGuilds.filter(g => g.bot);//.sort(sortGuilds2);

    res.status(200).json({ guilds: [...guildsWithBot, ...guildsWithoutBot].sort(sortGuilds) });

}

// ------------------------------------------------------------------------------

async function requestGuilds (token) {
    const resp = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: {
            authorization: `${token.type} ${token.access}`,
        },
    }).catch((e) => {return e.response;});
    if (resp.status !== 200) {
        return [];
    }
    return resp.data;
}

// function sortGuilds(a, b) {
// 	if (a.owner && !b.owner) return -1;
// 	if (b.owner && !a.owner) return 1;
// 	if (a.admin && !b.admin) return -1;
// 	if (b.admin && !a.admin) return 1;
// 	return 0;
// }

// // sortGuilds but ordering mod after admin after owner
// function sortGuilds2(a, b) {
//     if (a.owner && !b.owner) return -1;
//     if (b.owner && !a.owner) return 1;
//     if (a.admin && !b.admin) return -1;
//     if (b.admin && !a.admin) return 1;
//     if (a.mod && !b.mod) return -1;
//     if (b.mod && !a.mod) return 1;
//     return 0;
// }

// sortGuilds2 but ordering bot=false after bot=true
function sortGuilds(a, b) {
    if (a.bot && !b.bot) return -1;
    if (b.bot && !a.bot) return 1;
    if (a.owner && !b.owner) return -1;
    if (b.owner && !a.owner) return 1;
    if (a.admin && !b.admin) return -1;
    if (b.admin && !a.admin) return 1;
    if (a.mod && !b.mod) return -1;
    if (b.mod && !a.mod) return 1;
    return 0;
}