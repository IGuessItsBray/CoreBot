const fn = require('../util/genUtils')
const { getModmailChannel } = require('../db/dbAccess');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Message, AttachmentBuilder } = require('discord.js');
const { createMember } = require('../db/dbAccess');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'ModalSubmit',
    type: 'modalSubmit',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(modal) {
      
    },




    // ------------------------------------------------------------------------------
};