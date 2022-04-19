const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'testrole',
    description: 'Test to ensure the bots role assignment is correctly functioning.',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: true,
    default_permission: true,
    permissions: [
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

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    
    async execute(interaction, ephemeral = false) {
        //command contents go here, just like in builders
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_955276079474561024')
                        .setLabel('Test role')
                        .setStyle('PRIMARY'),
                );

            await interaction.reply({ content: 'Press to test if role buttons are functioning.', components: [row] });
    },

    // ------------------------------------------------------------------------------
};