// ------------------------------------------------------------------------------
// commandUtils.js
// Utilities for reading & handling application commands
// ------------------------------------------------------------------------------

const fs = require('fs');
const { PermissionFlagsBits, PermissionsBitField, Locale, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { translate } = require('./genUtils');

const locales = Object.values(Locale).filter(l => ![
    'hr',
    'hi',
    'th',
    'vi',
].includes(l));

const publicPath = './commands/';
const privatePath = './commands/private/';
const userPath = './commands/user/';
const localePath = './locales/';

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
    readFiles,
    deploy,
    generateLocales,
};

// ------------------------------------------------------------------------------
// Public Functions
// ------------------------------------------------------------------------------

function readFiles(includeLocales = false) {

    // the default permissions for all commands, if not defined in the command
    const defaultMemberPermissions = new PermissionsBitField([PermissionFlagsBits.Administrator]);

    // public = global, private = support/dev guild only
    const publicJsFiles = fs.readdirSync(publicPath).filter(f => f.endsWith('.js'));
    const privateJsFiles = fs.readdirSync(privatePath).filter(f => f.endsWith('.js'));
    const userJsFiles = fs.readdirSync(userPath).filter(f => f.endsWith('.js'));

    // public commands, only available in guilds by default
    // can be overwritten in command file
    const publicCommands = publicJsFiles.map(cf => {
        try {
            // remove the require cache for the command module
            delete require.cache[require.resolve(`.${publicPath}${cf}`)];
            const command = require(`.${publicPath}${cf}`);

            // check if the command is enabled or not
            if (!command.enabled) return;

            // check if the command has a locale file
            let commandLocale;
            try {
                commandLocale = require(`.${localePath}${command.name}.json`);
            }
            catch {
                if (includeLocales) console.log(`❌🌎 ${cf} ➜ No locale file found`);
            }
            // if the command has a locale file, set the localizations
            if (includeLocales && commandLocale) {
                // Set the name & description localizations
                command.name_localizations = commandLocale.name_localizations;
                command.description_localizations = commandLocale.description_localizations;

                // Set the option localizations
                if (command.options) {
                    command.options = command.options.map(o => {
                        if (!commandLocale.option_localizations[o.name]) return o;
                        o.name_localizations = commandLocale.option_localizations[o.name].name_localizations;
                        o.description_localizations = commandLocale.option_localizations[o.name].description_localizations;
                        if (o.choices) {
                            o.choices = o.choices.map(c => {
                                if (!commandLocale.option_localizations[o.name]._choices[c.value]) return c;
                                c.name_localizations = commandLocale.option_localizations[o.name]._choices[c.value];
                                return c;
                            });
                        }
                        return o;
                    });
                }
            }

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
                contexts:
                    command.contexts
                    ?? [ InteractionContextType.Guild ],
                integration_types:
                    command.integration_types
                    ?? [ ApplicationIntegrationType.GuildInstall ],
            };
        }
        catch (e) {
            console.error(`❌🌎 ${cf} ➜ ${e.message}`, e);
        }
        // filter out any undefined/disabled commands
    }).filter(c => c);

    // private commands are only available in the support/dev guild
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
            delete command.contexts;
            delete command.integration_types;

            // add extra info & return the command
            return {
                ...command,
                default_member_permissions:
                    command.default_member_permissions
                    ?? new PermissionsBitField(setMemberPermissions),
                contexts: [InteractionContextType.Guild],
                integration_types: [ApplicationIntegrationType.GuildInstall],
            };
        }
        catch (e) {
            console.error(`❌🔒 ${cf} ➜ ${e.message}`, e);
        }
        // filter out any undefined/disabled commands
    }).filter(c => c);

    // commands that can ONLY be run outside of guilds
    const userCommands = userJsFiles.map(cf => {
        try {
            // remove the require cache for the command module
            delete require.cache[require.resolve(`.${userPath}${cf}`)];
            const command = require(`.${userPath}${cf}`);
            // check if the command is enabled or not
            if (!command.enabled) return;
            delete command.permissions;
            // add extra info & return the command
            return {
                ...command,
                contexts:
                    command.contexts
                    ?? [ InteractionContextType.BotDM, InteractionContextType.PrivateChannel, InteractionContextType.Guild ],
                integration_types:
                    command.integration_types
                    ?? [ ApplicationIntegrationType.UserInstall ],
            };
        }
        catch (e) {
            console.error(`❌🔒 ${cf} ➜ ${e.message}`, e);
        }
        // filter out any undefined/disabled commands
    }).filter(c => c);

    return {
        publicCommands,
        privateCommands,
        userCommands,
    };
}

async function generateLocales() {
    const fs = require('fs');

    const dir = localePath;
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, {
            recursive: true,
        });
    }
    fs.mkdirSync(dir);

    const { publicCommands } = readFiles();

    publicCommands.forEach(async c => {
        const name_localizations = {};
        const description_localizations = {};
        const option_localizations = {};

        for (const locale of locales) {
            const name = (await translate(c.name, locale)).toLowerCase().replace(/ /g, '_');
            const description = (await translate(c.description, locale));

            name_localizations[locale] = name;
            description_localizations[locale] = description;

            if (c.options) {
                for (const o of c.options) {
                    if (!option_localizations[o.name]) option_localizations[o.name] = { name_localizations: {}, description_localizations: {}, _choices: {} };
                    option_localizations[o.name].name_localizations[locale] = (await translate(o.name, locale)).toLowerCase().replace(/ /g, '_');
                    option_localizations[o.name].description_localizations[locale] = (await translate(o.description, locale));

                    if (o.choices) {
                        for (const choice of o.choices) {
                            if (!option_localizations[o.name]._choices[choice.value]) option_localizations[o.name]._choices[choice.value] = {};
                            option_localizations[o.name]._choices[choice.value][locale] = (await translate(choice.name, locale));
                        }
                    }
                }
            }
        }

        fs.writeFileSync(`${dir}/${c.name}.json`, `${JSON.stringify({
            name_localizations,
            description_localizations,
            option_localizations,
        }, null, 2)}`);
    });
}

function deploy(log = false) {
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v10');
    const { TOKEN: token, SELF: self, HOME: home, TAGLINE: tagline, EXTRAHOMES: extrahomes } = require('./localStorage').config;

    const rest = new REST({ version: '10' }).setToken(token);

    const {
        publicCommands,
        privateCommands,
        userCommands,
    } = readFiles(true);

    // return;
    // Register support/dev guild commands
    rest.put(Routes.applicationGuildCommands(self, home), { body: privateCommands })
        .then(res => { if (log) commandTable(res, '🔒'); })
        .catch(console.error);

    if (extrahomes) {
        extrahomes.forEach(g => {
            rest.put(Routes.applicationGuildCommands(self, g), { body: privateCommands })
                .then(res => { if (log) commandTable(res, '🔒'); })
                .catch(console.error);
        });
    }
    // Register global commands - all must be done in this one request
    // running this more than once will cause commands to be overwritten and dissapear
    // multiple groups/arrays can be passed in using an array & the spread operator
    // example: { body: [...commandArr1, ...commandArr2,...commandArr3] }
    rest.put(Routes.applicationCommands(self), { body: [ ...publicCommands, ...userCommands ] })
        .then(res => {
            if (log) commandTable(res, '🌎');
            const setupCommand = res.find(c => c.name === 'setup');
            const numberOfIconsToShow = 6;
            const game_icons = Object.keys(require('./vars').games).map(g => require('./vars').game_icons[g]);
            if (!setupCommand) return;
            rest.patch(Routes.currentApplication(), {
                body: {
                    description: ''
                        + `${tagline ?? `Start sending codes with </${setupCommand.name}:${setupCommand.id}>!`}\n\n`
                        + game_icons.sort(() => 0.5 - Math.random()).slice(0, numberOfIconsToShow).join(' ')
                        + (game_icons.length > numberOfIconsToShow ? ` *and ${game_icons.length - numberOfIconsToShow} more*` : '')
                        + '\nGet Support at [d.gg/corebot](<https://discord.gg/v9fzkjycr3>)',
                },
            }).catch(console.error);
        }).catch(console.error);
}
// ------------------------------------------------------------------------------

function commandTable(arr, type) {
    const formatted = arr.map(c => {
        return { type: c.integration_types?.includes(ApplicationIntegrationType.UserInstall) ? '👤' : type, name: c.name, id: c.id };
    });
    const transformed = formatted.reduce((acc, { id, ...x }) => {
        acc[id] = x; return acc;
    }, {});
    console.table(transformed);
}