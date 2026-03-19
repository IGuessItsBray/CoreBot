const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const User = require("../../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Adds a warning to a user's profile.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName("target").setDescription("The user to warn").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the warning").setRequired(true)),

  async execute(interaction, container) {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    const guildId = interaction.guild.id;
    const logging = container.get("logging");

    try {
      // Find or Create the user profile and push the new warning
      const profile = await User.findOneAndUpdate(
        { guildId, userId: target.id },
        { 
          username: target.tag,
          $push: { 
            warnings: { 
              reason, 
              moderatorId: interaction.user.id 
            } 
          },
          $set: { lastSeen: new Date() }
        },
        { upsert: true, new: true }
      );

      const warnCount = profile.warnings.length;

      await interaction.reply({
        content: `⚠️ **${target.tag}** has been warned. (Total Warnings: ${warnCount})`,
        flags: [MessageFlags.Ephemeral]
      });

      // Log it to the Audit Log
      await logging.send(guildId, {
        title: "⚠️ User Warned",
        color: 0xFFFF00,
        fields: [
          { name: "Target", value: `${target.tag} (${target.id})`, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Reason", value: reason },
          { name: "Total Warnings", value: warnCount.toString(), inline: true }
        ]
      });

    } catch (err) {
      container.get("logger").error(err);
      await interaction.reply({ content: "❌ Failed to save warning to database.", flags: [MessageFlags.Ephemeral] });
    }
  }
};