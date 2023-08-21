// ------------------------------------------------------------------------------
// Function + Prop Exports

const { ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, ActionRowBuilder } = require("discord.js");
const { max } = require("moment/moment");
const {totalUsers} = require("../util/totalUsers.js")

// ------------------------------------------------------------------------------
module.exports = {
	statusChanger
};

// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

async function statusChanger() {
    
    if (client.user.id === "955267092800733214") {
		const status = [
			`Dev build`,
			"Not a production version",
			"Made with ♥️",
			"Unstable!",
			"I probably crashed lol",
			`Serving ${totalUsers} users!`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
            client.user.setPresence({
                activities: [{
                    type: ActivityType.Custom,
                    name: `${newActivity}`,
                }],
                status: 'dnd',
            });
		}, 10000);
	}
	if (client.user.id === "950525282434048031") {
		const status = [
			`CB v4.0.0`,
			"Made with ♥️",
			"Built on DJS14",
			"Hi Seth!",
			`Serving ${totalUsers} users!`
				`${client.guilds.cache.size} Discord Servers`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
            client.user.setPresence({
                activities: [{
                    type: ActivityType.Custom,
                    name: `${newActivity}`,
                }],
                status: 'online',
            });
		}, 10000);

	}
	if (client.user.id === "1019253573139316776") {
		const status = [
			`CB Beta v4.0.0`,
			"Not prod lol",
			"Made with ♥️",
			"Built on DJS14",
			"Updates daily!",
			`${client.guilds.cache.size} Servers | ${totalUsers} users!`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
            client.user.setPresence({
                activities: [{
                    type: ActivityType.Custom,
                    name: `${newActivity}`,
                }],
                status: 'idle',
            });
		}, 10000);
    }
}