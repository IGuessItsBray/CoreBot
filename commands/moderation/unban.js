const { MessageEmbed, User, Client } = require("discord.js");
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'unban',
    description: 'Allows the admin or owner to unban the member.',
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
            name: 'userid',
            description: 'The ID of the user to unban',
            type: 'STRING',
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client = interaction.client, ephemeral = true) {
        const guild = interaction.guild;
        const userid = interaction.options.getString('userid');
        if(!interaction.member.permissions.has("BAN_MEMBERS")){
            await interaction.reply({ content: "You do not have the correct permissions to use this command.", ephemeral: true })
            return
        }
        try {
            await guild.bans.remove(userid);
            await interaction.reply(`<@${userid}> unbanned by ${interaction.member}`);
        } catch (e) {
            console.error(e);
            await interaction.reply('failure, see console');
        }
    },

    // ------------------------------------------------------------------------------
};