const { MessageEmbed } = require("discord.js");
const { updateRoleButtons } = require('../../db/dbAccess');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
const everyone = require('../../config.json').PERMS.EVERYONE;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'updaterolebutton',
    description: 'Warn a member',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: false,
    default_permission: true,
    permissions: [
        ...admin_roles.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: true,
            };
        }),
        ...everyone.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: false,
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
            name: 'title',
            description: 'The embed title',
            type: 'STRING',
            required: true,
        },
        {
            name: 'text',
            description: 'The embed text',
            type: 'STRING',
            required: true,
        },
        {
            name: 'footer',
            description: 'The embed footer',
            type: 'STRING',
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = true) {
        const guild = interaction.guild;
        const embedTitle = interaction.options.getString('title');
        const embedText = interaction.options.getString('text');
        const embedFooter = interaction.options.getString('footer');

        //asdf
        const res =
            await updateRoleButtons(null, guild, embedTitle, embedText, embedFooter);

        await interaction.reply(
            {
                content: `Out:\`\`\`json\n${res}\`\`\``,
            }
        );

    },

    // ------------------------------------------------------------------------------
};