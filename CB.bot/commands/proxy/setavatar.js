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
const FormData = require("form-data");
const axios = require("axios");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
const {
  zipline_password,
  zipline_token_testing,
  zipline_url,
  zipline_token_staff_images,
} = require("../../config.json");
const { setAvatar } = require("../../db/dbProxy");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "setavatar",
  description: "Add an avatar to a member",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "member",
      description: "The member to add an avatar to",
      type: OPTION.STRING,
      required: true,
      autocomplete: true,
    },
    {
      name: "avatar",
      description: "The avatar for your member",
      type: OPTION.ATTACHMENT,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const config = require("../../util/localStorage");
    const _id = interaction.options.getString("member");
    const attachment = interaction.options.getAttachment("avatar");
    if (!isAllowedAttachment(attachment))
      return await interaction.reply({
        content:
          "Invalid attachment type. Attachments must be jpg, png, jpeg or gif file formats.",
        ephemeral,
      });
      await interaction.deferReply({ ephemeral });
    const { _fullResponse, uploadUrl } = await uploadAttachment(attachment.url);
    if (!uploadUrl)
      return await interaction.editReply({
        content:
          "Failed to upload attachment. This could be due to an error with the bot's image CDN or with the discord CDN.",
        ephemeral,
      });
    // add the file to the database, send a message, whatever on success
    /* await interaction.editReply({
      content: `\`\`\`json\n${JSON.stringify(_fullResponse, null, 2)}\n\`\`\``,
      ephemeral,
    }); */
    //await interaction.editReply({ content: uploadUrl, ephemeral });
    const avatar = _fullResponse.files[0]
    const member = await setAvatar(_id, avatar);
    interaction.editReply(`
Successfully set avatar for member \`${member.name}\` - \`${member._id}\`!
${avatar}`);
  },

  // ------------------------------------------------------------------------------
};
// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

function isAllowedAttachment(attachment) {
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  return ALLOWED_TYPES.includes(attachment?.contentType ?? "unknown");
}
async function uploadAttachment(url) {
  const zipine_url = zipline_url;
  const zipline_token = zipline_token_testing;

  let _fullResponse = undefined;
  let uploadUrl = undefined;

  try {
    const { data: imageStream } = await axios.get(url, {
      responseType: "stream",
    });

    // create a form with the file
    const form = new FormData();
    form.append("file", imageStream, { filename: "image.jpg" });

    // upload the file with axios
    const res = await axios.post(zipine_url, form, {
      headers: {
        Authorization: zipline_token_testing,
        ...form.getHeaders(),
      },
    });

    _fullResponse = res.data;
    uploadUrl = res.data.files[0];
  } catch (e) {
    console.error(e?.message);
  }

  return { _fullResponse, uploadUrl };
}
