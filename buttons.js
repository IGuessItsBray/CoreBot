const { ButtonComponent } = require('@discordjs/builders');
const Discord = require('discord.js');
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require("./config.json");

module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (interaction.isButton() && interaction.customId.startsWith('rolebutton_')) {
            const member = interaction.member;
            const ssRegex = /rolebutton_(\d+)/;
            const ssMatch = interaction.customId.match(ssRegex);
            const role = ssMatch[1];

            if (member._roles.includes(role)) {
                member.roles.remove(role);
                interaction.reply({
                    content: '**Removed <@&' + role + '>**',
                    ephemeral: true,
                });
            }
            else {
                member.roles.add(role);
                interaction.reply({
                    content: '**Added <@&' + role + '>**',
                    ephemeral: true,
                });
            }
        }
    });
};

