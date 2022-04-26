const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
const everyone = require('../../config.json').PERMS.EVERYONE;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'didnroles',
    description: 'All the roles for DIDeez Nuts server!',
    type: 'CHAT_INPUT',
    guild_id: [`944832140028297246`],
    enabled: true,
    default_permission: true,
    permissions: [
        ...admin_roles.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: true,
            };
        }),
        ...everyone.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: false,
            };
        }),
        ...dev_users.map(user => {
            return {
                id: user,
                type: 'USER',
                permission: true,
            };
        }),
    ],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'roleset',
            description: 'Select the roleset!',
            type: 'STRING',
            choices: [
                { name: 'Age', value: 'age' },
                { name: 'Location', value: 'location' },
                { name: 'SystemStatus', value: 'sysstat' },
                { name: 'Zodiac', value: 'zodiac' },
            ],
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const roleset = interaction.options.getString('roleset');
        if (roleset === 'age') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_945056545920659467')
                        .setLabel('Under 18')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945056950071222322')
                        .setLabel('Over 18!')
                        .setStyle('PRIMARY'),
                );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your age role!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row] });
        } else if (roleset === 'location') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_945046953786474497')
                        .setLabel('Europe')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945046954658906183')
                        .setLabel('North America')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945046955015409705')
                        .setLabel('South America')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945046955816538132')
                        .setLabel('Asia')
                        .setStyle('PRIMARY'),
                );
            const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_945046957133553694')
                        .setLabel('Africa')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945046956516978778')
                        .setLabel('Oceania')
                        .setStyle('PRIMARY'),
                );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your Location!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row, row2] });
        } else if (roleset === 'sysstat') {
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_945042143385354240')
                    .setLabel('Singlet')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945042913526698084')
                    .setLabel('DID System')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945043102262001694')
                    .setLabel('OSDD System')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945043167705722890')
                    .setLabel('Polyfragmented System')
                    .setStyle('PRIMARY'),
            );

            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your System Status!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row] });
        }
        else if (roleset === 'zodiac') {
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_945047094891261992')
                    .setLabel('Aries')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047095298097294')
                    .setLabel('Taurus')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047095763693673')
                    .setLabel('Gemini')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047096451547186')
                    .setLabel('Cancer')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047096564801648')
                    .setLabel('Leo')
                    .setStyle('PRIMARY'),
            );
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_945047097370091602')
                    .setLabel('Virgo')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047097735016448')
                    .setLabel('Libra')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047098053767208')
                    .setLabel('Scorpio')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047098968125471')
                    .setLabel('Sagittarius')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047099530170398')
                    .setLabel('Capricorn')
                    .setStyle('PRIMARY'),
            );
        const row3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rolebutton_945047099945418773')
                    .setLabel('Aquarius')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('rolebutton_945047100532609094')
                    .setLabel('Pisces')
                    .setStyle('PRIMARY'),
            );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your Zodiac Sign!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row, row2, row3] });
        }
    },

    // ------------------------------------------------------------------------------
};