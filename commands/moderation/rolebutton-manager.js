const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require("discord.js");
const { getRoleButtons } = require('../../db/dbAccess');
const { updateRoleButtons } = require('../../db/dbAccess');
const { getGuildRolebuttons } = require('../../db/dbAccess');
const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType } = require('discord.js');
const buttons = require("../../modules/buttons");
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;

module.exports = {
	name: 'rolebutton-manager',
	description: 'Manage role buttons.',
	type: OPTION.SUB_COMMAND,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],
	options: [
		{
			name: 'update',
			description: 'Add or Update a role button',
			type: 1,
			options: [
				{
					name: 'title',
					description: 'The embed title',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'text',
					description: 'The embed text',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'footer',
					description: 'The embed footer',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],

		},
		{
			name: 'addbuttons',
			description: 'Add buttons to the prompt!',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'The embed title',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'role',
					description: 'The role to add',
					type: OPTION.ROLE,
					required: true,
				},
				{
					name: 'style',
					description: 'The sytle of the button',
					choices: [
						{ name: 'ButtonStyle.Primary', value: 'ButtonStyle.Primary' },
						{ name: 'Secondary', value: 'ButtonStyle.Secondary' },
						{ name: 'ButtonStyle.Success', value: 'ButtonStyle.Success' },
						{ name: 'Danger', value: 'ButtonStyle.Danger' },
					],
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'label',
					description: 'The label of the button',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'enabled',
					description: 'Is the button enabled or disabled?',
					type: OPTION.BOOLEAN,
					required: true,
				},
			],

		},
		{
			name: 'send',
			description: 'Send a Prompt and Buttons!',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'The embed title',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true
				},
			],

		},
		{
			name: 'list',
			description: 'List all Buttons!!',
			type: 1,
			options: [],

		},
	],
	async execute(interaction) {
		const guild = interaction.guild;
		const embedTitle = interaction.options.getString('title');
		const embedText = interaction.options.getString('text');
		const embedFooter = interaction.options.getString('footer');
		const id = interaction.options.getString('id');

		const prompt = await getRoleButtons(id, guild);
		const embed = new EmbedBuilder();
		const rows = [new ActionRowBuilder()];
		let count = 0;


		switch (interaction.options.getSubcommand()) {
			default:
				await interaction.reply({ content: 'Not Done', ephemeral: true });
				return;
			case 'update': {
				const res =
					await updateRoleButtons(null, guild, embedTitle, embedText, embedFooter);

				await interaction.reply(
					{
						content: `New embed created!
						ID: ${res._id}
						Title: ${res.embedTitle}`,
						ephemeral: true
					}
				);
				break;
			}
			case 'addbuttons': {
				// Get the prompt from the database
				const prompt = await getRoleButtons(id, guild);

				// If the role already exists, overwrite it
				const buttons = prompt.buttons
					.filter(b => b.role !== interaction.options.getRole('role').id);

				// Create a 'button' object
				const newButton = {
					role: interaction.options.getRole('role').id,
					style: interaction.options.getString('style'),
					label: interaction.options.getString('label'),
					enabled: !interaction.options.getBoolean('enabled'),
				}

				const res =
					await updateRoleButtons(
						id,
						guild,
						prompt.embed.title,
						prompt.embed.text,
						prompt.embed.footer,
						[...buttons, newButton]
					);

				await interaction.reply(
					{
						content: `Buttons added!
						ID: ${res._id}
						Title: ${res.embed.title}
						Role: <@&${res.buttons.role}>`,
						ephemeral: true
					}
				);
				break;
			}
			case 'send': {
				const styles = {
					SECONDARY: ButtonStyle.Secondary,
					PRIMARY: ButtonStyle.Primary,
					DANGER: ButtonStyle.Danger,
					SUCCESS: ButtonStyle.Success,
				  }
				embed.setTitle(prompt.embed.title);
				embed.setDescription(prompt.embed.text);
				embed.setFooter({ text: prompt.embed.footer })
				prompt.buttons.forEach(elem => {
					if (rows[Math.floor(count / 5)] == null) rows.push(new ActionRowBuilder());
					rows[Math.floor(count / 5)].addComponents(
						new ButtonBuilder()
							.setCustomId(`rolebutton_${elem.role}`)
							.setLabel(`${elem.label}`)
							.setStyle(styles[elem.style])
							.setDisabled(elem.enabled),
					);
					count++;
				});
				await interaction.channel.send({
					embeds: [embed],
					components: rows,
				});
				interaction.reply({
					content: '**Success!**',
					ephemeral: true,
				});
				break;
			}
			case 'list': {
				const prompts = (await getGuildRolebuttons(interaction.guild))
					.map(rb => `\`${rb._id}\` - ${rb.embed.title} - ${rb.buttons.length} button(s)`)
					.join('\n');

				await interaction.reply(`Prompts:\n${prompts}`);
			}
			break;
		}
	},
}