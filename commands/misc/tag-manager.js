const { MessageAttachment } = require('discord.js');
const dbTags = require('../../db/dbTags');


module.exports = {
	name: 'tag-manager',
	description: 'Manage Canned Responses & FAQ',
	options: [
		{
			name: 'add',
			description: 'Add a Canned Response/FAQ',
			type: 1,
			options: [
				{
					name: 'content',
					description: 'Text Contained by the tag, can contain markdown, mentions, etc.',
					type: 'STRING',
					required: true,
				},
				{
					name: 'trigger',
					description: 'Automatic Triggers. Single words, comma separated, case insensitive.',
					type: 'STRING',
					required: false,
				},
			],

		},
		{
			name: 'edit',
			description: 'Edit a Canned Response/FAQ',
			type: 1,
			options: [
				{
					name: 'lookup',
					description: 'Reference for the intended tag.',
					type: 'NUMBER',
					autocomplete: true,
					required: true,
				},
				{
					name: 'content',
					description: 'Text Contained by the tag, can contain markdown, mentions, etc.',
					type: 'STRING',
					required: true,
				},
				{
					name: 'trigger',
					description: 'Automatic Triggers. Single words, comma separated, case insensitive.',
					type: 'STRING',
					required: false,
				},
			],

		},
		{
			name: 'delete',
			description: 'Delete a Canned Response/FAQ',
			type: 1,
			options: [
				{
					name: 'lookup',
					description: 'Reference for the intended tag.',
					type: 'NUMBER',
					autocomplete: true,
					required: true,
				},
			],

		},
		{
			name: 'raw',
			description: 'Get tag(s) in Raw Json.',
			type: 1,
			options: [
				{
					name: 'lookup',
					description: 'Reference for the intended tag.',
					type: 'NUMBER',
					autocomplete: true,
					required: false,
				},
			],
		},
	],
	async execute(interaction) {
		const guild = interaction.guild;
		const user = interaction.user;

		switch(interaction.options.getSubcommand()) {
			default:
				await interaction.reply({ content: 'Not Done', ephemeral: true });
				return;
			case 'add': {
				const content = interaction.options.getString('content');
				const triggers = interaction.options.getString('trigger')?.toLowerCase() ?? '';
				const tag = dbTags.insertOneTag(guild.id, content, triggers, user);
				await interaction.reply({ content: `Tag #${tag.lastInsertRowid} Added`, ephemeral: true });
				require('./tag').rebuildCache(guild.id);
				return;
			}
			case 'edit': {
				const lookup = interaction.options.getNumber('lookup');
				const content = interaction.options.getString('content');
				const triggers = interaction.options.getString('trigger')?.toLowerCase() ?? '';
				dbTags.updateOneTag(guild.id, lookup, content, triggers, user);
				await interaction.reply({ content: `Tag #${lookup} Edited`, ephemeral: true });
				require('./tag').rebuildCache(guild.id);
				return;
			}
			case 'delete': {
				const lookup = interaction.options.getNumber('lookup');
				dbTags.deleteOneTag(interaction.guild.id, lookup);
				await interaction.reply({ content: `Tag #${lookup} Deleted`, ephemeral: true });
				require('./tag').rebuildCache(guild.id);
				return;
			}
			case 'raw': {
				const lookup = interaction.options.getNumber('lookup');

				if(lookup) {
					const tag = dbTags.getOneTag(interaction.guild.id, lookup);
					const file = new MessageAttachment(
						Buffer.from(JSON.stringify(tag ?? [], null, '  ')),
						`${guild.id}-${lookup}.json`,
					);
					await interaction.reply({ files: [file], ephemeral: true });
					return;
				}
				else {
					const tags = dbTags.getAllTags(interaction.guild.id);
					const file = new MessageAttachment(
						Buffer.from(JSON.stringify(tags, null, '  ')),
						`${guild.id}.json`,
					);
					await interaction.reply({ files: [file], ephemeral: true });
					return;
				}
			}
		}
	},
	autoComplete: async function (interaction) {
		const hOptions = interaction.options._hoistedOptions;
		const choice = hOptions.find(({ focused }) => focused);
		if (
			!require('./tag').tagCache[interaction.guild.id]
		) require('./tag').rebuildCache(interaction.guild.id);
		const guildTags = require('./tag').tagCache[interaction.guild.id];
		const guildTagsOptions = guildTags.map(t => {
			const cleanContent = t.content
				.replace(/[^0-9a-z\s]/gi, '')
				.replaceAll('\n', ' ')
				.replaceAll('\t', ' ')
				.trim();
			const name = `${t['id']} ${cleanContent}`.trim();
			return {
				name: `${name.length >= 32 ? name.substring(0, 31) + '…' : name}`,
				value: t['id'],
				fullContent: name,
			};
		}).filter(o => o.fullContent.toLowerCase().includes(choice.value.toLowerCase()));
		await interaction.respond(guildTagsOptions.slice(0, 25));
	},
};