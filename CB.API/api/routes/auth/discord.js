// ------------------------------------------------------------------------------
// discord.js
// /api/auth/
// log in and log out using discord oauth2
// ------------------------------------------------------------------------------

const { CLIENTID, CLIENTSECRET, REDIRECTURI, TOKEN_SECRET } = require('../../../config.json');
const { setToken, getToken, delToken } = require('../../db/dbAPI');
const jwt = require("jsonwebtoken")
const axios = require('axios');

module.exports = {
    validate,
    login,
    logout,
}

// ------------------------------------------------------------------------------

async function validate(req, res, next) {
    const { token } = req.headers;
    if (!token) {
        res.status(401).json({ error: 'missing token' });
        return;
    }

    try {
        jwt.verify(token, TOKEN_SECRET);
    } catch (e) {
        res.status(401).json({ error: 'invalid token' });
        return;
    }

    const webToken = await getToken(token);
    if (!webToken) {
        res.status(401).json({ error: 'invalid token' });
        return;
    }

    const resp = await axios.get('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${webToken.type} ${webToken.access}`,
        },
    }).catch((e) => { return e.response; });
    if (resp.status !== 200) {
        await delToken(token);
        res.status(401).json({ error: 'invalid token' });
        return;
    }

    req.token = webToken;
    next();
}

// ------------------------------------------------------------------------------

async function login(req, res) {
    const { code, redirect } = req.query;
    if (!code) {
        //Construct a redirect to auth with discord
        const urlClientId = encodeURIComponent(CLIENTID);
        const urlRedirect = encodeURIComponent(REDIRECTURI);
        const scope = 'identify+guilds';

        res.status(401).redirect(`https://discord.com/oauth2/authorize?client_id=${urlClientId}&redirect_uri=${urlRedirect}&response_type=code&scope=${scope}`);
        return;
    }

    const resp = await axios.post('https://discord.com/api/oauth2/token',
        new URLSearchParams({
            'client_id': CLIENTID,
            'client_secret': CLIENTSECRET,
            'grant_type': 'authorization_code',
            'redirect_uri': redirect ?? REDIRECTURI,
            'code': code,
            'scope': 'identify guilds'
        }).toString(),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).catch((e) => { console.error(e); return e.response; });
    if (resp.status !== 200) {
        res.status(resp.status).json({ error: resp.statusText.toLowerCase() });
        return;
    }

    const { access_token, expires_in, refresh_token, scope, token_type } = resp.data;

    const resp2 = await axios.get('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${token_type} ${access_token}`,
        },
    }).catch((e) => { console.error(e); return e.response; });
    if (resp.status !== 200) {
        res.status(resp.status).json({ error: resp.statusText.toLowerCase() });
        return;
    }

    const token = jwt.sign({ a: resp2.data.id, b: generate(16) }, TOKEN_SECRET, { expiresIn: `${expires_in} seconds` });
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expires_in);

    await setToken(token, access_token, refresh_token, expires, scope, token_type, resp2.data.id);

    res.status(200).json({ token, expires });

}

async function logout(req, res) {
    const { token, access } = req.token;

    const resp = await axios.post('https://discord.com/api/oauth2/token/revoke',
        new URLSearchParams({
            'client_id': CLIENTID,
            'client_secret': CLIENTSECRET,
            'token': access,
        }).toString(),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
    ).catch((e) => { return e.response; });
    if (resp.status !== 200) {
        res.status(resp.status).json({ error: resp.statusText.toLowerCase() });
        return;
    }

    await delToken(token);
    res.status(200).json({ message: 'token invalidated' });
}

// ------------------------------------------------------------------------------


function generate(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

    if (n > max) {
        return generate(max) + generate(n - max);
    }

    max = Math.pow(10, n + add);
    var min = max / 10; // Math.pow(10, n) basically
    var number = Math.floor(Math.random() * (max - min + 1)) + min;

    return ("" + number).substring(add);
}