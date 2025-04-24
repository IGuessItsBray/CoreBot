// ------------------------------------------------------------------------------
// vars.js
// ------------------------------------------------------------------------------

// Supported Games
const games = Object.freeze({
    AFK:    'AFK Journey',
    HSR:    'Honkai Star Rail',
    ZZZ:    'Zenless Zone Zero',
    GI:     'Genshin Impact',
    WUWA:   'Wuthering Waves',
    RAID:   'Raid: Shadow Legends',
    NIKKE:  'Goddess of Victory: Nikke',
    ARK:    'Arknights',
});

// Special copy links for games that have them
const game_copylink = Object.freeze({
    DEFAULT:'https://clipboard.nexus-codes.app/?copy=',
    HSR:    'https://hsr.hoyoverse.com/gift?code=',
    ZZZ:    'https://zenless.hoyoverse.com/redemption?code=',
    GI:     'https://genshin.hoyoverse.com/en/gift?code=',
});

// Special copy text for games that have links
const game_copytext = Object.freeze({
    DEFAULT:'✂ Copy Code',
    HSR:    'Redeem Code',
    ZZZ:    'Redeem Code',
    GI:     'Redeem Code',
});

// ------------------------------------------------------------------------------

// Icons added on the prod bot application
const game_icons_prod_bot = Object.freeze({
    DEFAULT:'<:nexus:1268953786890588255>',
    AFK:    '<:AFK:1265002985314979954>',
    HSR:    '<:HSR:1265003023508308153>',
    ZZZ:    '<:ZZZ:1265003012418703362>',
    GI:	    '<:GI:1266475043114717244>',
    WUWA:	'<:WUWA:1266477140719964221>',
    RAID:	'<:RAID:1265003031712235583>',
    NIKKE:	'<:NIKKE:1270445985297858594>',
    ARK:	'<:ARK:1270456102064095272>',
});

// Icons added on the home server for testing and edge
const game_icons_server = Object.freeze({
    DEFAULT:'<:nexus:1263576042359095327>',
    AFK:    '<:AFK:1264987657306509384>',
    HSR:    '<:HSR:1264987654198399137>',
    ZZZ:    '<:ZZZ:1264987656371310633>',
    GI:	    '<:GI:1266474989566034024>',
    WUWA:	'<:WUWA:1266477000583811232>',
    RAID:	'<:RAID:1265002064136900669>',
    NIKKE:	'<:NIKKE:1270446040415207535>',
    ARK:	'<:ARK:1270456178421534761>',
});

// ------------------------------------------------------------------------------

module.exports = {
    // Constants
    games,
    game_icons: buildGameIcons(),
    game_copylink,
    game_copytext,

    // Obscenity Filter
    obscenity_matcher: buildObscenityMatcher(),

    // Discord Shard Manager
    shard: undefined,
};

// ------------------------------------------------------------------------------

function buildGameIcons() {
    const config = require('./localStorage').config;
    return config.SELF === '1224387094831562902' ? game_icons_prod_bot : game_icons_server;
}

function buildObscenityMatcher() {
    const config = require('./localStorage').config;

    const {
        RegExpMatcher,
        pattern,
        englishDataset,
        englishRecommendedTransformers,
    } = require('obscenity');

    const dataset = englishDataset;

    // Load whitelist from config
    if (config.OBSCENITY_WHITELIST) {
        Object.keys(config.OBSCENITY_WHITELIST).forEach((whitelist) => {
            const originalWord = config.OBSCENITY_WHITELIST[whitelist];
            dataset.addPhrase((phrase) => phrase
                .setMetadata({ originalWord })
                .addWhitelistedTerm(whitelist));
        });
    }

    return new RegExpMatcher({
        ...dataset.build(),
        ...englishRecommendedTransformers,
    });
}

// ------------------------------------------------------------------------------