const { CommandInteraction, EmbedBuilder, Intents, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { version } = require("mongoose");
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'updates',
    description: 'shows the update logs!',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'version',
            description: 'Select the version to view the update logs',
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'v1', value: '1' },
                { name: 'v2', value: '2' },
                { name: 'v3', value: '3' },
                { name: 'v4', value: '4' },
            ],
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const version = interaction.options.getString('version');
        if (version === '1') {
            const file = new AttachmentBuilder('./assets/Logo.png');
            const embed1 = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('CoreBot v1')
                .setURL('https://github.com/IGuessItsBray/CoreBot')
                .setAuthor({ name: 'Some name', iconURL: 'attachment://Logo.png', url: 'https://github.com/IGuessItsBray/CoreBot' })
                .setDescription('Some description here')
                .setThumbnail('attachment://Logo.png')
                .addFields(
                    { name: 'Regular field title', value: 'Some value here' },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                .setImage('attachment://Logo.png')
                .setTimestamp()
                .setFooter({ text: 'Some footer text here', iconURL: 'attachment://Logo.png' });
            await interaction.reply({ embeds: [embed1], files: [file] });

        } else if (version === '2') {
            const file = new AttachmentBuilder('./assets/Logo.png');
            const embed1 = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('CoreBot v1')
                .setURL('https://github.com/IGuessItsBray/CoreBot')
                .setAuthor({ name: 'Some name', iconURL: 'attachment://Logo.png', url: 'https://github.com/IGuessItsBray/CoreBot' })
                .setDescription('Some description here')
                .setThumbnail('attachment://Logo.png')
                .addFields(
                    { name: 'Regular field title', value: 'Some value here' },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                .setImage('attachment://Logo.png')
                .setTimestamp()
                .setFooter({ text: 'Some footer text here', iconURL: 'attachment://Logo.png' });
            await interaction.reply({ embeds: [embed1], files: [file] });

        } else if (version === '3') {
            const file = new AttachmentBuilder('./assets/Logo.png');
            const embed3 = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('CoreBot v3')
                .setURL('https://github.com/IGuessItsBray/CoreBot')
                .setAuthor({ name: 'Updates!', iconURL: 'attachment://Logo.png', url: 'https://github.com/IGuessItsBray/CoreBot' })
                .setDescription('CoreBot v3 update logs!')
                .setThumbnail('attachment://Logo.png')
                .addFields(
                    { name: 'New Features:', value: '\u200B' },
                    { name: 'React to report', value: 'React to any message with "🚫" to report it to server staff. Server staff can run /serversetting set_report_channel to set the channel, and then can kick/ban/timeout/warn the offending user!', inline: true },
                    { name: 'CrossChat v2', value: 'CrossChat is now part of CoreBot itself. Server staff can run /serversetup set_crosschat_channel to set the channel! All messages sent in this channel will be sent to all other crosschat channels! At this time, message edit and attatchments are not functional, but will be in a later version!', inline: true },
                    { name: 'Join/Leave alerts!', value: 'Server staff must run /serversetup set_welcome_info to set the channel and the message for join, and optionally /serversetup set_leave_info for users who leave', inline: true },
                )
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Info', value: '/info general will show you the info of the user such as their badges, profile photo, and message count. /info messages will dump their messages into a text file, and /info punishments will dump their punishments into a text file for you!', inline: true },
                    { name: 'Punishment/Message tracking', value: 'Now, all messages and punishments are tracked and saved to the database for use in /info!', inline: true },
                    { name: 'About and Updates', value: 'Just a little command for the bot as a whole. About will give you some bot specific info, and update will show you this!', inline: true },
                )
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    {
                        name: 'Changes', value: `
                    -Fixed dev server bug where it said "CoreBot | testing has started" instead of "CoreBot has started"
                    -Fixed glitch with info where it wouldnt properly show badges
                    -Readded dev team badge emotes to dev server
                    -Reopened the support server
                    -Added 10sec changing status
                    -Added /feedback for sending bot feedback
                    -Moved /verify_config to /serversetup verify_config` },
                )
                //.setImage('attachment://Logo.png')
                .setTimestamp()
                .setFooter({ text: 'CoreBot', iconURL: 'attachment://Logo.png' });
            interaction.channel.send({ embeds: [embed3], files: [file] });
            await interaction.reply("Sent!");
        } else if (version === '3') {
            const file = new AttachmentBuilder('./assets/Logo.png');
            const embed3 = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('CoreBot v3')
                .setURL('https://github.com/IGuessItsBray/CoreBot')
                .setAuthor({ name: 'Updates!', iconURL: 'attachment://Logo.png', url: 'https://github.com/IGuessItsBray/CoreBot' })
                .setDescription('CoreBot v4 update logs!')
                .setThumbnail('attachment://Logo.png')
                .addFields(
                    { name: 'New Features:', value: '\u200B' },
                    { name: 'Remind', value: '', inline: true },
                    { name: 'Echo v2', value: '', inline: true },
                    { name: 'Proxy', value: '', inline: true },
                )
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: '', value: '', inline: true },
                    { name: '', value: '', inline: true },
                    { name: '', value: '', inline: true },
                )
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    {
                        name: 'Changes', value: `
                    ` },
                )
                //.setImage('attachment://Logo.png')
                .setTimestamp()
                .setFooter({ text: 'CoreBot', iconURL: 'attachment://Logo.png' });
            interaction.channel.send({ embeds: [embed3], files: [file] });
            await interaction.reply("Sent!");

        }
    },

    // ------------------------------------------------------------------------------
};