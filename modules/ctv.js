const djsVoice = require('@discordjs/voice');

// ---------------------------------------------------

module.exports = {
    joinChannel,
    leaveChannel,
};

// ---------------------------------------------------

function joinChannel(channel) {
    if (connectionExists(channel.guild)) leaveChannel(channel.guild);
    djsVoice.joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
}

function leaveChannel(guild) {
    if (!connectionExists(guild)) return;
    djsVoice.getVoiceConnection(guild.id).destroy();
}

function connectionExists(guild) {
    return djsVoice.getVoiceConnection(guild.id) != undefined;
}

// ---------------------------------------------------