const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { getTag, getGuildTags } = require('../../db/dbAccess');
const { newTag } = require('../../db/dbAccess');


module.exports = {
	name: 'tag-manager',
	description: 'Manage tags.',
	enabled: true,
    default_permission: false,
    default_member_permissions: 0x8,
    permissions: [],
	options: [
		{
			name: 'new',
			description: 'Add a new tag',
			type: 1,
			options: [
				{
					name: 'title',
					description: 'The embed title',
					type: 'STRING',
					required: true,
				},
				{
					name: 'text',
					description: 'The embed text',
					type: 'STRING',
					required: true,
				},
				{
					name: 'footer',
					description: 'The embed footer',
					type: 'STRING',
					required: true,
				},
			],

		},
		{
			name: 'send',
			description: 'Send a tag',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'The embed title',
					type: 'STRING',
					required: true,
				},
			],

		},
		{
			name: 'list',
			description: 'List all tags!!',
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

		const prompt = await getTag(id, guild);
		const embed = new MessageEmbed();


		switch (interaction.options.getSubcommand()) {
			default:
				await interaction.reply({ content: 'Not Done', ephemeral: true });
				return;
			case 'new': {
				const res =
					await newTag(null, guild, embedTitle, embedText, embedFooter);

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
				await interaction.channel.send({
					embeds: [embed],
				});
				interaction.reply({
					content: '**Success!**',
					ephemeral: true,
				});
			}
			case 'list': {
				const prompts = (await getGuildTags(interaction.guild))
					.map(tag => `\`${tag._id}\` - ${tag.embed.title}`)
					.join('\n');

				await interaction.reply(`Tags:\n${prompts}`);
			}
		}
	},
}