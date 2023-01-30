const { time } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'newmember',
    description: 'Create a new proxy member',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const modal = new Modal()
            .setCustomId('newproxymember')
            .setTitle('New Member')
            .addComponents(
                new TextInputComponent() // We create a Text Input Component
                    .setCustomId('name')
                    .setLabel('Name')
                    .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                    .setPlaceholder('Name your member!')
                    .setRequired(true), // If it's required or not.
                new TextInputComponent() // We create a Text Input Component
                    .setCustomId('prns')
                    .setLabel('Pronouns')
                    .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                    .setPlaceholder('Set your members pronouns')
                    .setRequired(true), // If it's required or not
                new TextInputComponent() // We create a Text Input Component
                    .setCustomId('desc')
                    .setLabel('Description')
                    .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                    .setPlaceholder('Set the description of your member')
                    .setRequired(false), // If it's required or not
            );
        if (interaction.commandName === 'newmember') {
            showModal(modal, {
                client: interaction.client, // Client to show the Modal through the Discord API.
                interaction: interaction, // Show the modal with interaction data.
            });
        }
    },

    // ------------------------------------------------------------------------------
};