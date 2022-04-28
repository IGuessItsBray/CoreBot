const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { getRoleButtons } = require('../../db/dbAccess');
const { updateRoleButtons } = require('../../db/dbAccess');
const { getGuildRolebuttons } = require('../../db/dbAccess');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;

module.exports = {
	name: 'rolebutton-manager',
	description: 'Manage role buttons.',
	type: OPTION.SUB_COMMAND,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],
	options: [
		{
			name: 'update',
			description: 'Add or Update a role button',
			type: 1,
			options: [
				{
					name: 'title',
					description: 'The embed title',
					type: OPTION.STRING,
					required: true,
				},
				{
					name: 'text',
					description: 'The embed text',
					type: OPTION.STRING,
					required: true,
				},
				{
					name: 'footer',
					description: 'The embed footer',
					type: OPTION.STRING,
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
					type: OPTION.STRING,
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
						{ name: 'Primary', value: 'PRIMARY' },
						{ name: 'Secondary', value: 'SECONDARY' },
						{ name: 'Success', value: 'SUCCESS' },
						{ name: 'Danger', value: 'DANGER' },
					],
					type: OPTION.STRING,
					required: true,
				},
				{
					name: 'label',
					description: 'The label of the button',
					type: OPTION.STRING,
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
					type: OPTION.STRING,
					required: true,
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
		const embed = new MessageEmbed();
		const rows = [new MessageActionRow()];
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
						content: `Out:\`\`\`json\n${res}\`\`\``,
					}
				);
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
						content: `Out:\`\`\`json\n${res}\`\`\``,
					}
				);
			}
			case 'send': {
				embed.setTitle(prompt.embed.title);
				embed.setDescription(prompt.embed.text);
				embed.setFooter({ text: prompt.embed.footer })
				prompt.buttons.forEach(elem => {
					if (rows[Math.floor(count / 5)] == null) rows.push(new MessageActionRow());
					rows[Math.floor(count / 5)].addComponents(
						new MessageButton()
							.setCustomId(`rolebutton_${elem.role}`)
							.setLabel(elem.label)
							.setStyle(elem.style)
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
			}
			case 'list': {
				const prompts = (await getGuildRolebuttons(interaction.guild))
					.map(rb => `\`${rb._id}\` - ${rb.embed.title} - ${rb.buttons.length} button(s)`)
					.join('\n');

				await interaction.reply(`Prompts:\n${prompts}`);
			}
		}
	},
}