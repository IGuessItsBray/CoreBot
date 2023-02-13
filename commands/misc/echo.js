const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { getWarnings } = require('../../db/dbAccess');
const { newWarning } = require('../../db/dbAccess');
const { addPunishments } = require('../../db/dbAccess');
const fn = require('../../util/genUtils')
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;


module.exports = {
    name: 'echo',
    description: 'Echo a message!',
    type: OPTION.SUB_COMMAND,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],
    options: [
        {
            name: 'text',
            description: 'Text message echo',
            type: 1,
            options: [
                {
                    name: 'message',
                    description: 'The message to echo',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'channel',
                    description: 'The channel to send to',
                    type: OPTION.CHANNEL,
                    required: false,
                },
                {
                    name: 'image',
                    description: 'Any images',
                    type: OPTION.ATTACHMENT,
                    required: false,
                },
            ],

        },
        {
            name: 'embed',
            description: 'Embed message echo',
            type: 1,
            options: [
                {
                    name: 'message',
                    description: 'The message to echo',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'channel',
                    description: 'The channel to send to',
                    type: OPTION.CHANNEL,
                    required: false,
                },
                {
                    name: 'colour',
                    description: 'Embed Colour Hex (Don\'t include #)',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'header',
                    description: 'Embed Header',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'footer',
                    description: 'Embed footer',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'image',
                    description: 'Any images',
                    type: OPTION.ATTACHMENT,
                    required: false,
                },
            ],

        },
        {
            name: 'textreply',
            description: 'Text message reply echo',
            type: 1,
            options: [
                {
                    name: 'message',
                    description: 'The message to echo',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'link',
                    description: 'The link to the message to reply to',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'channel',
                    description: 'The channel to send to',
                    type: OPTION.CHANNEL,
                    required: false,
                },
                {
                    name: 'image',
                    description: 'Any images',
                    type: OPTION.ATTACHMENT,
                    required: false,
                },

            ],

        },
        {
            name: 'embedreply',
            description: 'Embed message reply echo',
            type: 1,
            options: [
                {
                    name: 'message',
                    description: 'The message to echo',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'link',
                    description: 'The link to the message to reply to',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'channel',
                    description: 'The channel to send to',
                    type: OPTION.CHANNEL,
                    required: false,
                },

                {
                    name: 'colour',
                    description: 'Embed Colour Hex (Don\'t include #)',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'header',
                    description: 'Embed Header',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'footer',
                    description: 'Embed footer',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'image',
                    description: 'Any images',
                    type: OPTION.ATTACHMENT,
                    required: false,
                },
            ],

        },
    ],
    async execute(interaction) {

        switch (interaction.options.getSubcommand()) {
            default:
                await interaction.reply({ content: 'Not Done', ephemeral: true });
                return;
            case 'text': {
                const message = interaction.options.getString('message');
                const channel = interaction.options.getChannel('channel') ?? interaction.channel;
                const image = interaction.options.getAttachment('image');
                await channel.send({ content: message, files: image ? [{ attachment: image.url }] : undefined, });
                interaction.reply({ content: 'Message sent', ephemeral: true })
            }
                break;
            case 'embed': {
                const message = interaction.options.getString('message');
                const channel = interaction.options.getChannel('channel') ?? interaction.channel;
                const header = interaction.options.getString('header');
                const colour = interaction.options.getString('colour') ?? '000000';
                const footer = interaction.options.getString('footer');
                const image = interaction.options.getAttachment('image');
                const embed = new EmbedBuilder()
                    .setColor(colour)
                    .setAuthor({ name: `${header}` })
                    .setDescription(message)
                    .setFooter({ text: `${footer}` })
                    .setTimestamp();
                await channel.send({ embeds: [embed], files: image ? [{ attachment: image.url }] : undefined, });
                interaction.reply({ content: 'Message sent', ephemeral: true })
            }
                break;
            case 'textreply': {
                const message = interaction.options.getString('message');
                const link = interaction.options.getString('link');
                const image = interaction.options.getAttachment('image');
                const replyRegex = /(\d+)\/(\d+)\/(\d+)/;
                const match = link.match(replyRegex);
                const channelId = match[2]
                const messageId = match[3]
                const replyChannel = await interaction.client.channels.fetch(channelId)
                const replyMsg = await replyChannel.messages.fetch(messageId)
                replyMsg.reply({ content: message, files: image ? [{ attachment: image.url }] : undefined, });
                interaction.reply({ content: 'Reply sent', ephemeral: true })
            }
                break;
            case 'embedreply': {
                const message = interaction.options.getString('message');
                const link = interaction.options.getString('link');
                const replyRegex = /(\d+)\/(\d+)\/(\d+)/;
                const match = link.match(replyRegex);
                const channelId = match[2]
                const messageId = match[3]
                const replyChannel = await interaction.client.channels.fetch(channelId)
                const replyMsg = await replyChannel.messages.fetch(messageId)
                const header = interaction.options.getString('header');
                const colour = interaction.options.getString('colour') ?? '000000';
                const footer = interaction.options.getString('footer');
                const image = interaction.options.getAttachment('image');
                const embed = new EmbedBuilder()
                    .setColor(colour)
                    .setAuthor({ name: `${header}` })
                    .setDescription(message)
                    .setFooter({ text: `${footer}` })
                    .setTimestamp();
                replyMsg.reply({ embeds: [embed], files: image ? [{ attachment: image.url }] : undefined, });
                interaction.reply({ content: 'Reply sent', ephemeral: true })
            }
                break;
        }
    },
}