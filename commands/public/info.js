const { MessageEmbed } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const badges = require('../../config.json').emotes;
const { dev, tester, networkadmin } = require('../../config.json');
const { findMessageLog } = require('../../db/dbAccess');
const { findUserCount } = require('../../db/dbAccess');
const { getPunishments } = require('../../db/dbAccess');
const { MessageAttachment } = require('discord.js');
const axios = require('axios');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'info',
    description: 'gets the info of a user',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The user to get the info of',
            type: OPTION.USER,
            required: true,
        },
        {
            name: 'type',
            description: 'The type of info to generate',
            type: OPTION.STRING,
            choices: [
                { name: 'General', value: 'gen' },
                { name: 'Messages', value: 'msg' },
                { name: 'Punishments', value: 'pun' },
            ],
            required: true,
        },
        {
            name: 'ephemeral',
            description: 'Is the message ephemeral?',
            type: OPTION.BOOLEAN,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const user = interaction.options.getMember('user');
        const ephemeralSetting = interaction.options.getBoolean('ephemeral');
        const type = interaction.options.getString('type');
        const dateStamp2 = Math.floor(interaction.client.readyAt.getTime() / 1000.0);
        const { characters, messages } = await findUserCount(user.id, interaction.guild.id);
        const id = user.id
        const url = 'http://10.0.0.57:9090/api/v1/query?query=';
        const query = encodeURIComponent('pm2_up{name!~"pm2-metrics",name!~"MC.*"}');
        const res = await axios.get(`${url}${query}`);
        const guild = interaction.guild
        const formattedRes = res.data.data.result.map(row => {
            const date = new Date(Date.now() - row.value[1] * 1000);
            const dateStamp = Math.floor(date.getTime() / 1000.0);
            return `${row.metric.group} online since <t:${dateStamp}:R><t:${dateStamp}:D><:ONLINE:960716360416124990>`;
        }).join('\n');
        if (type === 'gen') {
            if (id === "950525282434048031") {
                const target = await interaction.guild.members.fetch(user);
                const flags = target.user?.flags?.toArray() ?? [];
                let flagString = '';
                if (dev.includes(target.user.id)) {
                    flagString += '<:CBDeveloper:1012934220030693376>';
                }
                if (tester.includes(target.user.id)) {
                    flagString += '<:CBBetaTester:1012934218592034887>';
                }
                if (networkadmin.includes(target.user.id)) {
                    flagString += '<:CBNetDev:1013108642519715980>';
                }
                flags.forEach(elem => {
                    try {
                        flagString += `${badges[elem]}`;
                    }
                    catch { undefined; }
                });
                if (flags.length <= 0 || flagString.length <= 0) flagString += 'None';
                const Response = new MessageEmbed()
                    .setColor("AQUA")
                    .setAuthor(target.user.tag, target.user.avatarURL({
                        dynamic: true,
                        size: 512
                    }))
                    .setThumbnail(target.user.avatarURL({
                        dynamic: true,
                        size: 512
                    }))
                    .addField("ID", `${target.user.id}`)
                    .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "none"}`)
                    .addField("Member Since", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
                    .addField("Badges", `${flagString}`, true)
                    .addField("Discord User Since", `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)
                    .addField("Characters", `${characters}`, true)
                    .addField("Messages", `${messages}`, true)
                    .addField("Status:", `${formattedRes}`)
                    .addField("Uptime:", `Online since <t:${dateStamp2}:R><t:${dateStamp2}:D>`)


                interaction.reply({
                    embeds: [Response],
                    ephemeral: ephemeralSetting
                })
            }
            else if (id !== "950525282434048031") {
                const target = await interaction.guild.members.fetch(user);
                const flags = target.user?.flags?.toArray() ?? [];
                let flagString = '';
                if (dev.includes(target.user.id)) {
                    flagString += '<:CBDeveloper:1012934220030693376>';
                }
                if (tester.includes(target.user.id)) {
                    flagString += '<:CBBetaTester:1012934218592034887>';
                }
                if (networkadmin.includes(target.user.id)) {
                    flagString += '<:CBNetDev:1013108642519715980>';
                }
                flags.forEach(elem => {
                    try {
                        flagString += `${badges[elem]}`;
                    }
                    catch { undefined; }
                });
                if (flags.length <= 0 || flagString.length <= 0) flagString += 'None';
                const Response = new MessageEmbed()
                    .setColor("AQUA")
                    .setAuthor(target.user.tag, target.user.avatarURL({
                        dynamic: true,
                        size: 512
                    }))
                    .setThumbnail(target.user.avatarURL({
                        dynamic: true,
                        size: 512
                    }))
                    .addField("ID", `${target.user.id}`)
                    .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "none"}`)
                    .addField("Member Since", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
                    .addField("Badges", `${flagString}`, true)
                    .addField("Discord User Since", `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)
                    .addField("Characters", `${characters}`, true)
                    .addField("Messages", `${messages}`, true)


                interaction.reply({
                    embeds: [Response],
                    ephemeral: ephemeralSetting
                })

            }

        } else if (type === 'msg') {
            //console.log(messages)
            const embed = new MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`${user.user.username}#${user.user.discriminator}'s messages`)
                .setDescription(`Messages from ${user}`)
                .setFooter({ text: "Corebot" })
                .setTimestamp();
            const messages = await findMessageLog(user.id);
            const messagesFormatted = messages.map(m =>
                `${m.timestamp.toLocaleString()} #${interaction.client.channels.resolve(m.channel).name}: ${m.content.replaceAll('\n', ' ')}`,
            );
            const file = new MessageAttachment(
                Buffer.from(messagesFormatted.join('\n')),
                `FETCHED-MESSAGES.txt`,
            );
            await interaction.reply({
                embeds: [embed],
                files: [file],
                ephemeral: ephemeralSetting
            });

        } else if (type === 'pun') {
            const embed = new MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`${user.user.username}#${user.user.discriminator}'s punishments`)
                .setDescription(`Punishments for ${user}`)
                .setFooter({ text: "Corebot" })
                .setTimestamp();
            const punishments = await getPunishments(user.id);
            const punishmentsFormatted = punishments.map(p =>
                `${p.type}: Message: ${p.message.replaceAll('\n', ' ')}
Action taken by: ${interaction.client.users.resolve(p.staffUser)?.tag ?? id}`,
            );
            console.log(punishments)
            const file = new MessageAttachment(
                Buffer.from(punishmentsFormatted.join('\n')),
                `FETCHED-PUNISHMENTS.txt`,
            );
            await interaction.reply({
                embeds: [embed],
                files: [file],
                ephemeral: ephemeralSetting
            });
        }

    },

    // ------------------------------------------------------------------------------
};