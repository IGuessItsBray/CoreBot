const { time } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { getServerSettings, getUserMMChannel, setUserMMChannel } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'newmmthread',
    description: 'Create a new modmail thread with the user',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The person to open a thread with',
            type: OPTION.USER,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for opening the thread',
            type: OPTION.STRING,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const member = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason');
        const guildId = interaction.guild.id
        const user = member.id
        const staffUser = interaction.member
        const timestamp = interaction.createdTimestamp
        const ss = await getServerSettings(guildId)
        const mmc = ss.modMailChannel
        const channel = await interaction.guild.channels.fetch(mmc)
        const mmThread = await channel.threads.create({
            name: `${member.user.tag}'s Thread`,
            autoArchiveDuration: 60,
            type: 'GUILD_PRIVATE_THREAD',
            reason: `MM thread for ${member.tag}`,
        })
        console.log(`Created thread: ${mmThread.name}`);
        interaction.reply(`Thread created in <#${mmc}> for ${member} - <#${mmThread.id}>`)
        mmThread.send(`Modmail thread opened by ${staffUser} with reason:
        \`\`\`${reason}\`\`\`
        `)
        const _id = interaction.guild.id
        const userId = member.id
        const name = interaction.guild.name
        const channelId = mmThread.id
        await setUserMMChannel(_id, userId, name, channelId, reason)
        const thread = channel.threads.cache.find(x => x.name === mmThread.name);
        await thread.members.add(member);
        thread.permissionOverwrites.create(thread.guild.user.me, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
        });

        //member.send(`A modmail thread was opened in \`${name}\` by ${staffUser}
        //Please begin any replies with @coreBot reply *your message*`)
    },

    // ------------------------------------------------------------------------------
};