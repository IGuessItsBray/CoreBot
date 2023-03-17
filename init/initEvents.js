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
	const { blue, bold, underline, yellow, red, green } = require('colorette');
	const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
	eventFiles.forEach(ef => {
		const newEvent = require(`../events/${ef}`);
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