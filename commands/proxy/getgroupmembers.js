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
  setTags,
  getMemberByID,
  findProxyCount,
  getGroupMembers,
  getGroupByID
} = require("../../db/dbProxy");

const { paginateText } = require("../../util/pageinate");

module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "getgroupmembers",
  description: "find members of a specific group",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "group",
      description: "find members of a group or type in a direct ID",
      type: OPTION.STRING,
      required: true,
      autocomplete: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const _id = interaction.options.getString("group");
    const group = await getGroupByID(_id)
    const members = await getGroupMembers(_id);
    const name = members.map((m) => m.name);
    const id = members.map((m) => m._id);
    console.log(group);
    //Fetch from db
    const bigArray = await getGroupMembers(_id);

    //add this block
    bigArray.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    const size = 20; //number of lines per page
    const arrayOfArrays = []; //array of arrays, each array is one page

    for (let i = 0; i < bigArray.length; i += size) {
      arrayOfArrays.push(bigArray.slice(i, i + size)); //slice the big array into smaller arrays
    }
    //each array within the big array is one page
    const pages = arrayOfArrays.map((a) => {
      //This map defines what one line on one page looks like, join the lines on one page with \n
      return {
        title: `Members of ${group.name}`,
        content: a.map((m) => `\`${m._id}\` ${m.name}`).join("\n"),
        footer: `${members.length} members`,
      };
    });

    //do the pagination
    await paginateText(interaction, pages, false);
  },

  // ------------------------------------------------------------------------------
};
// ------------------------------------------------------------------------------
//This would go outside of the module exports, or you could shove it into genutils
/**
 * @param arr The large array to be split
 * @param num Desired number of elements per array
 * @returns Array of Arrays that are num in length
 */
function split(arr, num) {
  const size = Math.ceil(arr.length / num);
  return Array.from({ length: num }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

