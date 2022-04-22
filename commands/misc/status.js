const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
const everyone = require('../../config.json').PERMS.EVERYONE;
module.exports = { 

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'status',
    description: 'For sending a status update from the bot',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: true,
    default_permission: true,
    permissions: [
        ...admin_roles.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: true,
            };
        }),
        ...everyone.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: false,
            };
        }),
        ...dev_users.map(user => {
            return {
                id: user,
                type: 'USER',
                permission: true,
            };
        }),
    ],

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
            name: 'colour',
            description: 'Embed Colour Hex (Don\'t include #)',
            type: 'STRING',
            required: false,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const type = interaction.options.getString('type');
        const colour = interaction.options.getString('colour') ?? '000000';
        await interaction.deferReply({ ephemeral: true });
        const message = interaction.options.getString('message');
        if (type === 'text') {
            interaction.client.channels.cache.get(`938256183477805098`).send({ content: message }); //Bray's Place
            interaction.client.channels.cache.get(`949030036218994738`).send({ content: message }); //Bug
            interaction.client.channels.cache.get(`963527714776702998`).send({ content: message }); //KWC
            await interaction.editReply({ content: 'Message sent', ephemeral: true });
        }
        else if (type === 'embed') {
    
            const embed = new MessageEmbed()
                .setColor(colour)
                .setDescription(message)
                .setFooter({ text: "Corebot" })
                .setTimestamp();
            await interaction.client.channels.cache.get(`938256183477805098`).send({ embeds: [ embed ] });
            await interaction.client.channels.cache.get(`949030036218994738`).send({ embeds: [ embed ] });
            await interaction.client.channels.cache.get(`963527714776702998`).send({ embeds: [ embed ] });
            await interaction.editReply({ content: 'Message\'s sent', ephemeral: true });
        }

	},

    // ------------------------------------------------------------------------------
};