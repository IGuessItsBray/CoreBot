// ------------------------------------------------------------------------------
// commandUtils.js
// Utilities for reading & handling application commands
// ------------------------------------------------------------------------------

const fs = require('fs');

const publicPath = './commands/';
const privatePath = './commands/private/';
const legacyPath = './commands/legacy/';
const managersPath = './commands/managers/';
const miscPath = './commands/misc/';
const moderationPath = './commands/moderation/';
const testingPath = './commands/testing/';
const voicePath = './commands/voice/';

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
	readFiles,
};

// ------------------------------------------------------------------------------
// Public Functions
// ------------------------------------------------------------------------------

function readFiles() {
	const publicJsFiles = fs.readdirSync(publicPath).filter(f => f.endsWith('.js'));
	const privateJsFiles = fs.readdirSync(privatePath).filter(f => f.endsWith('.js'));
    const legacyJsFiles = fs.readdirSync(legacyPath).filter(f => f.endsWith('.js'));
    const managersJsFiles = fs.readdirSync(managersPath).filter(f => f.endsWith('.js'));
    const miscJsFiles = fs.readdirSync(miscPath).filter(f => f.endsWith('.js'));
    const moderationJsFiles = fs.readdirSync(moderationPath).filter(f => f.endsWith('.js'));
    const testingJsFiles = fs.readdirSync(testingPath).filter(f => f.endsWith('.js'));
    const voiceJsFiles = fs.readdirSync(voicePath).filter(f => f.endsWith('.js'));

	const publicCommands = publicJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${publicPath}${cf}`)];
			const command = require(`.${publicPath}${cf}`);

			// check if the command is enabled or not
			if(!command.enabled) return;

			// add extra info & return the command
			return {
				...command,
				default_permission:
					command.default_permission
					?? false,
				default_member_permissions:
					command.default_member_permissions
					?? 0x8,
				dm_permission:
					command.dm_permission
					?? false,
			};
		}
		catch (e) {
			console.error(`❌👥 ${cf} ➜ ${e.message}`);
		}

	});

	const privateCommands = privateJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${privatePath}${cf}`)];
			const command = require(`.${privatePath}${cf}`);

			// check if the command is enabled or not
			if(!command.enabled) return;

			// add extra info & return the command
			return {
				...command,
				default_permission:
					command.default_permission
					?? false,
				// default_member_permissions:
				// 	command.default_member_permissions
				// 	?? 0x8,
			};
		}
		catch (e) {
			console.error(`❌🔒 ${cf} ➜ ${e.message}`);
		}
	});
    const legacyCommands = legacyJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${legacyPath}${cf}`)];
			const command = require(`.${legacyPath}${cf}`);

			// check if the command is enabled or not
			if(!command.enabled) return;

			// add extra info & return the command
			return {
				...command,
				default_permission:
					command.default_permission
					?? false,
				default_member_permissions:
					command.default_member_permissions
					?? 0x8,
				dm_permission:
					command.dm_permission
					?? false,
			};
		}
		catch (e) {
			console.error(`❌👥 ${cf} ➜ ${e.message}`);
		}

	});
    const managersCommands = managersJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${managersPath}${cf}`)];
			const command = require(`.${managersPath}${cf}`);

			// check if the command is enabled or not
			if(!command.enabled) return;

			// add extra info & return the command
			return {
				...command,
				default_permission:
					command.default_permission
					?? false,
				default_member_permissions:
					command.default_member_permissions
					?? 0x8,
				dm_permission:
					command.dm_permission
					?? false,
			};
		}
		catch (e) {
			console.error(`❌👥 ${cf} ➜ ${e.message}`);
		}

	});
    const miscCommands = miscJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${miscPath}${cf}`)];
			const command = require(`.${miscPath}${cf}`);

			// check if the command is enabled or not
			if(!command.enabled) return;

			// add extra info & return the command
			return {
				...command,
				default_permission:
					command.default_permission
					?? false,
				default_member_permissions:
					command.default_member_permissions
					?? 0x8,
				dm_permission:
					command.dm_permission
					?? false,
			};
		}
		catch (e) {
			console.error(`❌👥 ${cf} ➜ ${e.message}`);
		}

	});
    const moderationCommands = moderationJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${moderationPath}${cf}`)];
			const command = require(`.${moderationPath}${cf}`);

			// check if the command is enabled or not
			if(!command.enabled) return;

			// add extra info & return the command
			return {
				...command,
				default_permission:
					command.default_permission
					?? false,
				default_member_permissions:
					command.default_member_permissions
					?? 0x8,
				dm_permission:
					command.dm_permission
					?? false,
			};
		}
		catch (e) {
			console.error(`❌👥 ${cf} ➜ ${e.message}`);
		}

	});
    const testingCommands = testingJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${testingPath}${cf}`)];
			const command = require(`.${testingPath}${cf}`);

			// check if the command is enabled or not
			if(!command.enabled) return;

			// add extra info & return the command
			return {
				...command,
				default_permission:
					command.default_permission
					?? false,
				default_member_permissions:
					command.default_member_permissions
					?? 0x8,
				dm_permission:
					command.dm_permission
					?? false,
			};
		}
		catch (e) {
			console.error(`❌👥 ${cf} ➜ ${e.message}`);
		}

	});
    const voiceCommands = voiceJsFiles.map(cf => {
		try {
			// remove the require cache for the command module
			delete require.cache[require.resolve(`.${voicePath}${cf}`)];
			const command = require(`.${voicePath}${cf}`);

			// check if the command is enabled or not
			if(!command.enabled) return;

			// add extra info & return the command
			return {
				...command,
				default_permission:
					command.default_permission
					?? false,
				default_member_permissions:
					command.default_member_permissions
					?? 0x8,
				dm_permission:
					command.dm_permission
					?? false,
			};
		}
		catch (e) {
			console.error(`❌👥 ${cf} ➜ ${e.message}`);
		}

	});

	return {
		publicCommands,
		privateCommands,
        legacyCommands,
		managersCommands,
        miscCommands,
		moderationCommands,
        testingCommands,
		voiceCommands,
	};
}


// ------------------------------------------------------------------------------
// Private Functions
// ------------------------------------------------------------------------------