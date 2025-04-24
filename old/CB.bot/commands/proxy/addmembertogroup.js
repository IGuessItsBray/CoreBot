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
  getGroups,
  getMembers
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
      autocomplete: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const _id = interaction.options.getString("member");
    const member = await getMemberByID(_id);
    const groups = member.groups;
    const newgroup = interaction.options.getString("group");
    console.log(newgroup);
    const x = await addMemberToGroup(_id, [...groups, newgroup]);
    const g = await getGroupByID(newgroup);

    console.log(await getGroupByID(interaction.options.getString("group")));
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
  // Auto Complete
  // ------------------------------------------------------------------------------
  autoComplete: async function (interaction) {
    const owner = interaction.user.id
    const { shard } = require("../../util/vars");
    const focusedOption = interaction.options._hoistedOptions.find(
      ({ focused }) => focused
    );
    const { value: input, name: option } = focusedOption;
    
console.log(input);
console.log(option);
    switch (option) {
      case "member": {
        const members = await getMembers(owner);
        const membersMapped = members
          .map((m) => {
            return {
              name: m.name.slice(0, 30),
              value: m._id,
            };
          })
          .filter((m) =>
            m.name.toLowerCase().includes(input.toLowerCase())
          );
        return await interaction.respond(membersMapped.slice(0, 25));
      }
      case "group": {
        const groups = await getGroups(owner);
        const groupsMapped = groups
          .map((g) => {
            return {
              name: g.name.slice(0, 30),
              value: g._id,
            };
          })
          .filter((m) =>
            m.name.toLowerCase().includes(input.toLowerCase())
          );
          console.log(groupsMapped)
        await interaction.respond(groupsMapped.slice(0, 25));
      }
    }
  },
};
