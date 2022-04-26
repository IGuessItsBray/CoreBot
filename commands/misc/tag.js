const { MessageEmbed } = require('discord.js');
const dbTags = require('../../db/dbTags');
const timeout = new Set();

const triggerCache = {};
const tagCache = {};

module.exports = {
	name: 'tag',
	description: 'Canned Responses & FAQ',
	default_permission: true,
	options: [
		{
			name: 'lookup',
			description: 'Reference for the intended tag.',
			type: 'NUMBER',
			autocomplete: true,
			required: true,
		},
		{
			name: 'ephemeral',
			description: 'Should the response be ephemeral?',
			type: 'BOOLEAN',
			required: false,
		},
	],
	async execute(interaction) {
		const lookup = interaction.options.getNumber('lookup');
		const ephemeral =
			interaction.options.getBoolean('ephemeral') ?? true;
		const tag = dbTags.getOneTag(interaction.guild.id, lookup);

		if(tag) {
			const embed = await this.makeEmbed(interaction.guild, tag);
			await interaction.reply({ embeds: [embed], ephemeral });
		}
		else {
			await interaction.reply({ content: `Tag #${lookup} Not Found.`, ephemeral: true });
		}

	},
	makeEmbed: async function (guild, tag) {
		const triggers = tag.trigger.length ? ` • ${tag.trigger.split(',').join(', ')}` : '';
		const embed = new MessageEmbed()
			.setDescription(tag.content.replaceAll('\\n', '\n'))
			.setFooter({
				text: `Tag #${tag.id}${triggers}`,
				iconURL: guild.iconURL({ dynamic: true }),
			})
			.setTimestamp(new Date(tag.editedDate))
			.setColor("BLUE");
		return embed;
	},
	rebuildCache: function (guild) {
		if(!guild) return;

		// Get all tags for guild
		const guildTags = dbTags.getAllTags(guild);
		tagCache[guild] = guildTags;

		// Prepare the list of triggers
		const triggers = [];
		guildTags
			.filter(t => t.trigger.length)
			.forEach(gt =>triggers.push.apply(triggers, gt.trigger.split(',')));
		triggerCache[guild] = triggers;
	},
	chatTrigger: async function (message) {
		const guildId = message.guild.id;
		if (
			timeout.has(guildId + message.author.id) ||
			message.author.bot
		) return;
		if (
			!triggerCache[guildId] ||
			!tagCache[guildId]
		) this.rebuildCache(guildId);

		const content = message.cleanContent.toLowerCase();
		const contentArray = content.split(' ');
		const triggerArray = triggerCache[guildId].filter(t => !timeout.has(guildId + t));
		const found = triggerArray.find(t => contentArray.includes(t));
		if(!found) return;

		const trigger = tagCache[guildId].find(t => t.trigger.includes(found));
		const embed = await this.makeEmbed(message.guild, trigger);
		message.reply({ embeds: [embed] })
			.then(m => {
				timeout.add(guildId + message.author.id);
				timeout.add(guildId + found);
				setTimeout(() => {
					m.delete();
					timeout.delete(guildId + message.author.id);
					timeout.delete(guildId + found);
				}, 60000);
			});
	},
	tagCache,
};