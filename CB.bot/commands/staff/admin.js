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
  Shard,
} = require("discord.js");
const FormData = require("form-data");
const axios = require("axios");
const { OPTION } = require("../../util/enum").Types;
const { paginateText } = require("../../util/pageinate");
const cmdUtils = require("../../util/commandUtils");
const { REST } = require("@discordjs/rest");
const {
  zipline_password,
  zipline_token,
  zipline_url,
  zipline_token_staff_images,
} = require("../../config.json");

// ------------------------------------------------------------------------------
// List servers
// ------------------------------------------------------------------------------

const listServers = {
  options: {
    name: "listservers",
    description: "List all servers the bot is present in, with an invite",
    type: OPTION.SUB_COMMAND,
    options: [],
  },

  execute: async function (interaction) {
    const { shard } = require("../../util/vars");
    const broadcast = await shard.broadcastEval(
      async (client) => {
        const {
          PermissionFlagsBits: p,
          ChannelType: t,
        } = require("discord.js");
        return Promise.all(
          client.guilds.cache.map(async (guild) => {
            const me = guild.members.me;
            const name = guild.name;
            const id = guild.id;

            const channel = guild.channels.cache
              .filter((c) =>
                [t.GuildText, t.GuildAnnouncement].includes(c.type)
              )
              .filter((c) => c.permissionsFor(me).has(p.CreateInstantInvite))
              .find((c) =>
                c.permissionsFor(guild.roles.everyone).has(p.ViewChannel)
              );
            const invite = channel
              ? await channel.createInvite({ maxUses: 1, maxAge: 300 })
              : undefined;

            return { name, id, invite: invite.url };
          })
        );
      },
      { context: {} }
    );
    const allGuildsAndInvites = [].concat(...broadcast);

    const size = 10; //number of lines per page
    const arrayOfArrays = []; //array of arrays, each array is one page
    const title = "Corebot Servers";
    const footer = "Admin use only.";

    for (let i = 0; i < allGuildsAndInvites.length; i += size) {
      arrayOfArrays.push(allGuildsAndInvites.slice(i, i + size)); //slice the big array into smaller arrays
    }
    const pages = arrayOfArrays.map((a) => {
      return {
        title,
        content: a
          .map((s) => {
            return s.invite
              ? `[${s.name}](${s.invite}) - \`${s.id}\``
              : `${s.name} - \`${s.id}\``;
          })
          .join("\n"),
        footer,
      };
    });
    await paginateText(interaction, pages, false);
  },
};

// ------------------------------------------------------------------------------
// Edit about me
// ------------------------------------------------------------------------------

const editAboutMe = {
  options: {
    name: "editaboutme",
    description: "Edit the bot's about me through the API",
    type: OPTION.SUB_COMMAND,
    options: [],
  },

  execute: async function (interaction) {
    const modal = new ModalBuilder()
      .setCustomId("aboutme")
      .setTitle("Edit the bot about me");
    const abm = new TextInputBuilder()
      .setCustomId("abm")
      .setLabel("About me")
      .setStyle("Paragraph")
      .setPlaceholder("Enter your updated about me here")
      .setRequired(true);
    const row = new ActionRowBuilder().addComponents(abm);
    modal.addComponents(row);
    await interaction.showModal(modal);
    interaction.client.on(Events.InteractionCreate, async (interaction) => {
      if (
        interaction.isModalSubmit() &&
        interaction.customId.startsWith("aboutme")
      ) {
        const user = interaction.user.id;
        const aboutMe = interaction.fields.getTextInputValue("abm");

        const { REST } = require("@discordjs/rest");
        const { Routes } = require("discord-api-types/v10");
        const { token: token } = require("../../util/localStorage").config;
        const rest = new REST({ version: "9" }).setToken(token);

        rest
          .patch(Routes.currentApplication(), {
            body: {
              description: aboutMe,
            },
          })
          .catch(console.error);
        await interaction.reply(`Bot about me set to:
${aboutMe}`);
      }
    });
  },
};

// ------------------------------------------------------------------------------
// Mass message
// ------------------------------------------------------------------------------

const massMessage = {
  options: {
    name: "mmessage",
    description: "Send a message to all servers the bot is present in",
    type: OPTION.SUB_COMMAND,
    options: [
      {
        name: "message",
        description: "Message to broadcast to ALL guilds.",
        type: OPTION.STRING,
        required: true,
      },
      {
        name: "really",
        description: "Are you sure?",
        type: OPTION.BOOLEAN,
        required: false,
      },
      {
        name: "really2",
        description: "Are you TOTALLY sure?",
        type: OPTION.BOOLEAN,
        required: false,
      },
    ],
  },

  execute: async function (interaction, ephemeral = true) {
    const { shard } = require("../../util/vars");

    const message = interaction.options.getString("message");
    const check1 = interaction.options.getBoolean("really");
    const check2 = interaction.options.getBoolean("really2");

    if (!check1 || !check2 || !message)
      return await interaction.editReply({ content: "Message not sent." });
    const broadcast = shard.broadcastEval(
      async (client, { message, sender }) => {
        const { PermissionFlagsBits: p } = require("discord.js");
        const shardResult = client.guilds.cache.map(async (guild) => {
          const me = guild.members.me;

          // const systemChannel = guild.systemChannel;
          const safetyChannel = guild.safetyAlertsChannel;
          const updatesChannel = guild.publicUpdatesChannel;
          const widgetChannel = guild.widgetChannel;
          const ownerChannel = await (await guild.fetchOwner()).createDM();

          const signature = `\n-# This message was sent as an important broadcast to all servers, for the moderators of **${guild.name}** by CoreBot administrator ${sender}.\n-# Questions? Visit us at [CoreBot](https://discord.gg/PW7VzKtGSn)`;
          const allowedMentions = { parse: [] };

          let channelToUse = undefined;
          // if 		(systemChannel 	&& systemChannel?.viewable 	&& systemChannel.permissionsFor(me).has(p.SendMessages)) channelToUse = systemChannel;
          if (
            safetyChannel &&
            safetyChannel?.viewable &&
            safetyChannel.permissionsFor(me).has(p.SendMessages)
          )
            channelToUse = safetyChannel;
          else if (
            updatesChannel &&
            updatesChannel?.viewable &&
            updatesChannel.permissionsFor(me).has(p.SendMessages)
          )
            channelToUse = updatesChannel;
          else if (
            widgetChannel &&
            widgetChannel?.viewable &&
            widgetChannel.permissionsFor(me).has(p.SendMessages)
          )
            channelToUse = widgetChannel;
          else channelToUse = ownerChannel;

          try {
            await channelToUse.send({
              content: `${message.replaceAll("\\n", "\n")}${signature}`,
              allowedMentions,
            });
            return { guild: { id: guild.id, name: guild.name }, success: true };
          } catch (e) {
            return {
              guild: { id: guild.id, name: guild.name },
              success: false,
              error: e,
            };
          }
        });
        return await Promise.all(shardResult);
      },
      { context: { message, sender: interaction.user.tag } }
    );

    const result = [].concat(...(await broadcast));

    await interaction.editReply({
      content: `Message:\n\`\`\`md\n${message.replaceAll(
        "\\n",
        "\n"
      )}\`\`\`\nSent: \`${
        result.filter((r) => r.success).length
      }\`\nErrors: \`${result.filter((r) => !r.success).length}\``,
    });
  },
};

// ------------------------------------------------------------------------------
// Remove user data
// ------------------------------------------------------------------------------

const removeUSerData = {
  options: {
    name: "ruserdata",
    description: "Remove data on a specified user",
    type: OPTION.SUB_COMMAND,
    options: [],
  },

  execute: async function (interaction) {
    await interaction.reply();
  },
};

// ------------------------------------------------------------------------------
// Reset server config
// ------------------------------------------------------------------------------

const resetServerConfig = {
  options: {
    name: "rserverconfig",
    description: "Reset the config of a specified server",
    type: OPTION.SUB_COMMAND,
    options: [],
  },

  execute: async function (interaction) {
    await interaction.reply();
  },
};

// ------------------------------------------------------------------------------
// Leave server
// ------------------------------------------------------------------------------

const leaveServer = {
  options: {
    name: "leaveserver",
    description: "Force the bot to leave a specified server",
    type: OPTION.SUB_COMMAND,
    options: [
      {
        name: "server",
        description: "ID of the server to leave",
        type: OPTION.STRING,
        required: true,
      },
    ],
  },

  execute: async function (interaction, ephemeral = true) {
    const { shard } = require("../../util/vars");
    const guildOption = interaction.options.getString("server");
    const fetchedGuild = []
      .concat(...(await shard.fetchClientValues("guilds.cache")))
      .find((g) => g.id === guildOption);
    const broadcast = await shard.broadcastEval(
      async (client, { guildId }) => {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return undefined;
        return await guild.leave();
      },
      { context: { guildId: fetchedGuild.id } }
    );
    const result = (await broadcast).find((res) => res);
    const content = result
      ? `Successfully left ${fetchedGuild.name} (\`${fetchedGuild.id}\`)`
      : `Could not leave ${
          fetchedGuild?.name ?? guildOption
        }. Guild was not found.`;
    await interaction.editReply({ content, ephemeral });
  },
};

// ------------------------------------------------------------------------------
// Remove user data
// ------------------------------------------------------------------------------

const uploadPhoto = {
  options: {
    name: "uploadphoto",
    description: "Upload a photo to the zipline staff image share",
    type: OPTION.SUB_COMMAND,
    options: [
      {
        name: "photo",
        description: "The avatar to upload to the server",
        type: OPTION.ATTACHMENT,
        required: true,
      },
    ],
  },

  execute: async function (interaction, ephemeral = true) {
    const client = interaction.client;

    const attachment = interaction.options.getAttachment("photo");
    if (!isAllowedAttachment(attachment))
      return await interaction.editReply({
        content: "Invalid attachment type. Attachments must be jpg, png, jpeg or gif file formats.",
        ephemeral,
      });
    const { _fullResponse, uploadUrl } = await uploadAttachment(attachment.url);
    if (!uploadUrl)
      return await interaction.editReply({
        content: "Failed to upload attachment. This could be due to an error with the bot's image CDN or with the discord CDN.",
        ephemeral,
      });
    // add the file to the database, send a message, whatever on success
    await interaction.editReply({
      content: `\`\`\`json\n${JSON.stringify(_fullResponse, null, 2)}\n\`\`\``,
      ephemeral,
    });
    await interaction.followUp({ content: uploadUrl, ephemeral });
  },
};

// ------------------------------------------------------------------------------
// Command Execution
// ------------------------------------------------------------------------------

module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "admin",
  description: "Utilize admin utilites",
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    listServers.options,
    editAboutMe.options,
    leaveServer.options,
    resetServerConfig.options,
    removeUSerData.options,
    massMessage.options,
    uploadPhoto.options,
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, ephemeral = true) {
    //await interaction.deferReply({ ephemeral });

    switch (interaction.options.getSubcommand()) {
      case listServers.options.name:
        listServers.execute(interaction);
        break;
      case editAboutMe.options.name:
        //await interaction.deferReply({ ephemeral });
        editAboutMe.execute(interaction);
        break;
      case leaveServer.options.name:
        await interaction.deferReply({ ephemeral });
        leaveServer.execute(interaction);
        break;
      case resetServerConfig.options.name:
        await interaction.deferReply({ ephemeral });
        resetServerConfig.execute(interaction);
        break;
      case removeUSerData.options.name:
        await interaction.deferReply({ ephemeral });
        removeUSerData.execute(interaction);
        break;
      case massMessage.options.name:
        await interaction.deferReply({ ephemeral });
        massMessage.execute(interaction);
        break;
      case uploadPhoto.options.name:
        await interaction.deferReply({ ephemeral });
        uploadPhoto.execute(interaction);
        break;
    }
  },
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
  const zipline_token = zipline_token_staff_images;

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
        Authorization: zipline_token_staff_images,
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
