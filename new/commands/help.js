module.exports = {

	// ------------------------------------------------------------------------------
	// Definition
	// ------------------------------------------------------------------------------

	name: 'help',
	description: 'help',
	enabled: true,

	// ------------------------------------------------------------------------------
	// Options
	// ------------------------------------------------------------------------------

	options: [],

	// ------------------------------------------------------------------------------
	// Execution
	// ------------------------------------------------------------------------------

	async execute(interaction, ephemeral = true) {
        const { paginateEmbeds } = require('../util/paginate');
        const { EmbedBuilder } = require('discord.js');
        const commands = await interaction.client.application.commands.fetch();
        const commandsFormatted = commands.map((c) => {
          const options = c.options
            .filter(
              (o) =>
                ![OPTION.SUB_COMMAND, OPTION.SUB_COMMAND_GROUP].includes(o.type)
            )
            .map((o) => o.name);
          const subcommands = c.options
            .filter((o) =>
              [OPTION.SUB_COMMAND, OPTION.SUB_COMMAND_GROUP].includes(o.type)
            )
            .map((o) => `</${c.name} ${o.name}:${c.id}>`);
    
          return (
            `**</${c.name}:${c.id}>**\n` +
            (subcommands.length > 0 ? `${subcommands.join(" ")}\n` : "") +
            (options.length > 0 ? `Options: ${options.join(", ")}\n` : "") +
            `${c.description ?? "*No Description*"}`
          );
        });
        const about = new EmbedBuilder()
  .setColor('#3a32a8')
  .setTitle('About')
  .setDescription(`Welcome to <@${interaction.client.user.id}>!
CoreBot is a multipurpose discord bot made by Bray! It features music, moderation, role buttons, and more!
            For more help, press the button to join the discord server, and to add the bot to your server, press the invite button!`)

  .setFooter({ text: 'Made with ♥️ by Bray, Seth and the CBLabs team!' })
  .setTimestamp();
  const command = new EmbedBuilder()
  .setColor('#3a32a8')
  .setTitle('Commands')
  .setDescription(commandsFormatted.join("\n\n"))
  .setFooter({ text: 'CoreBot' })
  .setTimestamp();
  const uptime = new EmbedBuilder()
  .setColor('#3a32a8')
  .setTitle('Uptime')
  .setDescription(`**Up Since** <t:${Math.floor(
          interaction.client.readyAt.getTime() / 1000.0
        )}:R><t:${Math.floor(
          interaction.client.readyAt.getTime() / 1000.0
        )}:D>`)
  .setFooter({ text: 'CoreBot' })
  .setTimestamp();
  const support = new EmbedBuilder()
  .setColor('#3a32a8')
  .setTitle('Support')
  .setDescription(`For support, pop into the CoreBot Development support server:
            [CoreBot Support server](https://discord.gg/v9fzkjycr3)`)
  .setFooter({ text: 'CoreBot' })
  .setTimestamp();
  const Acknowledgements = new EmbedBuilder()
  .setColor('#3a32a8')
  .setTitle('Acknowledgements')
  .setDescription(`${this.formatThanks()}`)
  .setFooter({ text: 'CoreBot' })
  .setTimestamp();
  const mot = new EmbedBuilder()
  .setColor('#3a32a8')
  .setTitle('Meet our team')
  .setDescription(`
            ***Developers:***
            \`Bray\` | <@530845321270657085> - Lead Developer <:CBDeveloper:1012934220030693376>
            \`Seth\` | <@111592329424470016> - Lead Developer <:CBDeveloper:1012934220030693376>
            \`Ethereal\` | <@844641126748258355> - Network Developer <:CBBetaTester:1012934218592034887>
            `)
  .setFooter({ text: 'CoreBot' })
  const pages = [about, command, uptime, support, Acknowledgements, mot];
  await paginateEmbeds(interaction, pages);
  
	},
    formatThanks() {
        const deps = Object.keys(require("../package.json").dependencies);
        deps.sort(() => 0.5 - Math.random());
        const lines = [
          "[d.gg/corebot](https://discord.gg/PW7VzKtGSn)",
          deps
            .slice(0, 20)
            .map((d) => `[${d}](https://www.npmjs.com/package/${d})`)
            .join("\n") + `\nand ${deps.length - 3} more...`,
        ];
        return lines.join("\n");
        
      },
	// ------------------------------------------------------------------------------
};