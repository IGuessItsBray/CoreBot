const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
const everyone = require('../../config.json').PERMS.EVERYONE;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'devupdate',
    description: 'For sending a dev update from the bot',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: true,
    default_permission: false,
    permissions: [
        ...admin_roles.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: false,
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
            name: 'message',
            description: 'The message you want to send',
            type: 'STRING',
            required: true,
        },
        {
            name: 'type',
            description: 'The type of message to use',
            type: 'STRING',
            choices: [
                { name: 'Raw Text', value: 'text' },
                { name: 'Embed', value: 'embed' },
            ],
            required: true,
        },
        {
            name: 'author',
            description: 'The embed author',
            type: 'STRING',
            required: false,
        },
        {
            name: 'colour',
            description: 'Embed Colour Hex (Don\'t include #)',
            type: 'STRING',
            required: false,
        },
        {
            name: 'body1header',
            description: 'First field of the embed',
            type: 'STRING',
            required: false,
        },
        {
            name: 'body1text',
            description: 'First field of the embed',
            type: 'STRING',
            required: false,
        },
        {
            name: 'body2header',
            description: 'Second field of the embed',
            type: 'STRING',
            required: false,
        },
        {
            name: 'body2text',
            description: 'Second field of the embed',
            type: 'STRING',
            required: false,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const announceChannelIds = require('../../config.json').GUILD_CHANNELS;
        const type = interaction.options.getString('type');
        const author = interaction.options.getString('author');
        const colour = interaction.options.getString('colour') ?? '000000';
        const body1header = interaction.options.getString('body1header');
        const body1text = interaction.options.getString('body1text');
        const body2header = interaction.options.getString('body2header');
        const body2text = interaction.options.getString('body2text');
        const message = interaction.options.getString('message');
        const guildOptions = interaction.client.guilds.cache.map(g => {
            return {
                label: g.name,
                description: g.id,
                value: g.id,
            };
        }).slice(0, 25);
        const components = [];
        components.push(new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(interaction.id)
                .setPlaceholder('Select Guilds')
                .setMaxValues(guildOptions.length)
                .addOptions(guildOptions),
        ));
        await interaction.reply({
            content: '**Select Servers to send to.**',
            components,
            // ephemeral,
        });
        (await interaction.fetchReply())
            .awaitMessageComponent({
                // filter for the custom id that was set above
                // using the source interaction id for this just makes things easier
                filter: i => i.customId.includes(interaction.id),

                // time out in 1 minute
                time: 1 * 60 * 1000,
            })
            .then(async selectInteraction => {
                // defer the 'update' to prevent discord complaints
                await selectInteraction.deferUpdate();

                // selectInteraction.values is an array of selected guild ids
                //console.log(selectInteraction.values);

                // match guilds to selected guild ids
                // retrieve the matching channels from the client
                const announceChannelIds = require('../../config.json').GUILD_CHANNELS;
                const selectedChannels = selectInteraction.values.map(id => {
                    return interaction.client.channels.cache.get(announceChannelIds[id]);
                });

                //console.log(selectedChannels);
                console.log
                if (type === 'text') {
                    console.log
                    selectedChannels.forEach(channel => {
                        channel.send({ content: message });
                    });
                    await interaction.followUp({ content: 'Messages sent', ephemeral: true });
                }
                else if (type === 'embed') {
                    console.log
                    const embed = new MessageEmbed()
                        .setColor(colour)
                        .setAuthor(author)
                        .setDescription(message)
                        // .addFields(
                        //     {
                        //         name: body1header,
                        //         value: body1text,
                        //     },
                        //     {
                        //         name: body2header,
                        //         value: body2text,
                        //     },
                        // )
                        .setFooter({ text: "Corebot" })
                        .setTimestamp();
                    if (body1header && body1text) {
                        embed.addFields(
                            {
                                name: body1header,
                                value: body1text,
                            },
                        );
                    }
                    if (body2header && body2text) {
                        embed.addFields(
                            {
                                name: body2header,
                                value: body2text,
                            },
                        );
                    }

                    selectedChannels.forEach(channel => {
                        channel.send({ embeds: [embed] });
                    });
                    await interaction.followUp({ content: 'Messages sent', ephemeral: true });
                }


                // delete the select menu
                // interaction.fetchReply().then(m => m.delete());
            })

            .catch(() => undefined)
            // delete the select menu after everything is done
            .then(() => interaction.fetchReply().then(m => m.delete()));


    },

    // ------------------------------------------------------------------------------
};