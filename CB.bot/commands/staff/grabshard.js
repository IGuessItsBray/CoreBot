const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType, Collection } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'grabshard',
    description: 'get the shard of a guild',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'guild',
            description: 'The guildID',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const client = interaction.client
        const id = interaction.options.getString('guild');
        const promise = client.shard.broadcastEval(
            (c, { guildId }) => {
                return c.guilds.cache.get(guildId);
            },
            { context: { guildId: id } }
        );
        const result = (await promise).find(e => e);
        interaction.reply(`Shard \`\`\`${result.shardId}\`\`\` attached to guild \`\`\`${result.name}\`\`\``)
    },

    // ------------------------------------------------------------------------------
};