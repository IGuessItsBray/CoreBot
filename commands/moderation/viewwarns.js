const { MessageEmbed } = require("discord.js");
const { getWarnings } = require('../../db/dbAccess');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'viewwarns',
    description: 'View a members warnings',
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
            description: 'The user to check',
            type: 'USER',
            required: false,
        },
        {
            name: 'userid',
            description: 'The userID to check',
            type: 'STRING',
            required: false,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const userId =
            interaction.options.getString('userid') ??
            interaction.options.getUser('user').id;
        if (!userId) {
            await interaction.reply('no user specified');
            return;
        }
        const warnings = await getWarnings(
            interaction.guild,
            userId,
        );
        const formatted = warnings.map(warning => {
            return `<t:${Math.floor(new Date(warning.timestamp).getTime() / 1000.0)}:R> <@${warning.modId}>: ${warning.reason}`;
        }).join('\n');
        await interaction.reply({
            content: `**Warnings for <@${userId}>:**\n${formatted ?? '*none*'}`,
            allowedMentions:{ parse: [] },
        });

    },

    // ------------------------------------------------------------------------------
};