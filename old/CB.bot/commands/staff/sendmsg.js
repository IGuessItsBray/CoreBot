const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'sendmsg',
    description: 'Send a message across a shard (maybe)',
    type: ApplicationCommandType.ChatInput,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
			name: 'message',
			description: 'The message to send',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
        {
			name: 'channel',
			description: 'The channel to send to',
			type: ApplicationCommandOptionType.Channel,
			required: true,
		},
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const client = interaction.client
        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel').id
        interaction.reply(`
Message sent! 
<#${channel}>`)
        return client.shard.broadcastEval(async (c, { channelId, msg }) => {
            const channel = c.channels.cache.get(channelId);
            if (channel) {
                await channel.send(`This is a message from shard ${c.shard.ids.join(',')}!`);
                await channel.send(msg);
                return true;
            }
            return false;
        }, { context: { channelId: channel, msg: message } })
            .then(console.log);

	},

    // ------------------------------------------------------------------------------
};