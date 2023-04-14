const { CommandInteraction, EmbedBuilder, Intents, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { getTotalMembers, findMessages } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'stats',
    description: 'Get bot statistics',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const proxyMembers = await getTotalMembers()
        const messages = await findMessages()
        const guildCount = interaction.client.guilds.cache.size
        const guilds = interaction.client.guilds.cache;
        var totalUsers = 0;
    
        guilds.forEach((guild) => {
            totalUsers += guild.memberCount;
        });
        const channelCount = interaction.client.channels.cache.size
        const userCount = interaction.client.users.cache.size
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Statistics!` })
            .setDescription(`
        Messages: ${messages.length}
        Guilds: ${guildCount}
        Channels: ${channelCount}
        Users: ${totalUsers}
        Proxy Members: ${proxyMembers.length}`)
            .setFooter({ text: `Corebot` })
            .setTimestamp();
        interaction.reply({ embeds: [embed], ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};