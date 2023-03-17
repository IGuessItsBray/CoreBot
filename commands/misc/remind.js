const moment = require('moment');
const scheduler = require('../../modules/scheduler');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;

module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'remind',
    description: 'Remind yourself of anything at a later time!',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'add',
            description: 'Add a new reminder',
            type: OPTION.SUB_COMMAND,
            options: [
                {
                    name: 'message',
                    description: 'Remind you of?',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'channel',
                    description: 'Channel to remind you in.',
                    type: OPTION.CHANNEL,
                    required: false,
                    channel_types: [CHANNEL.GUILD_TEXT],
                },
                {
                    name: 'seconds',
                    description: 'Seconds to wait',
                    type: OPTION.NUMBER,
                    required: false,
                    min_value: 0,
                },
                {
                    name: 'minutes',
                    description: 'Minutes to wait',
                    type: OPTION.NUMBER,
                    required: false,
                    min_value: 0,
                    max_value: 60,
                },
                {
                    name: 'hours',
                    description: 'Hours to wait',
                    type: OPTION.NUMBER,
                    required: false,
                    min_value: 0,
                    max_value: 24,
                },
                {
                    name: 'days',
                    description: 'Days to wait',
                    type: OPTION.NUMBER,
                    required: false,
                    min_value: 0,
                    max_value: 365,
                },
                {
                    name: 'weeks',
                    description: 'Weeks to wait',
                    type: OPTION.NUMBER,
                    required: false,
                    min_value: 0,
                    max_value: 52,
                },
                {
                    name: 'months',
                    description: 'Months to wait',
                    type: OPTION.NUMBER,
                    required: false,
                    min_value: 0,
                    max_value: 12,
                },
            ],
        },
        {
            name: 'list',
            description: 'List your reminders',
            type: OPTION.SUB_COMMAND,
            options: [],
        },
        {
            name: 'cancel',
            description: 'Cancel a reminder',
            type: OPTION.SUB_COMMAND,
            options: [
                {
                    name: 'reminder',
                    description: 'Reminder to cancel',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
            ],
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution + Handlers + Public Functions
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = true) {
        await interaction.deferReply({ ephemeral });
        switch (interaction.options.getSubcommand()) {
            case 'cancel': {

            }
            case 'list': {
                const jobs = (await scheduler.listJobs())
                    .filter(jobs =>
                        jobs.file === '../commands/misc/remind' &&
                        jobs.func === 'doRemind' &&
                        jobs.args[0] === interaction.guild.id &&
                        jobs.args[2] === interaction.user.id,
                    );
                const reminders = await Promise.all(jobs.map(async j => {
                    const time = `<t:${Math.floor(new Date(j.intv).getTime() / 1000.0)}:R>`;
                    const channel = await interaction.client.channels.fetch(j.args[1]);
                    const message = j.args[3];
                    return `${channel}${time} ➜ ${message}`;
                }));
                await interaction.editReply({ content: `**Reminders:**\n${reminders.length ? reminders.join('\n') : '*You have no reminders set*'}` });
                return;
            }
            case 'add': {
                const message = interaction.options.getString('message');

                const seconds = interaction.options.getNumber('seconds') ?? 0;
                const minutes = interaction.options.getNumber('minutes') ?? 0;
                const hours = interaction.options.getNumber('hours') ?? 0;
                const days = interaction.options.getNumber('days') ?? 0;
                const weeks = interaction.options.getNumber('weeks') ?? 0;
                const months = interaction.options.getNumber('months') ?? 0;
                const years = interaction.options.getNumber('years') ?? 0;

                const sender = interaction.user;
                const channel = interaction.options.getChannel('channel') ?? interaction.channel;
                const guild = interaction.guild;

                if (Number(seconds + minutes + hours + days + weeks + months + years) === Number(0)) {
                    await interaction.editReply({
                        content: 'Must be higher than 0',
                    });
                    return;
                }

                const start = moment(new Date())
                    .add(seconds, 's')
                    .add(minutes, 'm')
                    .add(hours, 'h')
                    .add(days, 'd')
                    .add(weeks, 'w')
                    .add(months, 'M')
                    .add(years, 'y');

                const date = start.toDate();
                await scheduler.scheduleJob(
                    '../commands/misc/remind',
                    'doRemind',
                    [guild.id, channel.id, sender.id, message],
                    date);

                const relDateFormat = `<t:${Math.floor(date.getTime() / 1000.0)}:R>`;
                const longDateFormat = `<t:${Math.floor(date.getTime() / 1000.0)}:R>`;
                await interaction.editReply({ content: `${sender} I'll remind you in ${channel} ${relDateFormat} (${longDateFormat})!` });
                return;
            }
        }
    },
    doRemind: async function (guildId, channelId, senderId, messageIn) {
        const client = require('../../index.js').client;

        const channel = await client.channels.fetch(channelId);
        const user = await client.users.fetch(senderId);
        const message = messageIn;

        const nowFormat = `<t:${Math.floor(new Date().getTime() / 1000.0)}:F>`;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('rdismiss')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✔️'),
                new ButtonBuilder()
                    .setCustomId('rsnooze10')
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(' 10 Minutes')
                    .setEmoji('💤'),
                new ButtonBuilder()
                    .setCustomId('rsnooze24')
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(' 24 Hours')
                    .setEmoji('💤'),
            );
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor(`Reminder for ${user.tag}`)
            .setDescription(`${nowFormat}\n${message}`)
            .setFooter({ text: "Corebot" })
            .setTimestamp();
        await channel.send({
            content: `${user}`,
            embeds: [embed],
            components: [row],
            allowedMentions: { users: [senderId] },
        });
    },
    buttonHandling: async function (interaction) {
        const guild = interaction.guild;
        const message = interaction.message;
        const channel = interaction.channel;
        if (interaction.isButton() && interaction.customId.startsWith('rdismiss')) {
            await interaction.message.delete();
            await interaction.reply({ content: '**Reminder Dismissed!**', ephemeral: true });
            return;
        }
        if (interaction.isButton() && interaction.customId.startsWith('rsnooze10')) {
            const date = moment(new Date())
                .add('10', 'm').toDate();
            const dFormat = `<t:${Math.floor(date.getTime() / 1000.0)}:R>`;

            await scheduler.scheduleJob(
                '../commands/misc/remind',
                'doRemind',
                [
                    guild.id,
                    channel.id,
                    interaction.user.id,
                    message.content.replace(/.*/, '').substr(1),
                ],
                date,
            );

            await interaction.message.delete();
            await interaction.reply({ content: `**Reminder Snoozed for 10 minutes!**\nYou will be reminded ${dFormat}.`, ephemeral: true });
            return;
        }
        if (interaction.isButton() && interaction.customId.startsWith('rsnooze24')) {
            const date = moment(new Date())
                .add('24', 'h').toDate();
            const dFormat = `<t:${Math.floor(date.getTime() / 1000.0)}:R>`;

            await scheduler.scheduleJob(
                '../commands/misc/remind',
                'doRemind',
                [
                    guild.id,
                    channel.id,
                    interaction.user.id,
                    message.content.replace(/.*/, '').substr(1),
                ],
                date,
            );

            await interaction.message.delete();
            await interaction.reply({ content: `**Reminder Snoozed for 24 hours!**\nYou will be reminded ${dFormat}.`, ephemeral: true });
        }

    }
};