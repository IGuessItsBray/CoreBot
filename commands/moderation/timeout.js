const { MessageEmbed } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { addPunishments } = require('../../db/dbAccess');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'timeout',
    description: 'Allows the admin or owner to timeout the member.',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The person who you want to timeout',
            type: OPTION.USER,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason to timeout member',
            type: OPTION.STRING,
            required: true,
        },
        {
            name: 'length',
            description: 'length of timeout in minutes',
            type: OPTION.NUMBER,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const reason = interaction.options.getString('reason');
        const length = interaction.options.getNumber('length');
        //if(!interaction.member.permissions.has("BAN_MEMBERS")){
            //await interaction.reply({ content: "You do not have the correct permissions to use this command.", ephemeral: true })
            //return
       // }
        const member = interaction.options.getMember('user')
        try {
            await member.user.send(`You are timed out from from **\`${interaction.guild.name}\`** for \`${reason}\` for \`${length}\`, you can appeal by contacting <@530845321270657085>`).catch(err => { })
            await member.timeout(length * 60 * 1000, reason );
            await interaction.reply(`${member} timed out by ${interaction.member}`);
            const type = "timeout"
            const staffUser = interaction.member.id
            const guildId = interaction.guild.id
            const user = member.id
            const message = reason
            const timestamp = interaction.createdTimestamp
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