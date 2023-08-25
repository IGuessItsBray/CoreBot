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
  setID,
  getMembers,
  getMemberByID,
  createMember,
  deleteMember,
} = require("../../db/dbProxy");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "setid",
  description: "Allows devs to manually change the ID of a proxy member",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "member",
      description: "The member to change the ID of",
      type: OPTION.STRING,
      required: true,
      autocomplete: true,
    },
    {
      name: "newid",
      description: "The new Member ID",
      type: OPTION.STRING,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const _id = interaction.options.getString("member");
    const newID = interaction.options.getString("newid");
    const member = await getMemberByID(_id);
    console.log(member);
    const owner = member.owner;
    const name = member.name;
    const desc = member.desc;
    const pronouns = member.pronouns;
    const avatar = member.avatar;
    const tags = member.tags;
    const color = member.color;
    const id = newID;
    const newMember = await createMember(
      owner,
      name,
      desc,
      pronouns,
      avatar,
      tags,
      color,
      id
    );
    deleteMember(_id);
    interaction.reply(
      `Changed ID of ${name} from ${_id} to ${id} in collection belonging to <@${owner}>`
    );
  },

  // ------------------------------------------------------------------------------
};
