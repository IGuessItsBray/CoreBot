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
const { setAvatar, setTags, getMemberByID } = require("../../db/dbProxy");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "searchmembers",
  description: "find a specific member",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "member",
      description: "find one of your members or type in a direct ID",
      type: OPTION.STRING,
      required: true,
      autocomplete: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const _id = interaction.options.getString("member");
    const member = await getMemberByID(_id);
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
        { name: "Tags", value: `${member.tags ?? undefined}`, inline: true }
      )
      .setFooter({ text: `ID: ${member._id} | User: ${member.owner}` })
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  },

  // ------------------------------------------------------------------------------
};
