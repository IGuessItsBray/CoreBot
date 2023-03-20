const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, Events, PermissionsBitField, PermissionFlagsBits, ChannelType } = require("discord.js");
const { getTag, getGuildTags } = require('../../db/dbAccess');
const { newTag } = require('../../db/dbAccess');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;

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
			options: [],

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
				const modal = new ModalBuilder()
					.setCustomId('newtag')
					.setTitle('New Tag!')
				const header = new TextInputBuilder()
					.setCustomId('header')
					.setLabel('Header')
					.setStyle('Short')
					.setPlaceholder('The embed header')
					.setRequired(true)
				const footer = new TextInputBuilder()
					.setCustomId('footer')
					.setLabel('Footer')
					.setStyle('Short')
					.setPlaceholder('The embed footer')
					.setRequired(true)
				const content = new TextInputBuilder()
					.setCustomId('content')
					.setLabel('Content')
					.setStyle('Short')
					.setPlaceholder('The embed content')
					.setRequired(true)
				const trig = new TextInputBuilder()
					.setCustomId('triggers')
					.setLabel('Triggers')
					.setStyle('Short')
					.setPlaceholder('Phrases to trigger this tag')
					.setRequired(false)
				const imgurl = new TextInputBuilder()
					.setCustomId('imageurl')
					.setLabel('Image URL')
					.setStyle('Short')
					.setPlaceholder('The image for the embed (URL ONLY)')
					.setRequired(false)
				const row = new ActionRowBuilder().addComponents(header);
				const row2 = new ActionRowBuilder().addComponents(content);
				const row3 = new ActionRowBuilder().addComponents(footer);
				const row4 = new ActionRowBuilder().addComponents(trig);
				const row5 = new ActionRowBuilder().addComponents(imgurl);
				modal.addComponents(row, row2, row3, row4, row5);
				await interaction.showModal(modal);
				interaction.client.on(Events.InteractionCreate, async (interaction) => {
					if (interaction.isModalSubmit() && interaction.customId.startsWith('newtag')) {
						const guild = interaction.guild
						const embedTitle = interaction.fields.getTextInputValue('header');
						const embedText = interaction.fields.getTextInputValue('content');
						const embedFooter = interaction.fields.getTextInputValue('footer');
						const t = interaction.fields.getTextInputValue('triggers');
						let text = t;
						const triggers = text.split(" ");
						const imageURL = interaction.fields.getTextInputValue('imageurl');
						const res =
							await newTag(null, guild, embedTitle, embedText, embedFooter, triggers, imageURL);

						await interaction.reply(
							{
								content: `New Tag created!
							ID: ${res._id}
							Title: ${res.embed.title}
							Image: ${res.imageURL}`,
								ephemeral: true
							}
						);
					}
				})
				break;
			}
			case 'send': {
				embed.setTitle(prompt.embed.title);
				embed.setDescription(prompt.embed.text);
				embed.setFooter({ text: prompt.embed.footer })
				embed.setThumbnail(prompt.imageURL ?? undefined)
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