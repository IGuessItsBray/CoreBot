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
} = require("../../db/dbProxy");
const axios = require("axios");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "import",
  description: "Import your system data from pluralkit or tbox",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "file",
      description: "The .json file from Tbox or PK",
      type: OPTION.ATTACHMENT,
      required: false,
    },
    {
      name: "url",
      description: "The link you got from tbox or PK",
      type: OPTION.STRING,
      required: false,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    await interaction.deferReply({ ephemeral: true });
    const owner = interaction.user.id;
    const attachment = interaction.options.getAttachment("file");
    const link = interaction.options.getString("url");
    if (attachment !== null) {
      // check if the attachment is a json file
      if (!attachment.contentType.startsWith("application/json"))
        return await interaction.reply({
          content: "Invalid file type",
          ephemeral: true,
        });

      // get the json file from the attachment
      const { data: system } = await axios.get(attachment.url);

      // get all members from the database
      const existing = await getMembers(owner);

      //loop through the imported system.members, if the member's name is already existing in
      // const existing, then skip it, otherwise add it to the database
      system.members.forEach(async (member) => {
        if (existing.find((m) => m.name === member.name)) return;
        const name = member.name;
        const desc = member.description;
        const pronouns = member.pronouns;
        const avatar = member.avatar_url;
        const tags = member.proxy_tags
          .map((x) => x.prefix)
          .find((innerArr) => innerArr?.length > 0);
        const color = member.color;
        const newmember = await createMember(
          owner,
          name,
          desc,
          pronouns,
          avatar,
          tags,
          color
        );
      });
      interaction.editReply({
        content: "Collection file import successful!",
        ephemeral: true,
      });
    } else if (attachment === null) {
      // get the json file from the attachment
      const { data: system } = await axios.get(link);

      // get all members from the database
      const existing = await getMembers(owner);

      //loop through the imported system.members, if the member's name is already existing in
      // const existing, then skip it, otherwise add it to the database
      system.members.forEach(async (member) => {
        if (existing.find((m) => m.name === member.name)) return;
        const name = member.name;
        const desc = member.description;
        const pronouns = member.pronouns;
        const avatar = member.avatar_url;
        const tags = member.proxy_tags
          .map((x) => x.prefix)
          .find((innerArr) => innerArr?.length > 0);
        const color = member.color;
        const newmember = await createMember(
          owner,
          name,
          desc,
          pronouns,
          avatar,
          tags,
          color
        );
      });
      interaction.editReply({
        content: "Collection file import successful!",
        ephemeral: true,
      });
    }
  },

  // ------------------------------------------------------------------------------
};
