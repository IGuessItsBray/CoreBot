const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const User = require("../../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Removes a member from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(opt => opt.setName("target").setDescription("The member to kick").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the kick")),

  async execute(interaction, container) {
    const target = interaction.options.getMember("target");
    const reason = interaction.options.getString("reason") || "No reason provided.";
    const guildId = interaction.guild.id;
    const logging = container.get("logging");

    if (!target) {
      return interaction.reply({ content: "❌ That user is no longer in the server.", flags: [MessageFlags.Ephemeral] });
    }

    if (!target.kickable) {
      return interaction.reply({ content: "❌ I cannot kick this user. They may have a higher role than me.", flags: [MessageFlags.Ephemeral] });
    }

    try {
      // 1. Notify the user via DM before kicking (optional but professional)
      try {
        await target.send(`⚠️ You have been kicked from **${interaction.guild.name}**.\n**Reason:** ${reason}`);
      } catch (e) {
        container.get("logger").debug(`Could not DM ${target.id} before kick.`);
      }

      // 2. Perform the Kick
      await target.kick(reason);

      // 3. Update the Database record
      await User.findOneAndUpdate(
        { guildId, userId: target.id },
        { 
          $push: { kicks: { reason, moderatorId: interaction.user.id } }
        },
        { upsert: true }
      );

      // 4. Respond to Moderator
      await interaction.reply({
        content: `👢 **${target.user.tag}** has been kicked.`,
        flags: [MessageFlags.Ephemeral]
      });

      // 5. Send to Logging Service
      await logging.send(guildId, {
        title: "👢 Member Kicked",
        color: 0xFF4500, // Orange-Red
        fields: [
          { name: "Target", value: `${target.user.tag} (${target.id})`, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Reason", value: reason }
        ],
        footer: `Action performed by ${interaction.user.username}`
      });

    } catch (err) {
      container.get("logger").error(err);
      await interaction.reply({ content: "❌ An error occurred while trying to kick the member.", flags: [MessageFlags.Ephemeral] });
    }
  }
};