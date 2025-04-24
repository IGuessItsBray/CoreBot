const fn = require("../util/genUtils");
const { getServerSettings, addPunishments } = require("../db/dbAccess");
const { messageComponentCollector } = require("../util/genUtils")

const {
  CommandInteraction,
  EmbedBuilder,
  Intents,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const report = require("../modules/report");
const { AuditLogEvent, Events } = require("discord.js");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "messageReactionAdd Example",
  type: "messageReactionAdd",

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------
  async execute(reaction, usr) {
    if (reaction.emoji.name === "🚫") {
      if (reaction.partial) {
        try {
          await reaction.fetch();
          //console.log(usr.id)
        } catch (error) {
          console.error(
            "Something went wrong when fetching the message:",
            error
          );
          return;
        }
      }
      const content = reaction.message.content;
      const msgauthor = reaction.message.author;
      const guild = await reaction.message.guild.fetch();
      const userdata = await guild.members.fetch(msgauthor);
      const user = userdata.user.id;
      const reportUser = usr.id;
      const msgchannel = reaction.message.channelId;
      const msgLink = reaction.message.url;
      const message = content;
      const msgId = reaction.message.id;
      const guildId = reaction.message.guildId;
      const rawDB = await getServerSettings(guildId);
      const data = rawDB.reportChannelId;
      const reportChannel = await guild.channels.fetch(data);
      const messageTime = Math.floor(
        reaction.message.createdAt.getTime() / 1000.0
      );
      const timestamp = `<t:${messageTime}:R>, <t:${messageTime}:F>`;
      const embed = new EmbedBuilder()
        .setColor("#E10600")
        .setAuthor({ name: "Report" })
        .setDescription(
          `Report from <@${reportUser}> in <#${msgchannel}>
                Message from: ${msgauthor}
                \`\`\`
${content}
                \`\`\`
                Sent: ${timestamp}
                [Message](<${msgLink}}>)`
        )
        .setFooter({ text: "Corebot" })
        .setTimestamp();
      const actions = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("kick")
          .setLabel("Kick")
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId("ban")
          .setLabel("Ban")
          .setStyle(4),
        new ButtonBuilder()
          .setCustomId("warn")
          .setLabel("Warn")
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId("timeout")
          .setLabel("Timeout")
          .setStyle(4)
      );
      const actions2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("delete")
          .setLabel("Delete Msg")
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId("dismiss")
          .setLabel("Dismiss")
          .setStyle(2)
      );
      const replyMessage = await reportChannel.send({
        embeds: [embed],
        components: [actions, actions2],
        fetchedReply: true,
      });
      const type = "REPORT";
      const staffUser = reportUser;
      addPunishments(guildId, user, type, message, timestamp, staffUser);
      reaction.message.reactions.cache.get("🚫").remove();

      const buttonInteraction = await messageComponentCollector(replyMessage, 0.25);
      if (!buttonInteraction) return await replyMessage.edit({ content: 'Button Interaction Timed Out!', components: [] });
      console.log(buttonInteraction)


      if (buttonInteraction.customId.startsWith("kick")) {
        userdata
          .send(
            `You were kicked from **\`${interaction.guild.name}\`** after being reported. You were kicked by ${buttonInteraction.member}`
          )
          .catch((err) => { });
        userdata.kick("Kicked via report");
        buttonInteraction.update({ content: `${msgauthor} kicked by ${buttonInteraction.member}`, components: [],});
        interaction.message
          .fetch(interaction.message.id)
          .then((msg) => msg.delete());
        const type = "KICK";
        const staffUser = interaction.member.id;
        addPunishments(guildId, user, type, message, timestamp, staffUser);
      }
      if (buttonInteraction.customId.startsWith("ban")) {
        userdata
          .send(
            `You were banned from **\`${buttonInteraction.guild.name}\`** after being reported. You were banned by ${interaction.member}`
          )
          .catch((err) => { });
        userdata.ban("Banned via report");
        buttonInteraction.update({ content: `${msgauthor} banned by ${buttonInteraction.member}`, components: [],});
        interaction.message
          .fetch(interaction.message.id)
          .then((msg) => msg.delete());
        const type = "BAN";
        const staffUser = buttonInteraction.member.id;
        addPunishments(guildId, user, type, message, timestamp, staffUser);
      }
      if (buttonInteraction.customId.startsWith("timeout")
      ) {
        const reason = "Timed out for reported message!";
        userdata
          .send(
            `You were timed out in **\`${buttonInteraction.guild.name}\`** after being reported. You were timed out by ${buttonInteraction.member}. This timeout lasts for 10 minutes!`
          )
          .catch((err) => { });
        userdata.timeout(10 * 60 * 1000, reason);
  buttonInteraction.update({ content: `${msgauthor} timed out by ${buttonInteraction.member}`, components: [],});
        interaction.message
          .fetch(interaction.message.id)
          .then((msg) => msg.delete());
        const type = "TIMEOUT";
        const staffUser = buttonInteraction.member.id;
        addPunishments(guildId, user, type, message, timestamp, staffUser);
      }
      if (buttonInteraction.customId.startsWith("warn")) {
        const reason = "Warning for reported message!";
        const warning = newWarning(guild, user, buttonInteraction.user, reason);
        buttonInteraction.update({content: `Warned ${msgauthor} for ${reason}`, components: [],});
        interaction.message
          .fetch(interaction.message.id)
          .then((msg) => msg.delete());
        const type = "WARN";
        const staffUser = buttonInteraction.member.id;
        addPunishments(guildId, user, type, message, timestamp, staffUser);
      }
      if (
        buttonInteraction.customId.startsWith("delete")
      ) {
        reaction.message
          .fetch(reaction.message.id)
          .then((msg) => msg.delete());
        await buttonInteraction.update({content: `Message deleted by ${buttonInteraction.user}`, components: [],});
        interaction.message
          .fetch(interaction.message.id)
          .then((msg) => msg.delete());
        const type = "MESSAGE DELETE";
        const staffUser = buttonInteraction.member.id;
        addPunishments(guildId, user, type, message, timestamp, staffUser);
      }
      if (buttonInteraction.customId.startsWith("dismiss")
      ) {
        buttonInteraction.update({content: `Report dismissed by ${buttonInteraction.user}`, components: [],});
        buttonInteraction.message
          .fetch(buttonInteraction.message.id)
          .then((msg) => msg.delete());
      }
    };

  },

  // ------------------------------------------------------------------------------
};
