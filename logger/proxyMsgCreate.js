const fn = require('../util/genUtils')
const { getMembersByTag, getMembers, setAPMember, getAPState, getMemberByID } = require('../db/dbAccess');
const axios = require('axios');
const { CommandInteraction, EmbedBuilder, Intents, WebhookClient } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
const { relativeTimeRounding } = require('moment');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'proxy MsgCreate',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        const content = message.content
        const channel = message.channel
        const channelId = channel.id
        const guildId = message.guild.id
        const userID = message.author.id
        const id = message.author.id
        const members = await getMembers(userID)
        const ap = await getAPState(userID)
        const usedMember = members.find(m => content.startsWith(m.tags));
        const autoMember = ap.autoproxy_state ? members.find(m => m._id === ap.autoproxy_member_id) : undefined;
        console.log(usedMember, autoMember);

        const proxy = usedMember ?? autoMember;
        
        if (!proxy) return;
        if (message.author.bot == true) return;

        const cleanContent = content.replace(proxy.tags, '')
        const bot = message.client.user.id
        const webhooks = await channel.fetchWebhooks()
        const webhook = webhooks.find(w => w.owner.id === bot && w.name === 'CB | Proxy Webhook')
        if (webhook) {
            const whId = webhook.id
            const whToken = webhook.token
            const webhookClient = new WebhookClient({ id: whId, token: whToken });
            webhookClient.send({
                content: cleanContent,
                username: `${proxy.name}`,
                avatarURL: `${proxy.avatar ?? 'https://cdn.discordapp.com/embed/avatars/0.png'}`,
            });
        }
        if (!webhook) {
            const Proxywebhook = await channel.createWebhook({
                name: 'CB | Proxy Webhook',
                avatar: 'https://cdn.discordapp.com/attachments/968344820970029136/1014940658009653248/Screen_Shot_2022-04-07_at_3.51.20_PM.png',
            })
            const whId = Proxywebhook.id
            const whToken = Proxywebhook.token
            const webhookClient = new WebhookClient({ id: whId, token: whToken });
            webhookClient.send({
                content: cleanContent,
                username: `${proxy.name}`,
                avatarURL: `${proxy.avatar ?? `https://cdn.discordapp.com/embed/avatars/0.png`}`,
            });
        }
        const apmid = proxy._id
        await setAPMember(id, apmid)
        setTimeout(() => {
            message.delete();
        }, 1000)
    },

    // ------------------------------------------------------------------------------
};