const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { getTag, getGuildTags } = require('../../db/dbAccess');
const { newTag } = require('../../db/dbAccess');
const { PermissionFlagsBits, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;

module.exports = {
	name: 'tag-manager',
	description: 'Manage tags.',
	type: OPTION.SUB_COMMAND,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],
	options: [
		{
			name: 'new',
			description: 'Add a new tag',
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
			name: 'send',
			description: 'Send a tag',
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
		const embed = new EmbedBuilder();


		switch (interaction.options.getSubcommand()) {
			default:
				await interaction.reply({ content: 'Not Done', ephemeral: true });
				return;
			case 'new': {
				const res =
					await newTag(null, guild, embedTitle, embedText, embedFooter);

				await interaction.reply(
					{
						content: `New Tag created!
						ID: ${res._id}
						Title: ${res.embed.title}`,
						ephemeral: true
					}
				);
				break;
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
				break;
			}
			case 'list': {
				const prompts = (await getGuildTags(interaction.guild))
					.map(tag => `\`${tag._id}\` - ${tag.embed.title}`)
					.join('\n');

				await interaction.reply(`Tags:\n${prompts}`);
				break;
			}
		}
	},
}