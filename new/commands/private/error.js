const { OPTION } = require('../../util/enum');
const { uploadGuildIcons, deleteGuildIcons, modalCollector } = require('../../util/genUtils');
const { PermissionFlagsBits, AttachmentBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, escapeCodeBlock } = require('discord.js');
const { getException, togglePersist, updateNote } = require('../../db/dbExceptions');
const moment = require('moment');

module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'error',
    description: 'Support Exception Processing',
    enabled: true,
    permissions: [PermissionFlagsBits.Administrator],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'identifier',
            type: OPTION.STRING,
            description: 'Exception Identifier',
            autocomplete: true,
            required: true,
        },
        {
            name: 'action',
            type: OPTION.STRING,
            description: 'Action to take on the exception',
            required: false,
            choices: [
                {
                    name: 'Toggle Persist',
                    value: 'persist',
                },
                {
                    name: 'Add Note',
                    value: 'note',
                },
                {
                    name: 'Include File',
                    value: 'file',
                },
            ],
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const { shard } = require('../../util/vars');

        const identifier = interaction.options.getString('identifier');
        const error = await getException(identifier);
        if (!error) return await interaction.reply({ content: 'Exception not found.', ephemeral });

        const action = interaction.options.getString('action');
        switch (action) {
            case 'persist': {
                const exception = await togglePersist(identifier);
                const date = new Date(exception.time.getTime() + 7 * 24 * 60 * 60 * 1000);
                const timestamp = `<t:${Math.floor(date.getTime() / 1000)}:R>`;
                await interaction.reply({ content: `Exception \`${identifier}\` ${exception.persist ? 'is flagged to never expire' : `will expire ${timestamp}`}.`, ephemeral: true });
            } return;
            case 'note': {
                const modal = new ModalBuilder()
                    .setTitle(`${error.identifier} - Notes`)
                    .setCustomId('updateNote')
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('dummy')
                                    .setLabel('Existing Notes')
                                    .setPlaceholder(error.note ?? 'No Notes Yet')
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setMinLength(0)
                                    .setMaxLength(1)
                                    .setRequired(false),
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('notes')
                                    .setLabel('Add Notes')
                                    .setPlaceholder('Enter notes here')
                                    .setMaxLength(255)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true),
                            ),
                    );
                const modalInteraction = await modalCollector(interaction, modal);
                if (!modalInteraction) return;
                const existingNote = error.note ?? '';
                const noteText = modalInteraction.fields.getTextInputValue('notes');
                const date = new Date().toLocaleDateString('en-US');
                const newNote = existingNote + `\n[${interaction.user.tag} - ${date}]\n${noteText}`;
                if (noteText !== '') await updateNote(identifier, newNote);
                await modalInteraction.reply({ content: `Exception \`${identifier}\` notes have been updated.`, ephemeral: true });
            } return;
        };

        const data = JSON.stringify(error ?? [], null, 2);
        const attachment = new AttachmentBuilder(Buffer.from(data),
            {
                name: `${error.identifier}-${new Date().getTime()}.json`,
            });

        const { stack } = error.exception;

        // Fetch the name of the guild using fetchclientvalues
        const guilds = [].concat(...await shard.fetchClientValues('guilds.cache'));
        const guild = guilds.find(g => g.id === error.guild);

        // Fetch the name of the channel using fetchclientvalues
        const channels = [].concat(...await shard.fetchClientValues('channels.cache'));
        const channel = channels.find(c => c.id === error.channel);

        // Get the user object
        const user = error.user ? await interaction.client.users.fetch(error.user) : undefined;

        // Format the time as a Discord timestamp
        const timestamp = `<t:${Math.floor(error.time / 1000)}:R>`;
        const expiration = new Date(error.time.getTime() + 7 * 24 * 60 * 60 * 1000);
        const expireTimestamp = `<t:${Math.floor(expiration.getTime() / 1000)}:R>`;

        // Include the file if requested or if there is no stack
        const includeFile = interaction.options.getString('action') === 'file' || !stack;

        try {
            const guildIcons = await uploadGuildIcons(interaction, [guild]);
            const icon = guildIcons.find(i => i.guild === guild.id).emoji;
            await interaction.reply({
                content:
                    `## Error Report \`${identifier}\` ${timestamp}`
                    + `\n**Guild**: [${icon}${guild.name} \`${guild.id}\`](https://discord.com/channels/${guild.id})`
                    + `${channel ? `\n**Channel**: ${channel.name} \`${channel.id}\`` : ''}`
                    + `${user ? `\n**User**: ${user.username} <@${user.id}> \`${user.id}\`` : ''}`
                    + `\n**Expires**: ${error.persist ? 'never' : `${expireTimestamp}`}`
                    + `${error.note ? `\n\`\`\`\n${escapeCodeBlock(error.note)}\`\`\`` : '\n'}`
                    + `${error.message ? `\n**${error.message}**` : ''}`
                    + `\nHappened while running \`${error.interaction}\``
                    + `${stack ? `\n\`\`\`\n${stack}\n\`\`\`` : ''}`,
                files: includeFile ? [attachment] : [],
                allowedMentions: { parse: [] },
                ephemeral,
            });
        }
        finally { await deleteGuildIcons(interaction); }

    },

    // ------------------------------------------------------------------------------

    autoComplete: async function (interaction) {
        const focusedOption = interaction.options._hoistedOptions.find(({ focused }) => focused);
        const { value: input, name: option } = focusedOption;
        switch (option) {
            case 'identifier': {
                const exceptions = await getException();
                const options = exceptions
                    .map(e => {
                        const attributes = [];
                        if (e.persist) attributes.push('⚑');
                        if (e.note) attributes.push('✎');
                        return {
                            name: `${attributes?.length > 0 ? `[${attributes.join(' ')}] ` : ''}${e.identifier}${e.message ? ` - ${e.message}` : ''} - ${moment(e.time).fromNow()}`.slice(0, 100),
                            value: e.identifier,
                            guild: e.guild,
                            channel: e.channel,
                            user: e.user,
                            time: e.time,
                        };
                    }).filter(o =>
                        o.name.toLowerCase().includes(input?.toLowerCase())
                        || o.value?.toLowerCase().includes(input?.toLowerCase())
                        || o.guild?.toLowerCase().includes(input?.toLowerCase())
                        || o.channel?.toLowerCase().includes(input?.toLowerCase())
                        || o.user?.toLowerCase().includes(input?.toLowerCase()),
                    ).sort((a, b) => a.name.includes('⚑') ? -1 : b.name.includes('⚑') ? 1 : a.name.includes('✎') ? -1 : b.name.includes('✎') ? 1 : b.time - a.time);
                return await interaction.respond(options.slice(0, 25));
            }
        }
    },
};