const fn = require("../util/genUtils");
const {
  getMembersByTag,
  getMembers,
  setAPMember,
  getAPState,
  getMemberByID,
  addToProxy,
  updateMessageLog,
} = require("../db/dbProxy");
const axios = require("axios");
const {
  CommandInteraction,
  EmbedBuilder,
  Intents,
  WebhookClient,
} = require("discord.js");
const { AuditLogEvent, Events } = require("discord.js");
const { relativeTimeRounding } = require("moment");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "proxy MsgCreate",
  type: "messageCreate",

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------
  async execute(message) {
    if (message.type == 0) {
      //no reply
      const content = message.content;
      const channel = message.channel;
      const channelId = channel.id;
      const guildId = message.guild.id;
      const userID = message.author.id;
      const id = message.author.id;
      const members = await getMembers(userID);
      const ap = await getAPState(userID);
      const usedMember = members.find((m) => content.startsWith(m.tags));
      const autoMember = ap?.autoproxy_state
        ? members.find((m) => m._id === ap.autoproxy_member_id)
        : undefined ?? false;

      const proxy = usedMember ?? autoMember;

      if (!proxy) return;
      if (message.author.bot == true) return;

      const cleanContent = content.replace(proxy.tags, "");
      const bot = message.client.user.id;
      const webhooks = await channel.fetchWebhooks();
      const webhook = webhooks.find(
        (w) => w.owner.id === bot && w.name === "CB | Proxy Webhook"
      );
      var textArray = [
        `https://cdn.discordapp.com/embed/avatars/0.png`,
        `https://cdn.discordapp.com/embed/avatars/1.png`,
        `https://cdn.discordapp.com/embed/avatars/2.png`,
        `https://cdn.discordapp.com/embed/avatars/3.png`,
        `https://cdn.discordapp.com/embed/avatars/4.png`,
      ];
      var randomNumber = Math.floor(Math.random() * textArray.length);
      if (webhook) {
        const whId = webhook.id;
        const whToken = webhook.token;
        const webhookClient = new WebhookClient({ id: whId, token: whToken });
        const webhookMsg = await webhookClient.send({
          content: cleanContent,
          username: `${proxy.name}`,
          avatarURL: `${proxy.avatar ?? textArray[randomNumber]}`,
        });

        const _id = proxy.id;
        const guild = message.guild.id;
        const author = message.author.id;
        const timestamp = message.timestamp;
        const attachments = message.attachments.map((a) => a.url ?? a);
        const messageId = webhookMsg.id;
        const messageLink = `https://discord.com/channels/${guild}/${channelId}/${messageId}`;
        await updateMessageLog(
          guild,
          channel,
          author,
          content,
          timestamp,
          attachments,
          messageId,
          messageLink,
          proxy
        );
        await addToProxy(_id, 1, webhookMsg.content.length);
      }
      if (!webhook) {
        const Proxywebhook = await channel.createWebhook({
          name: "CB | Proxy Webhook",
          avatar:
            "https://cdn.discordapp.com/attachments/968344820970029136/1014940658009653248/Screen_Shot_2022-04-07_at_3.51.20_PM.png",
        });
        const whId = Proxywebhook.id;
        const whToken = Proxywebhook.token;
        const webhookClient = new WebhookClient({ id: whId, token: whToken });
        const webhookMsg = await webhookClient.send({
          content: cleanContent,
          username: `${proxy.name}`,
          avatarURL: `${proxy.avatar ?? textArray[randomNumber]}`,
        });
        const _id = proxy.id;
        const guild = message.guild.id;
        const author = message.author.id;
        const timestamp = message.timestamp;
        const attachments = message.attachments.map((a) => a.url ?? a);
        const messageId = webhookMsg.id;
        const messageLink = `https://discord.com/channels/${guild}/${channelId}/${messageId}`;
        await updateMessageLog(
          guild,
          channel,
          author,
          content,
          timestamp,
          attachments,
          messageId,
          messageLink,
          proxy
        );
        await addToProxy(_id, 1, webhookMsg.content.length);
      }
      const apmid = proxy._id;
      await setAPMember(id, apmid);
      setTimeout(() => {
        message.delete();
      }, 1000);
    }
    if (message.type == 19) {
      //reply
      const reply = message.reference;
      const replyMsg = await message.client.channels.cache.get(reply.channelId).messages.fetch(reply.messageId)
      const content = message.content;
      const channel = message.channel;
      const channelId = channel.id;
      const guildId = message.guild.id;
      const userID = message.author.id;
      const id = message.author.id;
      const members = await getMembers(userID);
      const ap = await getAPState(userID);
      const usedMember = members.find((m) => content.startsWith(m.tags));
      const autoMember = ap?.autoproxy_state
        ? members.find((m) => m._id === ap.autoproxy_member_id)
        : undefined ?? false;

      const proxy = usedMember ?? autoMember;
const embed = new EmbedBuilder()
  .setColor(proxy.color ?? "#2f3136")
  .setAuthor({
    name: `${
      replyMsg.author.globalName ?? replyMsg.author.username
    }`,
    iconURL: replyMsg.author.avatarURL({
      dynamic: true,
      size: 512,
    }),
  })
  .setDescription(`[Reply:](https://discord.com/channels/${replyMsg.guildId}/${replyMsg.channelId}/${replyMsg.channelId}) ${replyMsg.content}`);
      if (!proxy) return;
      if (message.author.bot == true) return;

      const cleanContent = content.replace(proxy.tags, "");
      const bot = message.client.user.id;
      const webhooks = await channel.fetchWebhooks();
      const webhook = webhooks.find(
        (w) => w.owner.id === bot && w.name === "CB | Proxy Webhook"
      );
      var textArray = [
        `https://cdn.discordapp.com/embed/avatars/0.png`,
        `https://cdn.discordapp.com/embed/avatars/1.png`,
        `https://cdn.discordapp.com/embed/avatars/2.png`,
        `https://cdn.discordapp.com/embed/avatars/3.png`,
        `https://cdn.discordapp.com/embed/avatars/4.png`,
      ];
      var randomNumber = Math.floor(Math.random() * textArray.length);
      if (webhook) {
        const whId = webhook.id;
        const whToken = webhook.token;
        const webhookClient = new WebhookClient({
          id: whId,
          token: whToken,
        });
        const webhookMsg = await webhookClient.send({
          content: cleanContent,
          username: `${proxy.name}`,
          avatarURL: `${proxy.avatar ?? textArray[randomNumber]}`,
          embeds: [embed],
        });

        const _id = proxy.id;
        const guild = message.guild.id;
        const author = message.author.id;
        const timestamp = message.timestamp;
        const attachments = message.attachments.map((a) => a.url ?? a);
        const messageId = webhookMsg.id;
        const messageLink = `https://discord.com/channels/${guild}/${channelId}/${messageId}`;
        await updateMessageLog(
          guild,
          channel,
          author,
          content,
          timestamp,
          attachments,
          messageId,
          messageLink,
          proxy
        );
        await addToProxy(_id, 1, webhookMsg.content.length);
      }
      if (!webhook) {
        const Proxywebhook = await channel.createWebhook({
          name: "CB | Proxy Webhook",
          avatar:
            "https://cdn.discordapp.com/attachments/968344820970029136/1014940658009653248/Screen_Shot_2022-04-07_at_3.51.20_PM.png",
        });
        const whId = Proxywebhook.id;
        const whToken = Proxywebhook.token;
        const webhookClient = new WebhookClient({
          id: whId,
          token: whToken,
        });
        const webhookMsg = await webhookClient.send({
          content: cleanContent,
          username: `${proxy.name}`,
          avatarURL: `${proxy.avatar ?? textArray[randomNumber]}`,
          embeds: [embed],
        });
        const _id = proxy.id;
        const guild = message.guild.id;
        const author = message.author.id;
        const timestamp = message.timestamp;
        const attachments = message.attachments.map((a) => a.url ?? a);
        const messageId = webhookMsg.id;
        const messageLink = `https://discord.com/channels/${guild}/${channelId}/${messageId}`;
        await updateMessageLog(
          guild,
          channel,
          author,
          content,
          timestamp,
          attachments,
          messageId,
          messageLink,
          proxy
        );
        await addToProxy(_id, 1, webhookMsg.content.length);
      }
      const apmid = proxy._id;
      await setAPMember(id, apmid);
      setTimeout(() => {
        message.delete();
      }, 1000);
    }
  },

  // ------------------------------------------------------------------------------
};
