const fn = require('../util/genUtils')
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { getGuildTags, getGuildRolebuttons, getMembers } = require('../db/dbAccess');
const scheduler = require('../modules/scheduler');
const moment = require('moment');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'autocomplete interactioncreate',
    type: 'interactionCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(interaction) {
        const guild = interaction.guild.id;
        const uid = interaction.user.id
        if (!interaction.isAutocomplete()) return;
        const focusedValue = interaction.options.getFocused();
        if (interaction.commandName === 'test') {
            const choices = ['A', 'B'];
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            const response = await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }
        if (interaction.commandName === 'tag-manager') {
            const tags = await getGuildTags(guild)
            const tagsMapped = tags.map(t => {
                return {
                    name: t.embed.title.slice(0, 30),
                    value: t._id
                };
            }).filter(t => t.name.toLowerCase().includes(focusedValue.toLowerCase()));
            await interaction.respond(tagsMapped.slice(0, 25))
        }
        if (interaction.commandName === 'rolebutton-manager') {
            const rb = await getGuildRolebuttons(guild)
            const rbMapped = rb.map(rb => {
                return {
                    name: rb.embed.title.slice(0, 30),
                    value: rb._id
                };
            }).filter(rb => rb.name.toLowerCase().includes(focusedValue.toLowerCase()));
            await interaction.respond(rbMapped.slice(0, 25))
        }
        if (interaction.commandName === 'remind') {
            const jobs = (await scheduler.listJobs())
                .filter(j =>
                    j.file === '../commands/misc/remind' &&
                    j.func === 'doRemind' &&
                    j.args[0] === interaction.guild.id &&
                    j.args[2] === interaction.user.id,
                );
            const remindersOptions = jobs.map(j => {
                const time = moment(new Date(j.intv));
                const name = `${time.fromNow(true)}: ${j.args[3]}`;
                return {
                    name: `${name.length >= 32 ? name.substring(0, 29) + '...' : name}`,
                    value: j._id,
                    fullMessage: j.args[3],
                };
            }).filter(o => o.fullMessage.toLowerCase().includes(focusedValue.toLowerCase()));
            await interaction.respond(remindersOptions.slice(0, 25));
        }
        if (interaction.commandName === 'set-pronouns') {
            const member = await getMembers(uid)
            const memberMapped = member.map(member => {
                return {
                    name: member.name.slice(0, 30),
                    value: member._id
                };
            }).filter(member => member.name.toLowerCase().includes(focusedValue.toLowerCase()));
            await interaction.respond(memberMapped.slice(0, 25))
        }
        if (interaction.commandName === 'set-proxy') {
            const member = await getMembers(uid)
            const memberMapped = member.map(member => {
                return {
                    name: member.name.slice(0, 30),
                    value: member._id
                };
            }).filter(member => member.name.toLowerCase().includes(focusedValue.toLowerCase()));
            await interaction.respond(memberMapped.slice(0, 25))
        }
        if (interaction.commandName === 'set-avatar') {
            const member = await getMembers(uid)
            const memberMapped = member.map(member => {
                return {
                    name: member.name.slice(0, 30),
                    value: member._id
                };
            }).filter(member => member.name.toLowerCase().includes(focusedValue.toLowerCase()));
            await interaction.respond(memberMapped.slice(0, 25))
        }
        if (interaction.commandName === 'proxy-info') {
            const member = await getMembers(uid)
            const memberMapped = member.map(member => {
                return {
                    name: member.name.slice(0, 30),
                    value: member._id
                };
            }).filter(member => member.name.toLowerCase().includes(focusedValue.toLowerCase()));
            await interaction.respond(memberMapped.slice(0, 25))
        }
        if (interaction.commandName === 'set-color') {
            const member = await getMembers(uid)
            const memberMapped = member.map(member => {
                return {
                    name: member.name.slice(0, 30),
                    value: member._id
                };
            }).filter(member => member.name.toLowerCase().includes(focusedValue.toLowerCase()));
            await interaction.respond(memberMapped.slice(0, 25))
        }
    },

    // ------------------------------------------------------------------------------
};