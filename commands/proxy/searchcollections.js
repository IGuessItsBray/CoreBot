const { time } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, Events, PermissionsBitField, PermissionFlagsBits, ChannelType } = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { setAvatar, setTags, getMemberByID, getMembers } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'searchcollection',
    description: 'gives a list of members from another persons collection',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The user to list the collection of',
            type: OPTION.USER,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const owner = interaction.options.getMember('user').id
        const members = await getMembers(owner)
        const membernames = members.map(m => m.name)
        const memberIDs = members.map(m => m._id)
        const memberTags = members.map(m => m.tags)
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: `Members of <@${owner}>'s Collection`})
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: '', value: `\`${memberIDs}\` ${membernames} - ${memberTags}`, inline: true },
            )
            .setFooter({ text: `User: ${owner}` })
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
    },

    // ------------------------------------------------------------------------------
};