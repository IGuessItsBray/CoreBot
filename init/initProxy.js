// ------------------------------------------------------------------------------
// initCommands.js
// Initializes events and loads them into the client
// ------------------------------------------------------------------------------

const fs = require('fs');

module.exports = {
	init,
};

// ------------------------------------------------------------------------------

function init(client) {
	const eventFiles = fs.readdirSync('./proxy').filter(file => file.endsWith('.js'));
	eventFiles.forEach(ef => {
		const newEvent = require(`../proxy/${ef}`);
		client.on(newEvent.type, async (...args) => {
			try {
				await newEvent.execute(...args);
			}
			catch (error) {
				console.error(`${ef} Event File: Something went wrong handling this event.`, error);
			}
		});
	});
}

// ------------------------------------------------------------------------------