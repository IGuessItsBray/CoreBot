const fn = require('../util/genUtils')
const { getModmailChannel } = require('../db/dbAccess');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Message } = require('discord.js');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'Remind Buttons',
    type: 'interactionCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(interaction) {
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
                '../commands/public/remind',
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
                '../commands/public/remind',
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




    // ------------------------------------------------------------------------------
};