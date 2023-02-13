const { EmbedBuilder, User, Client } = require("discord.js");
const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { addPunishments } = require('../../db/dbAccess');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'unban',
    description: 'Allows the admin or owner to unban the member.',
    type: ApplicationCommandType.ChatInput,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'userid',
            description: 'The ID of the user to unban',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client = interaction.client, ephemeral = true) {
        const guild = interaction.guild;
        const userid = interaction.options.getString('userid');
        const guildId = guild.id
        const user = userid
        const message = "User unbanned"
        const timestamp = interaction.createdTimestamp
        if(!interaction.member.permissions.has("BAN_MEMBERS")){
            await interaction.reply({ content: "You do not have the correct permissions to use this command.", ephemeral: true })
            return
            
        }
        try {
            await guild.bans.remove(userid);
            await interaction.reply(`<@${userid}> unbanned by ${interaction.member}`);
            const type = "unban"
            const staffUser = interaction.member.id
            addPunishments(
                guildId,
                user,
                type,
                message,
                timestamp,
                staffUser
            )
        } catch (e) {
            console.error(e);
            await interaction.reply('failure, see console');
            
        }
    },

    // ------------------------------------------------------------------------------
};