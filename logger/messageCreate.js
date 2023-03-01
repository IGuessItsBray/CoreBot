const fn = require('../util/genUtils')
const { setTboxContent } = require('../db/dbAccess');
const axios = require('axios');
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'Tbox MsgCreate',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        const guild = message.guild.id
        const user = message.author.tag
        const tbox = 'Tupperbox#4754'

        if (user === tbox) {
            const embed = message.embeds[0]
            console.log(embed.description)
            const content = embed.description
            const check = embed.footer.text
            if (check.startsWith("Message ID")){
                //console.log(content)
                //message.delete()
                setTboxContent(guild, content)
            }
        }
    },

    // ------------------------------------------------------------------------------
};