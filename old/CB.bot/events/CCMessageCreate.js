const fn = require("../util/genUtils");
const {
  getManyServerSettings,
  getCrossChatChannel,
} = require("../db/dbAccess");
const {
  CommandInteraction,
  EmbedBuilder,
  Intents,
  WebhookClient,
} = require("discord.js");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "messageCreate CC",
  type: "messageCreate",

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------
  async execute(message) {
    const guild = message.guild.name;
    const user = message.author.tag;
    const avatar = message.author.avatarURL();
    const content = message.content;
    const id = message.id;
    const webhooks = await getCrossChatChannel();
    if (message.webhookId) return;
    const webhookChannels = webhooks.map((w) => w.channelId);
    if (!webhookChannels.includes(message.channel.id)) return;
    const mediaChannel = await message.client.channels.fetch(
      "1016439163760939068"
    );
    const attachments = message.attachments.map((a) => {
      return { attachment: a.url };
    });
    if (message.attachments.size !== 0) {
      const newMessage = await mediaChannel.send({
        files: attachments.length > 0 ? attachments : undefined,
      });
      const urls = newMessage.attachments.map((a) => a.url).join("\n");
      const msg = `${content}\n${urls}`;
      webhooks.forEach(async (cc) => {
        if (!content || content === "") return;
        const webhook = await message.client.fetchWebhook(
          cc.webhookId,
          cc.webhookToken
        );
        await webhook.edit({ name: `${guild} | ${user}`, avatar: avatar });
        await webhook.send({ content: msg });
      });
    } else {
      webhooks.forEach(async (cc) => {
        if (!content || content === "") return;
        const webhook = await message.client.fetchWebhook(
          cc.webhookId,
          cc.webhookToken
        );
        await webhook.edit({ name: `${guild} | ${user}`, avatar: avatar });
        await webhook.send({ content: content });
      });
    }
    message.delete()
  },

  // ------------------------------------------------------------------------------
};
