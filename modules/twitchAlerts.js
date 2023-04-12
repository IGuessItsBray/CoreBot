const Discord = require('discord.js');
const { Client, Intents, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const config = require("../util/localStorage");
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { DirectConnectionAdapter, EventSubListener } = require('@twurple/eventsub');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok')

module.exports = async (client) => {
    const clientId = config.clientId;
    const clientSecret = config.clientSecret;
    const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
    const apiClient = new ApiClient({ authProvider });
    //const adapter = new DirectConnectionAdapter({
    //hostName: 'example.com',
    //sslCert: {
    //key: 'aaaaaaaaaaaaaaa',
    //cert: 'bbbbbbbbbbbbbbb'
    //}
    // });
    //const secret = config.twitchSecret;
    //const listener = new EventSubListener({ apiClient, adapter, secret });
    await apiClient.eventSub.deleteAllSubscriptions();
    const listener = new EventSubListener({
        apiClient,
        adapter: new NgrokAdapter(),
        secret: config.twitchSecret
    });
    await listener.listen();
};

