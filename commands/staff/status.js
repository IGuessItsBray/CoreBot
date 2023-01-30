const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {

	// ------------------------------------------------------------------------------
	// Definition
	// ------------------------------------------------------------------------------

	name: 'status',
	description: 'get the status of the bot',
	permissions: ['SEND_MESSAGES'],
	enabled: true,

	// ------------------------------------------------------------------------------
	// Execution
	// ------------------------------------------------------------------------------

	async execute(interaction, ephemeral = false) {

		const url = 'http://10.0.0.57:9090/api/v1/query?query=';
		const query = encodeURIComponent('pm2_uptime');
		const res = await axios.get(`${url}${query}`);

		const formattedRes = res.data.data.result.map(row => {
			const date = new Date(Date.now() - row.value[1] * 1000);
			const dateStamp = Math.floor(date.getTime() / 1000.0);
			return `${row.metric.group} online since <t:${dateStamp}:R><t:${dateStamp}:D><:ONLINE:960716360416124990>`;
		}).join('\n');


		const embed = new MessageEmbed()
			.setColor('#2f3136')
			.setDescription(`${formattedRes}`);

		await interaction.reply({
			embeds: [embed],
			ephemeral,
		});
	},

	// ------------------------------------------------------------------------------
};

String.prototype = function () {
	return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};