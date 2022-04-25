const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
const everyone = require('../../config.json').PERMS.EVERYONE;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'bugroles',
    description: 'All the roles for Bugs server!',
    type: 'CHAT_INPUT',
    guild_id: [`945205088287326248`],
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
                { name: 'Color', value: 'color' },
                { name: 'Gender', value: 'gender' },
                { name: 'Pronouns', value: 'pronouns' },
            ],
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const roleset = interaction.options.getString('roleset');
        if (type === 'color') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_947347470353063996')
                        .setLabel('Baby Blue')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947348023061671936')
                        .setLabel('Forest Green')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947348214124802059')
                        .setLabel('Sage Green')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947348468035379200')
                        .setLabel('Grey Blue')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947348549530701854')
                        .setLabel('Crayon Red')
                        .setStyle('PRIMARY'),
                );
            const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_947358864066621440')
                        .setLabel('Dark Yellow')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947358962150428683')
                        .setLabel('Pastel Purple')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947359046271393843')
                        .setLabel('Dark Pink')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947359149224779806')
                        .setLabel('Dark Orange')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947359335443468298')
                        .setLabel('Pastel Red')
                        .setStyle('PRIMARY'),
                );
            const row3 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_947357241286205461')
                        .setLabel('Banana Yellow')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947357303588388895')
                        .setLabel('Orange')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947357564256002089')
                        .setLabel('Sunset Purple')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947357654727135283')
                        .setLabel('Light Pink')
                        .setStyle('PRIMARY'),
                );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your Color roles!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row, row2, row3] });
        } else if (type === 'gender') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_947339067090169867')
                        .setLabel('Male')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_948662136631070740')
                        .setLabel('Female')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_948662194776702986')
                        .setLabel('Transgender')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_948662191932981370')
                        .setLabel('NonBinary')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_948662189009555456')
                        .setLabel('Genderfluid')
                        .setStyle('PRIMARY'),
                );
            const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_948662198698377266')
                        .setLabel('Questioning')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_948662202854932490')
                        .setLabel('Other')
                        .setStyle('PRIMARY'),
                );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your Gender roles!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row, row2] });
        } else if (type === 'pronouns') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_947338734129516556')
                        .setLabel('He/Him')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947338857672749056')
                        .setLabel('She/Her')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947338938832523354')
                        .setLabel('They/Them')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947339120819191870')
                        .setLabel('Ask')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_947342124712611881')
                        .setLabel('It/Its')
                        .setStyle('PRIMARY'),
                );
            const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_947339179463954475')
                        .setLabel('NeoPronouns')
                        .setStyle('PRIMARY'),
                );

            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your Pronouns roles!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row, row2] });
        }

    },

    // ------------------------------------------------------------------------------
};