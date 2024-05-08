const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'endshard',
    description: 'End a misbehaving shard',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'shard',
            description: 'The shard to kill',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const client = interaction.client
        const input = interaction.options.getInteger('shard');
        interaction.reply(`Shard ${input} restarted`)
            .then(client.shard.broadcastEval(c => {
                if (c.shard.ids.includes(input)) process.exit();
            }));


    },

    // ------------------------------------------------------------------------------
};