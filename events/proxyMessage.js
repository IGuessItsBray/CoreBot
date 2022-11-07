const fn = require('../util/genUtils')
const { getUserProxies, setProxyWebhook, getProxyWebhook, getMemberByProxy, setLastUsed, getLastUsed, getAP, getMemberByID, addToProxy } = require('../db/dbAccess');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message, MessageAttachment, WebhookClient } = require('discord.js');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'Proxy event',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        const { content, channel, author } = message;
        const { id: userID } = author;

        const userSettings = await getAP(userID)
        const proxies = await getUserProxies(userID)
        const autoProxy = userSettings.ap ?? false;
        const lastUsed = userSettings.lastUsed;

        let proxy = proxies?.find(p => content.startsWith(p.proxy) && p.userID === userID)
        //console.log(userSettings, proxy, autoProxy, lastUsed)

        if (autoProxy && lastUsed && !proxy) {
            proxy = await getMemberByID(lastUsed)
        }
        if (!proxy) return

        const member = await getMemberByProxy(proxy.proxy)

        const bot = message.client.user.id
        const webhooks = await channel.fetchWebhooks()
        const webhook =
            //check if a webhook already exists
            webhooks.find(w => w.owner.id === bot) ??
            //if the find comes back null, make a new one
            await channel.createWebhook('CB | Proxy Webhook', {
                avatar: 'https://cdn.discordapp.com/attachments/968344820970029136/1014940658009653248/Screen_Shot_2022-04-07_at_3.51.20_PM.png',
            })
        if (!webhook) return

        const cleanContent =
            content
                .replace(proxy.proxy, '')
                .replaceAll('\u200b', '')
            + `[\u200b](meta:${userID},${proxy._id})`
        try {
            const attachments = message.attachments.map(a => a.url)
            await webhook.send({
                content: cleanContent,
                username: `${member.name}`,
                avatarURL: member.avatar ?? undefined,
                files: attachments.length > 0 ? attachments : undefined,
            });
            await message.delete()
            const lastUsed = proxy._id
            await setLastUsed(userID, lastUsed)
            await addToProxy(lastUsed, 1, cleanContent.length);

        }
        catch (ex) {
            console.error(ex)
        }

    },




    // ------------------------------------------------------------------------------
};