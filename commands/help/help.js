const { Client, Intents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'help',
    description: 'Replies with the bots information and commands',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const { paginateText } = require('../../util/pageinate')
        const commands =  await interaction.client.application.commands.fetch();
        const commandsFormatted = commands.map(c => {

            const options = c.options.filter(o => ![OPTION.SUB_COMMAND, OPTION.SUB_COMMAND_GROUP].includes(o.type)).map(o => o.name);
            const subcommands = c.options.filter(o => [OPTION.SUB_COMMAND, OPTION.SUB_COMMAND_GROUP].includes(o.type)).map(o => `</${c.name} ${o.name}:${c.id}>`);

            return     `**</${c.name}:${c.id}>**\n` + 
                    (subcommands.length > 0 ? `${subcommands.join(' ')}\n` : '') +
                    (options.length > 0 ? `Options: ${options.join(', ')}\n` : '') +
                    `${c.description ?? '*No Description*'}`;
        });


        const pages = [
            { content: `Welcome to <@${interaction.client.user.id}>!
            CoreBot is a multipurpose discord bot made by Bray! It features music, moderation, role buttons, and more!
            For more help, press the button to join the discord server, and to add the bot to your server, press the invite button!`, title: 'About', footer: 'Made with ♥️ by Bray#1051, Seth#0110 and PMass#0001' },
            { title: 'Commands', content: commandsFormatted.join('\n\n') },
            { content: `**Up Since** <t:${Math.floor(interaction.client.readyAt.getTime() / 1000.0)}:R><t:${Math.floor(interaction.client.readyAt.getTime() / 1000.0)}:D>`, title: 'Uptime', footer: 'CoreBot' },
            { content: `For support, pop into the CoreBot Development support server:
            [CoreBot Support server](https://discord.gg/xqgJGQgXzG)`, title: 'Support', footer: 'CoreBot' },
            { content: `${this.formatThanks()}`, title: 'Acknowledgements', footer: 'CoreBot' },
            { content: `
            ***Developers:***
            \`Bray\` | <@530845321270657085> - Lead Developer <:CBDeveloper:1012934220030693376>
            \`Seth\` | <@111592329424470016> - Lead Developer <:CBDeveloper:1012934220030693376>
            \`Mass\` | <@91944143458152448> - Developer <:CBDeveloper:1012934220030693376>
            \`Alex\` | <@474420299874435092> - Network Developer <:CBNetDev:1013108642519715980>
            ***Testers:***
            \`Jamie\` | <@295299571456933888> - Beta Tester <:CBBetaTester:1012934218592034887>
            \`Ethereal\` | <@844641126748258355> - Beta Tester <:CBBetaTester:1012934218592034887>
            `, title: 'Meet our team', footer: 'CoreBot' },
        ];
        await paginateText(interaction, pages, false);
    },
    formatThanks() {
		const deps = Object.keys(require('../../package.json').dependencies);
		deps.sort(() => 0.5 - Math.random());
		const lines = [
			'[discord.gg/corebot](https://discord.gg/xqgJGQgXzG)',
			deps.slice(0, 20).map(d => `[${d}](https://www.npmjs.com/package/${d})`).join('\n') + `\nand ${deps.length - 3} more...`,
		];
		return lines.join('\n');
	}

    // ------------------------------------------------------------------------------
};