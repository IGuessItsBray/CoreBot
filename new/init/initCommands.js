// ------------------------------------------------------------------------------
// initCommands.js
// Initializes commands and loads them into the client
// ------------------------------------------------------------------------------

const Sentry = require('@sentry/node');
const { Collection, InteractionType, InteractionContextType } = require('discord.js');
const cmdUtils = require('../util/commandUtils');
const { addException } = require('../db/dbExceptions');

module.exports = {
    init,
};

// ------------------------------------------------------------------------------

function init(client) {
    const {
        publicCommands,
        privateCommands,
        userCommands,
    } = cmdUtils.readFiles();

    const { DEVMODE } = require('../util/localStorage').config;

    client.commands = new Collection();
    for (const command of [...publicCommands, ...privateCommands, ...userCommands]) {
        if (!command.enabled) continue;
        client.commands[command.name] = command;
    }

    client.on('interactionCreate', async interaction => {
        if (interaction.type !== InteractionType.ApplicationCommand) return;

        const client = interaction.client;
        const guild = interaction.guild;
        const user = interaction.user;
        const subcommand = interaction.options._subcommand ?? '';
        const group = interaction.options._group ?? '';
        const options = (subcommand || group ? interaction.options.data[0].options : interaction.options.data)
            .map(option => `${option.name}:${option.value}`).join(' ');

        let { adminUsers } = await require('../util/genUtils').getAppFacts(client);
        adminUsers = adminUsers.map(u => u.id);

        const logPrefix = `${client.shard.ids[0] + 1}-${guild ? `GUILD-${guild.id}-${user.id}` : `USER-${user.id}`}`;
        const logCommand = `${interaction.commandName}${group ? ` ${group}` : ''}${subcommand ? ` ${subcommand}` : ''} ${options ? `${options} ` : ''}`;
        try {
            console.log(`${logPrefix}: /${logCommand}`);
            if (client.commands[interaction.commandName].admin && !adminUsers.includes(user.id)) {
                return await interaction.reply({
                    content: 'You do not have permission to use this command.'
                        + `\n-# ${interaction.client.user} administrators have been notified of this attempt.`,
                    //    + `\n-# ${adminUsers.map(u => `<@${u}>`)}`,
                    ephemeral: true,
                    allowedMentions: {},
                });
            }
            else {
                await client
                    .commands[interaction.commandName]
                    .execute(interaction, undefined, interaction.locale);
            }
        }
        catch (error) {
            if (error.message.includes('Shards are still being spawned')) {
                await interaction.reply({
                    content: 'The bot is still starting up, please try again in a few minutes.'
                        + '\n-# Have questions or need support? Visit us at [nexus-codes.app](<https://nexus-codes.app>) or our support server at [support.nexus-codes.app](<https://support.nexus-codes.app>)',
                    ephemeral: true,
                }).catch(() => { undefined; });
            }
            else {
                // Send error to Sentry
                Sentry.captureException(error, `${logPrefix}: Something went wrong executing this interaction.`);
                // Add exception to DB for support
                const dbException = await addException(
                    error,
                    logCommand,
                    interaction?.guild?.id,
                    interaction?.channel?.id,
                    interaction?.user?.id,
                ).catch(() => undefined);
                // Log error to console with error code
                console.log(`${logPrefix}: Exception happened - ${dbException?.identifier ? `${dbException?.identifier} , ` : ''}${error.message}`, dbException?.identifier && !DEVMODE ? '' : error);
                const message = {
                    content: 'Something went wrong executing this command.'
                        + `\n-# Need help? Note down error code \`${dbException.identifier}\` and join our support server at [support.nexus-codes.app](<https://support.nexus-codes.app>).`,
                    ephemeral: true,
                };
                interaction.reply(message).catch(() => {
                    interaction.followUp(message).catch(() => {
                        console.error(`${logPrefix}: Something went REALLY wrong, and couldn't even send an error message.`);
                    });
                });
            }
        }
    });
}

// ------------------------------------------------------------------------------