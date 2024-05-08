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
  addMemberToGroup,
  getMemberByID,
  getGroupByID,
} = require("../../db/dbProxy");
const newgroup = require("./newgroup");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "addtogroup",
  description: "Add a member to a group",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "member",
      description: "The member to add to a group",
      type: OPTION.STRING,
      required: true,
      autocomplete: true,
    },
    {
      name: "group",
      description: "The group to add the member to",
      type: OPTION.STRING,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const _id = interaction.options.getString("member");
    const member = await getMemberByID(_id);
    const groups = member.groups
    const newgroup = interaction.options.getString("group");
    const x = await addMemberToGroup(_id, [...groups, newgroup]);
    const g = await getGroupByID(newgroup)
    const embed = new EmbedBuilder()
      .setColor("#3a32a8")
      .setAuthor({ name: "Member added to group!" })
      .setDescription(
        `
Name: ${member.name}
Group: ${g.name}`
      )
      .setFooter({ text: `CoreBot` })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },

  // ------------------------------------------------------------------------------
};
