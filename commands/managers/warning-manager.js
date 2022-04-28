const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { getWarnings } = require('../../db/dbAccess');
const { newWarning } = require('../../db/dbAccess');


module.exports = {
    name: 'warn-manager',
    description: 'Manage warnings.',
    enabled: true,
    default_permission: false,
    default_member_permissions: 0x8,
    permissions: [],
    options: [
        {
            name: 'new',
            description: 'Add a new warning',
            type: 1,
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

        },
        {
            name: 'view',
            description: 'View warnings',
            type: 1,
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

        },
    ],
    async execute(interaction) {

        switch (interaction.options.getSubcommand()) {
            default:
                await interaction.reply({ content: 'Not Done', ephemeral: true });
                return;
            case 'new': {
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
            }
            case 'view': {
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
                    allowedMentions: { parse: [] },
                });
            }
        }
    },
}