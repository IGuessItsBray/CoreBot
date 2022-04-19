const { MessageEmbed } = require("discord.js");
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'ban',
    description: 'Allows the admin or owner to ban the member.',
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
        {
            name: 'length',
            description: 'Number of days to delete messages (0-7)',
            type: 'NUMBER',
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
            await member.user.send(`You are banned from **\`${interaction.guild.name}\`** for \`${reason}\`, you can appeal by contacting <@530845321270657085>`).catch(err => { })
            await member.ban({ days: length, reason: reason });
            await interaction.reply(`${member} banned by ${interaction.member}`);
        } catch (e) {
            console.error(e);
            await interaction.reply('failure, see console');
        }
    },

    // ------------------------------------------------------------------------------
};