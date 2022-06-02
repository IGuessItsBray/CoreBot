const { MessageEmbed, Channel } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { getVerifyConfig } = require('../../db/dbAccess');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'verify',
    description: 'Verify yourself!',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'password',
            description: 'The server password',
            type: OPTION.STRING,
            required: true,
        },

    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = true) {
        const guildId = interaction.guild.id
        const verify = await getVerifyConfig(guildId)
        const pass = interaction.options.getString('password');
        if (verify.password == pass) {
            interaction.member.roles.add(verify.addRole);
            interaction.reply(verify.successMessage)
        }
        if (verify.password !== pass) {
            interaction.reply(verify.failMessage)
        }
    },

    // ------------------------------------------------------------------------------
};