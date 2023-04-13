const { EmbedBuilder } = require("discord.js");
const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'kick',
    description: 'Allows the admin or owner to kick the member.',
    type: ApplicationCommandType.ChatInput,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The person who you want to kick',
            type: OPTION.USER,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason to kick member',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const reason = interaction.options.getString('reason');
        if(!interaction.member.permissions.has("KICK_MEMBERS")){
            await interaction.reply({ content: "You do not have the correct permissions to use this command.", ephemeral: true })
            return
        }
        const member = interaction.options.getMember('user')
        try {
            await member.user.send(`You were kicked from **\`${interaction.guild.name}\`** for \`${reason}\` by ${interaction.member}`).catch(err => { })
            await member.kick(reason);
            await interaction.reply(`${member} kicked by ${interaction.member}`);
            
        } catch (e) {
            console.error(e);
            await interaction.reply('failure, see console');
        }
    },

    // ------------------------------------------------------------------------------
};