const { MessageEmbed } = require("discord.js");
const { newWarning } = require('../../db/dbAccess');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'warn',
    description: 'Warn a member',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: false,
    default_permission: false,
    permissions: [
        ...admin_roles.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: true,
            };
        }),
        ...dev_users.map(user => {
            return {
                id: user,
                type: 'USER',
                permission: true,
            };
        }),
    ],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The person who you want to ban',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason to ban member',
            type: 'STRING',
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = true) {
        const reason = interaction.options.getString('reason');
        const warnedUser = interaction.options.getUser('user')
        const warning = await newWarning(
            interaction.guild,
            warnedUser,
            interaction.user,
            reason
        );

        console.log(warning);
        interaction.reply(`Warned ${warnedUser} for ${reason}`)
    },

    // ------------------------------------------------------------------------------
};