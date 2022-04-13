const fs = require('fs');
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        // Intents.FLAGS.GUILD_MESSAGES,
        // Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
});

// Keep the command reading mostly the same - nothing to fix here.
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    //commands.push(command.data.toJSON());
    // replace the above line with the below if you use my format instead of command builders 
    commands.push(command);
}

// registerCommands MUST be run ONLY after the 'bot' is connected to the socket
client.once('ready', async () => {
    await registerCommands();
    process.exit();
});

// Bring the bot online for context & to make REST calls unnecessary
client.login(token);

/**
 * @name registerCommands
 * @description Register commands with discord using an active client***
 * @param {String} guildId Optional, Only target one guild with registration
 */
async function registerCommands(guildId = undefined) {

    console.info(`Registering Commands`);

    const guilds = client.guilds.cache
        .filter(g => guildId === undefined ? true : g.id == guildId);

    await Promise.all(guilds.map(async guild => {

        //Filter out guild-specific commands
        const cmdList_filtered = commands.filter(c =>
            c.guild_id === undefined ||
            c.guild_id === '' ||
            c.guild_id === guild.id ||
            (Array.isArray(c.guild_id) && c.guild_id.length === 0) ||
            (Array.isArray(c.guild_id) && c.guild_id.includes(guild.id))
        );

        //Register commands per-guild
        await guild.commands
            .set(cmdList_filtered)
            .then(console.log(` ✅ ${guild.name} ➡️ ${cmdList_filtered.map(c => c.name)}`));

        //Set defined command permissions
        const guildCommands = await guild.commands.fetch();
        await Promise.all(guildCommands.map(async command => {
            await command.permissions
            // Per-Command permissions from command definitions
            const cmdPerms = commands
                .filter(c => c.name == command.name)[0].permissions;
            cmdPerms === undefined ?
                null :
                await command.permissions
                    .add({ command: command.id, permissions: cmdPerms })
                    .catch(e => {
                        console.warn(`Loading ${command.name} Permissions in ${guild.name} Failed: \n${e}`);
                    });
        }));
    }));
}
