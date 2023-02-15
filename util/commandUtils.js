// ------------------------------------------------------------------------------
// commandUtils.js
// Utilities for reading & handling application commands
// ------------------------------------------------------------------------------

const fs = require('fs');
const { PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { blue, bold, underline, yellow, red, green } = require('colorette');

const helpPath = './commands/help/';
const miscPath = './commands/misc/';
const modPath = './commands/moderation/';
const proxyPath = './commands/proxy/';
const staffPath = './commands/staff/';
const mailPath = './commands/modmail/';

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
	const defaultMemberPermissions = new PermissionsBitField([PermissionFlagsBits.Administrator]);

	// public = global, private = support/dev guild only
	const helpJsFiles = fs.readdirSync(helpPath).filter(f => f.endsWith('.js'));
	const miscJsFiles = fs.readdirSync(miscPath).filter(f => f.endsWith('.js'));
	const modJsFiles = fs.readdirSync(modPath).filter(f => f.endsWith('.js'));
	//const proxyJsFiles = fs.readdirSync(proxyPath).filter(f => f.endsWith('.js'));
	const privateJsFiles = fs.readdirSync(staffPath).filter(f => f.endsWith('.js'));
	const mmJsFiles = fs.readdirSync(mailPath).filter(f => f.endsWith('.js'));


	const helpCommands = helpJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${helpPath}${cf}`)];
			const command = require(`.${helpPath}${cf}`);

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
					?? new PermissionsBitField(setMemberPermissions),
				dm_permission:
					command.dm_permission
					?? true,
			};
		}
		catch (e) {
			console.error(red(`❌🌎 ${cf} ➜ ${e.message}`));
		}
		// filter out any undefined/disabled commands
	}).filter(c => c);

	const miscCommands = miscJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${miscPath}${cf}`)];
			const command = require(`.${miscPath}${cf}`);

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
					?? new PermissionsBitField(setMemberPermissions),
				dm_permission:
					command.dm_permission
					?? true,
			};
		}
		catch (e) {
			console.error(red(`❌🌎 ${cf} ➜ ${e.message}`));
		}
		// filter out any undefined/disabled commands
	}).filter(c => c);

	const modCommands = modJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${modPath}${cf}`)];
			const command = require(`.${modPath}${cf}`);

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
					?? new PermissionsBitField(setMemberPermissions),
				dm_permission:
					command.dm_permission
					?? true,
			};
		}
		catch (e) {
			console.error(red(`❌🌎 ${cf} ➜ ${e.message}`));
		}
		// filter out any undefined/disabled commands
	}).filter(c => c);

	//const proxyCommands = proxyJsFiles.map(cf => {
		//try {
			// remove the require cache for the command module
			//delete require.cache[require.resolve(`.${proxyPath}${cf}`)];
			//const command = require(`.${proxyPath}${cf}`);

			// check if the command is enabled or not
			//if (!command.enabled) return;

			// figure out the default permissions
			// use the 'permissions' property if it exists
			//const setMemberPermissions =
				//command.permissions || defaultMemberPermissions;
			// delete the permissions property becauase it causes issues in
			// the api's current state if left.
			//delete command.permissions;

			// add perms & return the command
			//return {
				//...command,
				//default_member_permissions:
					//command.default_member_permissions
					//?? new PermissionsBitField(setMemberPermissions),
				//dm_permission:
					//command.dm_permission
					//?? true,
			//};
		//}
		//catch (e) {
			//console.error(red(`❌🌎 ${cf} ➜ ${e.message}`));
		//}
		// filter out any undefined/disabled commands
	//}).filter(c => c);

	const mmCommands = mmJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${mailPath}${cf}`)];
			const command = require(`.${mailPath}${cf}`);

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
					?? new PermissionsBitField(setMemberPermissions),
				dm_permission:
					command.dm_permission
					?? true,
			};
		}
		catch (e) {
			console.error(red(`❌🌎 ${cf} ➜ ${e.message}`));
		}
		// filter out any undefined/disabled commands
	}).filter(c => c);

	const privateCommands = privateJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${staffPath}${cf}`)];
			const command = require(`.${staffPath}${cf}`);

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
					?? new PermissionsBitField(setMemberPermissions),
			};
		}
		catch (e) {
			console.error(red(`❌🔒 ${cf} ➜ ${e.message}`));
		}
		// filter out any undefined/disabled commands
	}).filter(c => c);

	return {
		helpCommands,
		miscCommands,
		modCommands,
		//proxyCommands,
		privateCommands,
		mmCommands,
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
		helpCommands,
		miscCommands,
		modCommands,
		//proxyCommands,
		privateCommands,
		mmCommands,
	} = readFiles();

	// Register support/dev guild commands
	rest.put(Routes.applicationGuildCommands(self, home), { body: privateCommands })
		.then(res => { if (log) commandTable(res, '🔒'); })
		.catch(console.error);

	// Register global commands - all must be done in this one request
	// running this more than once will cause commands to be overwritten and dissapear
	// multiple groups/arrays can be passed in using an array & the spread operator
	// example: { body: [...commandArr1, ...commandArr2,...commandArr3] }
	rest.put(Routes.applicationCommands(self), {
		body: [
			...helpCommands,
			...miscCommands,
			...modCommands,
			//...proxyCommands,
			...mmCommands
		]
	})
		.then(res => { if (log) commandTable(res, '🌎'); })
		.catch(red(console.error));
}

// ------------------------------------------------------------------------------

function commandTable(arr, type) {
	const formatted = arr.map(c => {
		return { type, name: c.name, id: c.id };
	});
	const transformed = formatted.reduce((acc, { id, ...x }) => {
		acc[id] = x; return acc;
	}, {});
	console.table(transformed);
}