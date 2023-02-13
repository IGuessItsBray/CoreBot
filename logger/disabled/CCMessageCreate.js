const fn = require('../../util/genUtils')
const { getServerSettings } = require('../../db/dbAccess');
const { CommandInteraction, EmbedBuilder, Intents, WebhookClient } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageCreate CC',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        const webhooks = await (await getServerSettings()).ccChannel();
        if (message.webhookId) return;
        const webhookChannels = webhooks.map(w => w.channelId);
        if (!webhookChannels.includes(message.channel.id)) return;
        const guild = message.guild.name;
        const user = message.author.tag;
        const avatar = message.author.avatarURL();
        const content = message.content;
        webhooks.forEach(async cc => {
            if (!content || content === '') return;
            const webhook = await message.client.fetchWebhook(cc.webhookId, cc.webhookToken)
            await webhook.edit({ name: `${guild} | ${user}`, avatar: avatar });
            await webhook.send({ content: content });
            
        });
    },

    // ------------------------------------------------------------------------------
};