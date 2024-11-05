const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'sample',
    description: 'An example command',
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
            const config = require("../../util/localStorage");
            const homeGuild = await interaction.client.guilds.fetch(
              config.HOME
            );
        const { shard } = require("../../util/vars");

        const user = "530845321270657085";
        const broadcast = shard.broadcastEval(
          async (client, { homeGuild, targetUser }) => {
            // Check if the guild is on this shard
            const guild = client.guilds.cache.find(
              (g) => g.id === `955230769939353623`
            );
            if (!guild) return;

            // Check if the member is in the guild
            const member = await guild.members
              .fetch(targetUser)
              .catch(() => undefined);
            // If the member is not in the guild, return an object with the user's ID
            // if other roles are added in the future, they should be added here too
            if (!member) {
              return {
                _name: "Unknown User",
                _id: targetUser,
                dev: false,
                networkAdmin: false,
                tester: false,
              };
            }

            // Check what notable roles the member has
            const hasDevRole = member.roles.cache.has("968346275881832569");
            const hasNetworkAdminRole =
              member.roles.cache.has("990956030290718751");
            const hasTesterRole = member.roles.cache.has("1022142081323511899");

            // Return the member's notable roles & debug info
            return {
              _name: member.user.username,
              _id: member.id,
              dev: hasDevRole,
              networkAdmin: hasNetworkAdminRole,
              tester: hasTesterRole,
            };
          },
          { context: { homeGuild: `955230769939353623`, targetUser: user } }
        );
        const result = [].concat(await broadcast).find((obj) => obj);
        // destructuring the result object, each will be true or false
        const { dev, networkAdmin, tester } = result;
	},

    // ------------------------------------------------------------------------------
};