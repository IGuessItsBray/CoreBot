const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { getWarnings } = require('../../db/dbAccess');
const { newWarning } = require('../../db/dbAccess');
const { addPunishments } = require('../../db/dbAccess');
const fn = require('../../util/genUtils')
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;


module.exports = {
    name: 'warn-manager',
    description: 'Manage warnings.',
    type: OPTION.SUB_COMMAND,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],
    options: [
        {
            name: 'new',
            description: 'Add a new warning',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'The person who you want to ban',
                    type: OPTION.USER,
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'Reason to ban member',
                    type: OPTION.STRING,
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
                    type: OPTION.USER,
                    required: false,
                },
                {
                    name: 'userid',
                    description: 'The userID to check',
                    type: OPTION.STRING,
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
                //console.log(warning);
                interaction.reply(`Warned ${warnedUser} for ${reason}`)
                const type = "warning"
                const staffUser = interaction.member.id
                const guildId = interaction.guild.id
                const user = warnedUser.id
                const message = reason
                const timestamp = interaction.createdTimestamp
                addPunishments(
                    guildId,
                    user,
                    type,
                    message,
                    timestamp,
                    staffUser
                )
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