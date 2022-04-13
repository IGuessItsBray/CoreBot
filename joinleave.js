const Discord = require('discord.js');
const { Client, Intents, MessageEmbed } = require('discord.js');
const config = require("./config.json");

module.exports = (client) => {
    client.on('guildMemberAdd', guildMember =>{
        
        guildMember.guild.channels.cache.get('955268336747417650').send(`<@${guildMember.user.id}> Joined `)
    });
    client.on('guildMemberRemove', guildMember =>{
        
        guildMember.guild.channels.cache.get('955268336747417650').send(`<@${guildMember.user.id}> Left`)
    });
};