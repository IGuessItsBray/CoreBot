const { MessageEmbed } = require("discord.js");
const { getRoleButtons } = require('../../db/dbAccess');
const { updateRoleButtons } = require('../../db/dbAccess');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
const everyone = require('../../config.json').PERMS.EVERYONE;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'addbutton',
    description: 'Add a button to the array for roles',
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
            name: 'id',
            description: 'The embed title',
            type: 'STRING',
            required: true,
        },
        {
            name: 'role',
            description: 'The role to add',
            type: 'ROLE',
            required: true,
        },
        {
            name: 'style',
            description: 'The sytle of the button',
            choices: [
                { name: 'Primary', value: 'PRIMARY' },
                { name: 'Secondary', value: 'SECONDARY' },
                { name: 'Success', value: 'SUCCESS' },
                { name: 'Danger', value: 'DANGER' },
            ],
            type: 'STRING',
            required: true,
        },
        {
            name: 'label',
            description: 'The label of the button',
            type: 'STRING',
            required: true,
        },
        {
            name: 'enabled',
            description: 'Is the button enabled or disabled?',
            type: 'BOOLEAN',
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = true) {
        const guild = interaction.guild;
        const id = interaction.options.getString('id');

        // Get the prompt from the database
        const prompt = await getRoleButtons(id, guild);

        // If the role already exists, overwrite it
        const buttons = prompt.buttons
            .filter(b => b.role !== interaction.options.getRole('role').id);

        // Create a 'button' object
        const newButton = {
            role: interaction.options.getRole('role').id,
            style: interaction.options.getString('style'),
            label: interaction.options.getString('label'),
            enabled: !interaction.options.getBoolean('enabled'),
        }

        const res =
            await updateRoleButtons(
                id,
                guild,
                prompt.embed.title,
                prompt.embed.text,
                prompt.embed.footer,
                [...buttons, newButton]
            );

        await interaction.reply(
            {
                content: `Out:\`\`\`json\n${res}\`\`\``,
            }
        );

    },

    // ------------------------------------------------------------------------------
};