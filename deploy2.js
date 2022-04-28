// ------------------------------------------------------------------------------
// bot-deploy.js
// reac commands, connect to the database + register commands
// ------------------------------------------------------------------------------

const cmdUtils = require('./util/commandUtils');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = require('./config.json').token;
const self = require('./config.json').SELF;
const home = require('./config.json').HOME;
const rest = new REST({ version: '9' }).setToken(token);

// ------------------------------------------------------------------------------
// Execution
// ------------------------------------------------------------------------------

console.log('Reading Commands Files...');

// Load commands from files in
const {
    publicCommands,
    privateCommands,
    legacyCommands,
    managersCommands,
    miscCommands,
    moderationCommands,
    testingCommands,
    voiceCommands,
} = cmdUtils.readFiles();

console.log('Registering Commands...');

// Manually register the commands via rest request
// rest.put(Routes.applicationCommands(self), { body: commands })
// 	.then(console.log)
// 	.catch(console.error);

rest.put(Routes.applicationGuildCommands(self, home), { body: privateCommands })
    .then(console.log)
    .catch(console.error);

rest.put(Routes.applicationCommands(self), { body: publicCommands })
    .then(console.log)
    .catch(console.error);

rest.put(Routes.applicationCommands(self), { body: legacyCommands })
    .then(console.log)
    .catch(console.error);

rest.put(Routes.applicationCommands(self), { body: managersCommands })
    .then(console.log)
    .catch(console.error);

rest.put(Routes.applicationCommands(self), { body: miscCommands })
    .then(console.log)
    .catch(console.error);

rest.put(Routes.applicationCommands(self), { body: moderationCommands })
    .then(console.log)
    .catch(console.error);

rest.put(Routes.applicationCommands(self), { body: testingCommands })
    .then(console.log)
    .catch(console.error);

rest.put(Routes.applicationCommands(self), { body: voiceCommands })
    .then(console.log)
    .catch(console.error);