const { MessageEmbed } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'timeout',
    description: 'Allows the admin or owner to timeout the member.',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: false,

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The person who you want to timeout',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason to timeout member',
            type: 'STRING',
            required: true,
        },
        {
            name: 'length',
            description: 'length of timeout in minutes',
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
        //if(!interaction.member.permissions.has("BAN_MEMBERS")){
            //await interaction.reply({ content: "You do not have the correct permissions to use this command.", ephemeral: true })
            //return
       // }
        const member = interaction.options.getMember('user')
        try {
            await member.user.send(`You are banned from **\`${interaction.guild.name}\`** for \`${reason}\`, you can appeal by contacting <@530845321270657085>`).catch(err => { })
            await member.timeout(length * 60 * 1000, reason );
            await interaction.reply(`${member} timed out by ${interaction.member}`);
        } catch (e) {
            console.error(e);
            await interaction.reply('failure, see console');
        }
    },

    // ------------------------------------------------------------------------------
};