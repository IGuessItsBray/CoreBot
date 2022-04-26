const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
const everyone = require('../../config.json').PERMS.EVERYONE;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'cadetroles',
    description: 'All the roles for KWC server!',
    type: 'CHAT_INPUT',
    guild_id: [`940774597287112766`],
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
                { name: 'DM Status', value: 'dms' },
                { name: 'Element', value: 'element' },
                { name: 'Pronouns', value: 'pronouns' },
                { name: 'Pings', value: 'pings' },
                { name: 'Unit', value: 'unit' },
            ],
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const roleset = interaction.options.getString('roleset');
        if (roleset === 'dms') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_945504514750943232')
                        .setLabel('DMs Open')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504558749216850')
                        .setLabel('DMs Closed')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504591993249803')
                        .setLabel('Ask to DM')
                        .setStyle('PRIMARY'),
                );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your DM Status!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row] });
        } else if (roleset === 'element') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_945776263367372850')
                        .setLabel('Air')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945776318681849926')
                        .setLabel('Army')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945776387728482354')
                        .setLabel('Sea')
                        .setStyle('PRIMARY'),
                );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your element!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row] });
        }
        else if (roleset === 'pings') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_940775123991027823')
                        .setLabel('TGMD Role')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945775787976564816')
                        .setLabel('Gaming Role')
                        .setStyle('PRIMARY'),
                );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your pings!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row] });
        }
        else if (roleset === 'pronouns') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_945504345804386324')
                        .setLabel('He/Him')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504417468264458')
                        .setLabel('They/Them')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504389571952660')
                        .setLabel('She/Her')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945504468722651208')
                        .setLabel('Ask my pronouns')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945775954024857700')
                        .setLabel('Any pronouns')
                        .setStyle('PRIMARY'),
                );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your pronouns!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row] });
        }
        else if (roleset === 'unit') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rolebutton_943338720856256543')
                        .setLabel('80 Air')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945775521508261988')
                        .setLabel('530 Air')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_943338749696278558')
                        .setLabel('1569 Army')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('rolebutton_943338639734214717')
                        .setLabel('94 Sea')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('rolebutton_945775438523949158')
                        .setLabel('40 Sea')
                        .setStyle('SECONDARY'),
                );
            const embed = new MessageEmbed()
                .setColor("5865F2")
                .setAuthor("Roles!")
                .setDescription("Select your unit!")
                .setFooter({ text: "o/ Hi there!" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], components: [row] });
        }
    },

    // ------------------------------------------------------------------------------
};