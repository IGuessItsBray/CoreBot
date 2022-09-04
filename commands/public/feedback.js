const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'feedback',
    description: 'Send feedback to the dev team!',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'message',
            description: 'The feedback',
            type: OPTION.STRING,
            required: true,
        },
        {
            name: 'image',
            description: 'Any images',
            type: OPTION.ATTACHMENT,
            required: false,
        },

    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const message = interaction.options.getString('message');
        const image = interaction.options.getAttachment('image');
        const user = interaction.user
        const guild = interaction.guild.name
        const channel = interaction.client.channels.cache.get("1016052055883911219");
        const embed = new MessageEmbed()
            .setColor("#0000FF")
            .setAuthor(`Feedback from ${user.tag}`)
            .setDescription(`New feedback from <@${user.id}> in ${guild}
\`\`\`
${message}
\`\`\``)
            .setFooter({ text: "Corebot" })
            .setTimestamp();
        await channel.send({
            embeds: [embed],
            files: [{ attachment: image.url }]
        });
        await interaction.editReply({ content: 'Thanks! Your feedback has been sent to the dev team!', ephemeral: true });
    },

    // ------------------------------------------------------------------------------
};