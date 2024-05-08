const { time } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events,
  PermissionsBitField,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
const {
  setAvatar,
  createMember,
  setTags,
  setColor,
  getMembers,
  findOneMessage,
  getMemberByID,
  findProxyCount,
} = require("../../db/dbProxy");
const axios = require("axios");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "msglookup",
  description: "Lookup a message within the bot",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "link",
      description: "The link to the message",
      type: OPTION.STRING,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const messageLink = interaction.options.getString("link");
    const msg = await findOneMessage(messageLink);
    if (!msg) {
      interaction.reply({content: "Message not proxied or not saved in database!", ephemeral: true});
    }
    if (msg) {
      const content = msg.content;
      const msgID = msg.messageId;
      const _id = msg.proxy;
      const member = await getMemberByID(_id);
      const { characters, messages } = await findProxyCount(_id);
      const embed = new EmbedBuilder()
        .setColor(member.color ?? "#2f3136")
        .setAuthor({
          name: `${member.name}`,
          iconURL: `${member.avatar ?? null}`,
        })
        .setThumbnail(`${member.avatar ?? null}`)
        .setDescription(member.desc)
        .addFields(
          { name: "\u200B", value: "\u200B" },
          {
            name: "Pronouns",
            value: `${member.pronouns ?? undefined}`,
            inline: true,
          },
          { name: "Tags", value: `${member.tags ?? undefined}`, inline: true },
          { name: `Characters`, value: `${characters}`, inline: true },
          { name: `Messages`, value: `${messages}`, inline: true }
        )
        .setFooter({ text: `ID: ${member._id} | User: ${member.owner}` })
        .setTimestamp();
      const embed2 = new EmbedBuilder()
        .setColor(member.color ?? "#2f3136")
        .setAuthor({
          name: `Message`,
          iconURL: null,
        })
        .setThumbnail(null)
        .setDescription(null)
        .addFields(
          { name: "\u200B", value: "\u200B" },
          {
            name: `${member.name} said:`,
            value: `\`\`\`${content}\`\`\`
          In: <#${msg.channel}>
          [View the message](${msg.messageLink})`,

            inline: true,
          }
        )
        .setFooter({
          text: `ID: ${member._id} | User: ${member.owner}`,
        })
        .setTimestamp();
      interaction.reply({ embeds: [embed, embed2], ephemeral: true });
    }
  },

  // ------------------------------------------------------------------------------
};
