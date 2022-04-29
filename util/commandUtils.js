// ------------------------------------------------------------------------------
// commandUtils.js
// Utilities for reading & handling application commands
// ------------------------------------------------------------------------------

const fs = require('fs');
const { Permissions } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;

const publicPath = './commands/public/';
const privatePath = './commands/private/';

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
	readFiles,
	deploy,
};

// ------------------------------------------------------------------------------
// Public Functions
// ------------------------------------------------------------------------------

function readFiles() {

	// the default permissions for all commands, if not defined in the command
	// TODO make this configurable
	const defaultMemberPermissions = new Permissions([FLAGS.ADMINISTRATOR]);

	// public = global, private = support/dev guild only
	const publicJsFiles = fs.readdirSync(publicPath).filter(f => f.endsWith('.js'));
	const privateJsFiles = fs.readdirSync(privatePath).filter(f => f.endsWith('.js'));

	const publicCommands = publicJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${publicPath}${cf}`)];
			const command = require(`.${publicPath}${cf}`);

			// check if the command is enabled or not
			if (!command.enabled) return;

			// figure out the default permissions
			// use the 'permissions' property if it exists
			const setMemberPermissions =
				command.permissions || defaultMemberPermissions;
			// delete the permissions property becauase it causes issues in
			// the api's current state if left.
			delete command.permissions;

			// add perms & return the command
			return {
				...command,
				default_member_permissions:
					command.default_member_permissions
					?? new Permissions(setMemberPermissions),
				dm_permission:
					command.dm_permission
					?? false,
			};
		}
		catch (e) {
			console.error(`❌🌎 ${cf} ➜ ${e.message}`);
		}
		// filter out any undefined/disabled commands
	}).filter(c => c);

	const privateCommands = privateJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${privatePath}${cf}`)];
			const command = require(`.${privatePath}${cf}`);

			// check if the command is enabled or not
			if (!command.enabled) return;

			// figure out the default permissions
			// use the 'permissions' property if it exists
			const setMemberPermissions =
				command.permissions || defaultMemberPermissions;
			// delete the permissions property becauase it causes issues in
			// the api's current state if left.
			delete command.permissions;

			// add extra info & return the command
			return {
				...command,
				default_member_permissions:
					command.default_member_permissions
					?? new Permissions(setMemberPermissions),
			};
		}
		catch (e) {
			console.error(`❌🔒 ${cf} ➜ ${e.message}`);
		}
		// filter out any undefined/disabled commands
	}).filter(c => c);

	return {
		publicCommands,
		privateCommands,
	};
}

function deploy(log = false) {
	const { REST } = require('@discordjs/rest');
	const { Routes } = require('discord-api-types/v9');

	const token = require('../config.json').token;
	const self = require('../config.json').SELF;
	const home = require('../config.json').HOME;
	const rest = new REST({ version: '9' }).setToken(token);

	const {
		publicCommands,
		privateCommands,
	} = readFiles();

	// Register support/dev guild commands
	rest.put(Routes.applicationGuildCommands(self, home), { body: privateCommands })
		.then(res => {if(log) commandTable(res, '🔒');})
		.catch(console.error);

	// Register global commands - all must be done in this one request
	// running this more than once will cause commands to be overwritten and dissapear
	// multiple groups/arrays can be passed in using an array & the spread operator
	// example: { body: [...commandArr1, ...commandArr2,...commandArr3] }
	rest.put(Routes.applicationCommands(self), { body: publicCommands })
		.then(res => {if(log) commandTable(res, '🌎');})
		.catch(console.error);
}

// ------------------------------------------------------------------------------

function commandTable (arr, type) {
	const formatted = arr.map(c => {
		return { type, name: c.name, id: c.id };
	});
	const transformed = formatted.reduce((acc, { id, ...x }) => {
		acc[id] = x; return acc;
	}, {});
	console.table(transformed);
}