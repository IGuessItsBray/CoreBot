// ------------------------------------------------------------------------------
// genUtils.js
// ------------------------------------------------------------------------------

const { InteractionType } = require('discord.js');
const Sentry = require('@sentry/node');

const guildIconDict = {};

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------
module.exports = {
    // Git Info & App Facts
    getAppFacts,
    gitInfo,

    // Discord Interaction Utilities
    messageComponentCollector,
    modalCollector,

    // Guild Icon Emoji Utilities
    uploadGuildIcons,
    deleteGuildIcons,

    // Messaging Tools
    messageAppAdmins,
    messageServerAdmins,
    messageFlaggedUsers,

    // String & General Utilities
    toProperCase,
    clean,
    formatNumber,
    translate,

    // Console Colors
    color: {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        reset: '\x1b[0m',
    },
};

// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

// this function should ALWAYS be called in a try block
// before a finally block with deleteGuildIcons to ensure the emojis are deleted
async function uploadGuildIcons(interaction, guilds) {
    const { client, id } = interaction;
    const { emojis } = client.application;
    const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase();
    const guildIcons = guilds.map(g => {
        return {
            attachment: g.iconURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(g.name)}&background=random&rounded=true`,
            name: `${g.name.replaceAll(/\s/g, '_').replaceAll(/[^a-zA-Z0-9_]/g, '')}`.slice(0, 26) + `_${randomHash}`,
            guild: g.id,
            interaction: interaction.id,
        };
    });
    for (const icon of guildIcons) {
        const newEmoji = await emojis.create({ attachment: icon.attachment, name: icon.name });
        icon.emoji = newEmoji.toString();
        icon.emojiId = newEmoji.id;
    }
    guildIconDict[id] = guildIcons;
    return guildIcons;
}

// this function should ALWAYS be called in a finally block
// after a try block with uploadGuildIcons to ensure the emojis are deleted
async function deleteGuildIcons(interaction) {
    const { client, id } = interaction;
    const { emojis } = client.application;
    const guildIcons = guildIconDict[id];
    if (guildIcons) {
        guildIcons.forEach(icon => {
            emojis.delete(icon.emojiId);
        });
    }
    delete guildIconDict[id];
}

async function translate(text, target = 'EN-GB', source = 'EN') {
    // If the source and target languages are the same, return the text as is
    if (source.toLowerCase().substring(0, 2) === target.toLowerCase().substring(0, 2)) return text;
    // DEEPL does not support these languages, but they are supported by Discord
    if (['hr', 'hi', 'th', 'vi'].includes(target.toLowerCase())) return text;
    // Normalize Discord language codes to DEEPL language codes
    // Some languages have multiple codes, so we normalize them to one
    if (['zh-cn', 'zh-tw'].includes(target.toLowerCase())) target = 'ZH-HANS';
    if (['es-es', 'es-419'].includes(target.toLowerCase())) target = 'ES';
    if (['no'].includes(target.toLowerCase())) target = 'NB';
    if (['sv-se'].includes(target.toLowerCase())) target = 'SV';
    // Load the DEEPL API key from the local storage
    const { config } = require('./localStorage');
    const deepl = require('deepl-node');
    const translator = new deepl.Translator(config.DEEPL_KEY);
    // Translate the text
    try {
        return (await translator.translateText(text, source, target.toUpperCase())).text;
    }
    // If an error occurs, log it and return the original text
    catch (e) {
        console.error(`genUtils: Error translating to ${target}: ${e?.message}`);
        return text;
    }
}

async function getAppFacts(client) {
    // Dev Application Info
    const application = await client.application.fetch();
    const adminUsers =
        // team ownership / members
        application.owner.members?.map(m => m.user) ??
        // individual application ownership
        [application.owner];

    const { execSync } = require('child_process');
    let tagName;
    let branchName;
    try {
        tagName = execSync('git describe --tags --always').toString().trim();
        branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    }
    catch {
        tagName = 'unknown';
        branchName = 'HEAD';
    }
    return {
        adminUsers,
        tagName,
        branchName,
    };
}

function gitInfo() {
    const { execSync } = require('child_process');
    let tagName;
    let branchName;
    try {
        tagName = execSync('git describe --tags --always').toString().trim();
        branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    }
    catch {
        tagName = 'unknown';
        branchName = 'HEAD';
    }
    return {
        tagName,
        branchName,
    };
}

async function messageComponentCollector(sourceMessage, timeoutMins = 2) {
    /*
        Remember to fetchReply if calling from command interaction reply!

        const message = await interaction.reply({
            ...
            fetchReply: true
        });
    */
    try {
        const messageComponentInteraction = await sourceMessage
            .awaitMessageComponent({
                filter: i => i.type === InteractionType.MessageComponent,
                time: timeoutMins * 60 * 1000,
            });
        return messageComponentInteraction;
    }
    catch (e) {
        if (e?.message?.toLowerCase().includes('reason: time')) { return undefined; }
        else {
            console.error(`genUtils: componentCollector: ${e}`, e);
            Sentry.captureException(e);
        }
    }
}

async function modalCollector(interaction, modal, timeoutMins = 2) {
    try {
        interaction.showModal(modal);
        const modalInteraction = await interaction
            .awaitModalSubmit({
                filter: i => i.type === InteractionType.ModalSubmit,
                time: timeoutMins * 60 * 1000,
            });
        return modalInteraction;
    }
    catch (e) {
        if (e?.message?.toLowerCase().includes('reason: time')) { return undefined; }
        else {
            console.error(`genUtils: modalCollector: ${e}`, e);
            Sentry.captureException(e);
        }
    }
}

async function messageFlaggedUsers(flag, content, jsonFile) {
    const { getFlaggedUsers } = require('../db/dbAccess');
    const flaggedUsers = await getFlaggedUsers(flag);
    return [].concat(...await require('./vars').shard.broadcastEval(async (client, { content, jsonFile, flaggedUsers }) => {
        if (!client.shard.ids.includes(0)) return;
        const { AttachmentBuilder } = require('discord.js');
        const users = await Promise.all(flaggedUsers.map(async u => client.users.fetch(u)));
        const file = jsonFile ? new AttachmentBuilder(Buffer.from(JSON.stringify(jsonFile, null, 4)),
            {
                name: `${new Date().getTime()}.json`,
            }) : null;
        return await Promise.all(users.map(async user => {
            try {
                await user.send({ content, files: jsonFile ? [file] : null });
                return { user: user.id, success: true };
            }
            catch (e) {
                return { user: user.id, success: false, error: e?.message ?? e };
            }
        }));
    }, { context: { content, jsonFile, flaggedUsers } })).filter(e => e);
}

async function messageAppAdmins(content, jsonFile) {
    return [].concat(...await require('./vars').shard.broadcastEval(async (client, { content, jsonFile }) => {
        if (!client.shard.ids.includes(0)) return;
        const { AttachmentBuilder } = require('discord.js');
        const application = await client.application.fetch();
        const adminUsers = application.owner.members?.map(m => m.user) ?? [application.owner];
        const users = await Promise.all(adminUsers.map(async u => client.users.fetch(u.id)));
        const file = jsonFile ? new AttachmentBuilder(Buffer.from(JSON.stringify(jsonFile, null, 4)),
            {
                name: `${new Date().getTime()}.json`,
            }) : null;
        return await Promise.all(users.map(async user => {
            try {
                await user.send({ content, files: jsonFile ? [file] : null });
                return { user: user.id, success: true };
            }
            catch (e) {
                return { user: user.id, success: false, error: e?.message ?? e };
            }
        }));
    }, { context: { content, jsonFile } })).filter(e => e);
}

async function messageServerAdmins(guild, message, footer = true) {
    return [].concat(...await require('./vars').shard.broadcastEval(async (client, { guildid, message, footer }) => {
        const guild = client.guilds.cache.find(g => g.id === guildid);
        if (!guild) return;

        const { PermissionFlagsBits: p } = require('discord.js');
        const me = guild.members.me;
        const owner = await guild.fetchOwner();

        // const systemChannel = guild.systemChannel;
        const safetyChannel = guild.safetyAlertsChannel;
        const updatesChannel = guild.publicUpdatesChannel;
        const widgetChannel = guild.widgetChannel;
        const ownerChannel = await owner.createDM();

        const signature = `\n-# This message was sent automatically for the moderators of **${guild.name}**.\n-# Have questions or need support? Visit us at [d.gg/corebot](<https://discord.gg/v9fzkjycr3>) or our support server at [d.gg/corebot](<https://discord.gg/v9fzkjycr3>) `;
        const allowedMentions = { parse: [], users: [owner.id] };

        let channelToUse = undefined;
        if (safetyChannel && safetyChannel?.viewable && safetyChannel.permissionsFor(me).has(p.SendMessages)) channelToUse = safetyChannel;
        else if (updatesChannel && updatesChannel?.viewable && updatesChannel.permissionsFor(me).has(p.SendMessages)) channelToUse = updatesChannel;
        else if (widgetChannel && widgetChannel?.viewable && widgetChannel.permissionsFor(me).has(p.SendMessages)) channelToUse = widgetChannel;
        else channelToUse = ownerChannel;

        try {
            await channelToUse.send({ content: `${message.replaceAll('\\n', '\n').replaceAll('%BOT%', channelToUse.client?.user ?? 'corebot')}${footer ? signature : ''}`, allowedMentions });
            return { guild: guild.id, channel: channelToUse.id, success: true };
        }
        catch (e) {
            return { guild: guild.id, channel: channelToUse.id, success: false, error: e?.message ?? e };
        };
    }, { context: { guildid: guild, message, footer } })).filter(e => e);
}

function toProperCase(txt) {
    // List of connecting words that should not be capitalized
    const exceptions = ['and', 'or', 'but', 'nor', 'so', 'for', 'yet', 'a', 'an', 'the', 'x'];
    if (!txt) return txt;
    return txt.replace(/\w\S*/g, function (txt) {
        // If the word starts with 'x' followed by digits or, return as is
        if (/^x\d+/.test(txt) || /^\d+x/.test(txt)) {
            return txt.toLowerCase(); // Return 'x' with digits or digits with 'x' to lowercase
        }

        // Convert the first character to uppercase and the rest to lowercase
        const firstChar = txt.charAt(0).toUpperCase();
        const restChars = txt.substr(1).toLowerCase();

        // Check if the word is in the exceptions list (ignoring case)
        if (exceptions.includes(txt.toLowerCase())) {
            return txt.toLowerCase(); // Return the word as it is
        }
        else {
            return firstChar + restChars; // Return the properly cased word
        }
    });
}

function clean(txt) {
    if (!txt) return txt;
    return toProperCase(txt.replace(/[^\w\s,&+*]+/g, ' ').replace(/(\s*new\s*$)|(^\s*new(?!\s+players\b)\s*)/gi, '').trim());
}

function formatNumber(num) {
    if (isNaN(num)) return num;
    if (num === 0) return '0';
    num = Number(num);
    const format = [
        { value: 1e12, symbol: 'T' },
        { value: 1e9, symbol: 'B' },
        { value: 1e6, symbol: 'M' },
        { value: 1e3, symbol: 'k' },
        { value: 1, symbol: ' ' },
    ];
    const formatIndex = format.findIndex((data) => num >= data.value);
    const symbol = format[formatIndex === -1 ? 6 : formatIndex].symbol;
    const number = (num / format[formatIndex === -1 ? 6 : formatIndex].value).toFixed(2);
    if ([''].includes(symbol) || num < 10_000) {
        // If the number is less than 10,000, return it with commas
        return Number(num).toLocaleString();
    }
    else if (number.endsWith('.00')) {
        // If the number is a whole number, return it without the decimal
        return `${number.slice(0, -3)}${symbol}`;
    }
    else {
        // Otherwise, return the number with 2 decimal places and the symbol
        return `${number}${symbol}`;
    }
}

// ------------------------------------------------------------------------------