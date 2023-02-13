const { time } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle, MessageSelectMenu, AttachmentBuilder, StringSelectMenuBuilder, TextInputBuilder, ModalBuilder, ApplicationCommandType, Collection, ApplicationCommandOptionType } = require('discord.js');
const { Flags } = require('discord.js').PermissionsBitField;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { getMmCatagory, getMmChannel, setMmInfo, getMmInfo, deleteMmInfo } = require('../../db/dbAccess');
const { Permissions } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'closeticket',
    description: 'Close a modmail ticket',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The tickets owner',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const guildId = interaction.guild.id
        const userId = interaction.options.getMember('user').id
        const mmInfo = await getMmInfo(guildId, userId)
        const channel = mmInfo.channelId
        const channelId = channel
        const lc = await getMmChannel(guildId)
        const logChannel = await interaction.client.channels.fetch(lc.channel);
        if (interaction.channel.id != channel) {
            interaction.reply(`Please run this command inside of <#${channel}> to close the thread`)
        };
        if (interaction.channel.id === channel) {
            interaction.reply("Deleting thread...")
            interaction.guild.channels.delete(channel)
            const embed = new EmbedBuilder()
                .setColor("#3a32a8")
                .setAuthor("New ticket!")
                .setDescription(`The ticket for <@${userId}> was closed by <@${interaction.user.id}>`)
                .setFooter("Corebot")
                .setTimestamp();
            await logChannel.send({ embeds: [embed] });
            await deleteMmInfo(guildId, userId, channelId)
        };
       
    },

    // ------------------------------------------------------------------------------
};