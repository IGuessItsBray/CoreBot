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
        const owner = interaction.options.getMember('user')
        const user = await interaction.client.users.fetch(owner);
        const members = await getMembers(user.id)
        console.log(user)
        console.log(members)
        //const membernames = members.map(m => m.name)
        //const memberIDs = members.map(m => m._id)
        //const memberTags = members.map(m => m.tags)
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: `Members of ${user.tag}'s Collection` })
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                ...members.map(m => {
                    return {
                        name: '\u200B',
                        value: `\`${m._id}\` ${m.name} - ${m.tags}`

                    }
                })
            )
            .setFooter({ text: `User: ${user.tag}` })
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
    },

    // ------------------------------------------------------------------------------
};