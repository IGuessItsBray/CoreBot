const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const User = require("../../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletewarn")
    .setDescription("Removes a specific warning from a user's history.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(opt => opt.setName("target").setDescription("The user").setRequired(true))
    .addStringOption(opt => opt.setName("warn_id").setDescription("The ID of the warning to remove").setRequired(true)),

  async execute(interaction, container) {
    const target = interaction.options.getUser("target");
    const warnId = interaction.options.getString("warn_id");
    const guildId = interaction.guild.id;
    const logging = container.get("logging");

    try {
      // Use MongoDB $pull to remove the warning with the matching _id from the array
      const result = await User.findOneAndUpdate(
        { guildId, userId: target.id },
        { 
          $pull: { warnings: { _id: warnId } } 
        },
        { new: true }
      );

      if (!result) {
        return interaction.reply({ 
          content: "❌ Could not find a profile for that user.", 
          flags: [MessageFlags.Ephemeral] 
        });
      }

      await interaction.reply({
        content: `✅ Removed warning \`${warnId}\` from **${target.tag}**.`,
        flags: [MessageFlags.Ephemeral]
      });

      // Log the deletion to the Audit Log
      await logging.send(guildId, {
        title: "🗑️ Warning Deleted",
        color: 0x3498DB, // Blue
        fields: [
          { name: "Target", value: `${target.tag}`, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Warning ID", value: warnId }
        ]
      });

    } catch (err) {
      container.get("logger").error(err);
      await interaction.reply({ 
        content: "❌ Failed to delete warning. Make sure the ID is correct.", 
        flags: [MessageFlags.Ephemeral] 
      });
    }
  }
};