const { MessageEmbed } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { addPunishments } = require('../../db/dbAccess');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'ban',
    description: 'Allows the admin or owner to ban the member.',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The person who you want to ban',
            type: OPTION.USER,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason to ban member',
            type: OPTION.STRING,
            required: true,
        },
        {
            name: 'length',
            description: 'Number of days to delete messages (0-7)',
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
        const member = interaction.options.getMember('user')
        const guildId = interaction.guild.id
        const user = member.id
        const message = reason
        const staffUser = interaction.member
        const timestamp = interaction.createdTimestamp
        if(!interaction.member.permissions.has("BAN_MEMBERS")){
            await interaction.reply({ content: "You do not have the correct permissions to use this command.", ephemeral: true })
            return
        }
        try {
            await member.user.send(`You are banned from **\`${interaction.guild.name}\`** for \`${reason}\`, you can appeal by contacting server staff!`).catch(err => { })
            await member.ban({ days: length, reason: reason });
            await interaction.reply(`${member} banned by ${interaction.member}`);
            const type = "ban"
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