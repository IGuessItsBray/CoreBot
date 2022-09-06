const fn = require('../util/genUtils')
const { getModmailChannel } = require('../db/dbAccess');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message } = require('discord.js');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'Modmail Button Press',
    type: 'interactionCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(modmail) {
        if (modmail.channel.type == 'DM') {
            if (modmail.content === "!newthread") return;
            if (modmail.isButton() && modmail.customId.startsWith('nt')) {
                const guilds = [];
            for (const [, guild] of modmail.client.guilds.cache) {
                await guild.members.fetch(modmail.user).then(() => guilds.push(guild)).catch(error => console.log(error));
            }

            const servers = [];
            for (let i = 0; i < Object.keys(guilds).length; i++) {
                servers.push({ label: Object.entries(guilds)[i][1].name, value: Object.entries(guilds)[i][1].id });
            }
            const embed = new MessageEmbed()
                .setAuthor('CoreBot')
                .setDescription("Select a Server!")
                .setFooter({ text: "Corebot" })
                .setTimestamp();
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('server')
                        .setPlaceholder('Choose a Server')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(servers),
                );
                const user = modmail.user
            await modmail.reply({ embeds: [embed], components: [row] })
            }
        }
    }




    // ------------------------------------------------------------------------------
};