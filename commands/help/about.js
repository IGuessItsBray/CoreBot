const { CommandInteraction, EmbedBuilder, Intents, ActionRowBuilder, ButtonBuilder, ApplicationCommandType } = require("discord.js");
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'about',
    description: 'Gives you the bot info!',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const embed = new EmbedBuilder()
            .setColor('#e464ee')
            .setAuthor({ name: 'CoreBot Info!' })
            .setDescription(`
    Welcome to <@950525282434048031>!
    CoreBot is a multipurpose discord bot made by Bray! It features music, moderation, role buttons, and more!
    For more help, press the button to join the discord server, and to add the bot to your server, press the invite button!
    `)
            .setFooter({ text: "Made with ♥️ by Bray#1051, Seth#0110 and PMass#0001" })
            .setTimestamp();

        const discord = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/GAAj6DDrCJ'),
            );
        const invite = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Invite Me!')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=950525282434048031&permissions=1634838510663&scope=bot%20applications.commands'),
            );
        interaction.reply({
            embeds: [embed],
            components: [discord, invite]
        });
    },

    // ------------------------------------------------------------------------------
};