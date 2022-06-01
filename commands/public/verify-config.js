const { MessageEmbed, Channel } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { setVerifyChannel, setVerifyPassword, setVerifySuccessMessage, setVerifyFailMessage, setVerifyRoleAdd } = require('../../db/dbAccess');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'verify-config',
    description: 'Set the server verification settings (fill all options in)',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'channel',
            description: 'The Channel to verify within',
            type: OPTION.CHANNEL,
            required: false,
        },
        {
            name: 'password',
            description: 'The password (write it down)',
            type: OPTION.STRING,
            required: false,
        },
        {
            name: 'role',
            description: 'The role to add after verified',
            type: OPTION.ROLE,
            required: false,
        },
        {
            name: 'passmessage',
            description: 'The message after someone verifies successfully',
            type: OPTION.STRING,
            required: false,
        },
        {
            name: 'failmessage',
            description: 'The message after someone verifies unsuccessfully',
            type: OPTION.STRING,
            required: false,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const password = interaction.options.getString('password');
        const passmsg = interaction.options.getString('passmessage');
        const failmsg = interaction.options.getString('failmessage');
        const role = interaction.options.getRole('role');
        const channel = interaction.options.getChannel('channel');
        interaction.reply(`
        Channel: ${channel}
        Password: ${password}
        Pass: ${passmsg}
        Fail: ${failmsg}
        Role: ${role}`)
    },

    // ------------------------------------------------------------------------------
};