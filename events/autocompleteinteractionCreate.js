const fn = require('../util/genUtils')
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
const { getGuildTags, getGuildRolebuttons } = require('../db/dbAccess');
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
    },

    // ------------------------------------------------------------------------------
};