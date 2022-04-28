const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'echo',
    description: 'For sending an message from the bot!',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: true,
    default_permission: false,
    default_member_permissions: 0x8,
    permissions: [],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'message',
            description: 'The message you want to send',
            type: 'STRING',
            required: true,
        },
        {
            name: 'type',
            description: 'The type of message to use',
            type: 'STRING',
            choices: [
                { name: 'Raw Text', value: 'text' },
                { name: 'Embed', value: 'embed' },
            ],
            required: true,
        },
        {
            name: 'channel',
            description: 'The channel you want to send the message in (leave blank for this channel)',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'],
            required: false,
        },
        {
            name: 'colour',
            description: 'Embed Colour Hex (Don\'t include #)',
            type: 'STRING',
            required: false,
        },
        {
            name: 'header',
            description: 'Embed Header',
            type: 'STRING',
            required: false,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const type = interaction.options.getString('type');
        const header = interaction.options.getString('header');
        const colour = interaction.options.getString('colour') ?? '000000';
        await interaction.deferReply({ ephemeral: true });
        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
    
        if (type === 'text') {
    
            await channel.send({ content: message });
    
        } else if (type === 'embed') {
    
            const embed = new MessageEmbed()
                .setColor(colour)
                .setAuthor(header)
                .setDescription(message)
                .setFooter({ text: "Corebot" })
                .setTimestamp();
            await channel.send({ embeds: [ embed ] });
    
        }
    
        await interaction.editReply({ content: 'Message sent', ephemeral: true });
    },

    // ------------------------------------------------------------------------------
};