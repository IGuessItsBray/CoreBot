const { MessageEmbed } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
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
        if(!interaction.member.permissions.has("BAN_MEMBERS")){
            await interaction.reply({ content: "You do not have the correct permissions to use this command.", ephemeral: true })
            return
        }
        const member = interaction.options.getMember('user')
        try {
            await member.user.send(`You are banned from **\`${interaction.guild.name}\`** for \`${reason}\`, you can appeal by contacting server staff!`).catch(err => { })
            await member.ban({ days: length, reason: reason });
            await interaction.reply(`${member} banned by ${interaction.member}`);
        } catch (e) {
            console.error(e);
            await interaction.reply('failure, see console');
        }
    },

    // ------------------------------------------------------------------------------
};