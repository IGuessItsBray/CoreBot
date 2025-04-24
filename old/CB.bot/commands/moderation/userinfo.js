const {
  PermissionFlagsBits,
  ButtonStyle,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
const {
  findMessageLog,
  findUserCount,
  getPunishments,
} = require("../../db/dbAccess");
const { red } = require("colorette");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "userinfo",
  description: "Grab all info for the user.",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "user",
      description: "The user to get the info of",
      type: OPTION.USER,
      required: true,
    },
    {
      name: "type",
      description: "The type of info to generate",
      type: OPTION.STRING,
      choices: [
        { name: "General", value: "gen" },
        { name: "Messages", value: "msg" },
        { name: "Punishments", value: "pun" },
      ],
      required: true,
    },
    {
      name: "ephemeral",
      description: "Is the message ephemeral?",
      type: OPTION.BOOLEAN,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction) {
    const client = interaction.client;

    const selectedUser = interaction.options.getMember("user");
    const ephemeralSetting = interaction.options.getBoolean("ephemeral");
    const type = interaction.options.getString("type");
    const dateStamp2 = Math.floor(
      interaction.client.readyAt.getTime() / 1000.0
    );
    const { characters, messages } = await findUserCount(
      selectedUser.id,
      interaction.guild.id
    );
    const id = selectedUser.id;
    const config = require("../../util/localStorage");
    const homeGuild = await interaction.client.guilds.fetch(config.HOME);
    const { shard } = require("../../util/vars");

    const user = "530845321270657085";
    const broadcast = shard.broadcastEval(
      async (client, { homeGuild, targetUser }) => {
        // Check if the guild is on this shard
        const guild = client.guilds.cache.find(
          (g) => g.id === `955230769939353623`
        );
        if (!guild) return;

        // Check if the member is in the guild
        const member = await guild.members
          .fetch(targetUser)
          .catch(() => undefined);
        // If the member is not in the guild, return an object with the user's ID
        // if other roles are added in the future, they should be added here too
        if (!member) {
          return {
            _name: "Unknown User",
            _id: targetUser,
            dev: false,
            networkAdmin: false,
            tester: false,
          };
        }

        // Check what notable roles the member has
        const hasDevRole = member.roles.cache.has("968346275881832569");
        const hasNetworkAdminRole =
          member.roles.cache.has("990956030290718751");
        const hasTesterRole = member.roles.cache.has("1303379378377326602");

        // Return the member's notable roles & debug info
        return {
          _name: member.user.username,
          _id: member.id,
          dev: hasDevRole,
          networkAdmin: hasNetworkAdminRole,
          tester: hasTesterRole,
        };
      },
      {
        context: {
          homeGuild: `955230769939353623`,
          targetUser: selectedUser.id,
        },
      }
    );
    const result = [].concat(await broadcast).find((obj) => obj);
    // destructuring the result object, each will be true or false
    const { dev, networkAdmin, tester } = result;

    const guild = interaction.guild;
    if (type === "gen") {
      if (id === "950525282434048031") {
        const target = await interaction.guild.members.fetch(selectedUser);
        const flags = target.user?.flags?.toArray() ?? [];
        let flagString = "";
        if (dev == true) {
          flagString += "<:CBDeveloper:1012934220030693376>";
        }
        if (tester == true) {
          flagString += "<:CBBetaTester:1012934218592034887>";
        }
        if (networkAdmin == true) {
          flagString += "<:CBNetDev:1013108642519715980>";
        }
        flags.forEach((elem) => {
          try {
            flagString += `${badges[elem]}`;
          } catch {
            undefined;
          }
        });
        if (flags.length <= 0 || flagString.length <= 0) flagString += "None";
        const Response = new EmbedBuilder()
          .setColor("#00FFFF")
          .setAuthor({
            iconURL: target.user.avatarURL({
              dynamic: true,
              size: 512,
            }),
            name: `${target.user.tag}`,
          })

          .setThumbnail(
            target.user.avatarURL({
              dynamic: true,
              size: 512,
            })
          )
          .addFields(
            { name: `ID`, value: `${target.user.id}` },
            {
              name: `Roles`,
              value: `${
                target.roles.cache
                  .map((r) => r)
                  .join(" ")
                  .replace("@everyone", "") || "none"
              }`,
            },
            {
              name: `Member Since`,
              value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: `Discord User Since`,
              value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            { name: `Badges`, value: `${flagString}` },
            { name: `Characters`, value: `${characters ?? 0}`, inline: true },
            { name: `Messages`, value: `${messages}`, inline: true }
          );

        interaction.reply({
          embeds: [Response],
          ephemeral: ephemeralSetting,
        });
      } else if (id !== "950525282434048031") {
        const target = await interaction.guild.members.fetch(selectedUser);
        const flags = target.user?.flags?.toArray() ?? [];
        let flagString = "";
        if (dev == true) {
          flagString += "<:CBDeveloper:1012934220030693376>";
        }
        if (tester == true) {
          flagString += "<:CBBetaTester:1012934218592034887>";
        }
        if (networkAdmin == true) {
          flagString += "<:CBNetDev:1013108642519715980>";
        }
        flags.forEach((elem) => {
          try {
            flagString += `${badges[elem]}`;
          } catch {
            undefined;
          }
        });
        if (flags.length <= 0 || flagString.length <= 0) flagString += "None";
        const Response = new EmbedBuilder()
          .setColor("#00FFFF")
          .setAuthor({
            iconURL: target.user.avatarURL({
              dynamic: true,
              size: 512,
            }),
            name: `${target.user.tag}`,
          })
          .setThumbnail(
            target.user.avatarURL({
              dynamic: true,
              size: 512,
            })
          )
          .addFields(
            { name: `ID`, value: `${target.user.id}` },
            {
              name: `Roles`,
              value: `${
                target.roles.cache
                  .map((r) => r)
                  .join(" ")
                  .replace("@everyone", "") || "none"
              }`,
            },
            {
              name: `Member Since`,
              value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: `Discord User Since`,
              value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            { name: `Badges`, value: `${flagString}` },
            { name: `Characters`, value: `${characters ?? 0}`, inline: true },
            { name: `Messages`, value: `${messages}`, inline: true }
          );

        interaction.reply({
          embeds: [Response],
          ephemeral: ephemeralSetting,
        });
      }
    } else if (type === "msg") {
      const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setAuthor({
          name: `${selectedUser.user.username}'s messages`,
        })
        .setDescription(`Messages from ${selectedUser}`)
        .setFooter({ text: "Corebot" })
        .setTimestamp();
      const messages = await findMessageLog(
        selectedUser.id,
        interaction.guild.id
      );
      const messagesFormatted = messages.map(
        (m) =>
          `${m.timestamp.toLocaleString()} #${
            interaction.client.channels.resolve(m.channel).name
          }: ${m.content.replaceAll("\n", " ")}`
      );
      const file = new AttachmentBuilder(
        Buffer.from(messagesFormatted.join("\n")),
        { name: `${selectedUser.username} messages.txt` }
      );
      await interaction.reply({
        embeds: [embed],
        files: [file],
        ephemeral: ephemeralSetting,
      });
    } else if (type === "pun") {
      const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setAuthor({
          name: `${selectedUser.user.username}'s punishments`,
        })
        .setDescription(`Punishments for ${selectedUser}`)
        .setFooter({ text: "Corebot" })
        .setTimestamp();
      const punishments = await getPunishments(selectedUser.id);
      const punishmentsFormatted = punishments.map(
        (p) =>
          `Type: ${p.type} 
        Message: ${p.message.replaceAll("\n", " ")}
Action taken by: ${interaction.client.users.resolve(p.staffUser)?.tag ?? id}`
      );
      console.log(punishments);
      const file = new AttachmentBuilder(
        Buffer.from(punishmentsFormatted.join("\n")),
        { name: `${selectedUser.username}s punishments.txt` }
      );
      await interaction.reply({
        embeds: [embed],
        files: [file],
        ephemeral: ephemeralSetting,
      });
    }
  },

  // ------------------------------------------------------------------------------
};
