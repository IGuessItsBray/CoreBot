const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const ms = require("ms"); // You might need to npm install ms

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Temporarily mutes a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName("target").setDescription("The user to mute").setRequired(true))
    .addStringOption(opt => opt.setName("duration").setDescription("Length (e.g. 10m, 1h, 1d)").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Why are they being muted?")),

  async execute(interaction, container) {
    const target = interaction.options.getMember("target");
    const duration = interaction.options.getString("duration");
    const reason = interaction.options.getString("reason") || "No reason provided.";
    const logging = container.get("logging");

    // Convert string (10m) to milliseconds
    const timeMs = ms(duration);
    if (!timeMs || timeMs > 2419200000) { // Discord max is 28 days
      return interaction.reply({ content: "❌ Invalid duration. Use 10m, 1h, etc. (Max 28 days)", flags: [MessageFlags.Ephemeral] });
    }

    try {
      await target.timeout(timeMs, reason);

      await interaction.reply({ content: `✅ **${target.user.tag}** has been timed out for ${duration}.`, flags: [MessageFlags.Ephemeral] });

      // Send to the log!
      await logging.send(interaction.guild.id, {
        title: "🤐 Member Timed Out",
        color: 0xFFA500,
        fields: [
          { name: "Target", value: `${target.user.tag}`, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Duration", value: duration, inline: true },
          { name: "Reason", value: reason }
        ]
      });
    } catch (err) {
      container.get("logger").error(err);
      await interaction.reply({ content: "❌ I cannot timeout this user (Hierarchy issue or missing perms).", flags: [MessageFlags.Ephemeral] });
    }
  }
};