const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'stats',
    description: 'Check stats of the bot',
    type: ApplicationCommandType.ChatInput,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        //{
			//name: '',
			//description: '',
			//type: ApplicationCommandOptionType.String,
			//required: true,
		//},
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const client = interaction.client
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'), //This requests the client.guilds.cache.size from all servers in all shards
            client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)), //Basically math tbh, broadcastEval makes all the shards evaluate the given method, in this case is the reduce
        ];
        
        Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
                return interaction.reply(`Server count: ${totalGuilds}\nMember count: ${totalMembers}`);
            })
	},

    // ------------------------------------------------------------------------------
};