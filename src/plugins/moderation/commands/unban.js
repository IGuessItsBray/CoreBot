const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const User = require("../../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user by their ID.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(opt => opt.setName("id").setDescription("The raw User ID to unban").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the unban")),

  async execute(interaction, container) {
    const userId = interaction.options.getString("id");
    const reason = interaction.options.getString("reason") || "No reason provided.";
    const guildId = interaction.guild.id;
    const logging = container.get("logging");

    try {
      await interaction.guild.members.unban(userId, reason);

      // Update Database
      await User.findOneAndUpdate(
        { guildId, userId },
        { $push: { bans: { reason, moderatorId: interaction.user.id, type: 'UNBAN' } } },
        { upsert: true }
      );

      await interaction.reply({ content: `🔓 User \`${userId}\` has been unbanned.`, flags: [MessageFlags.Ephemeral] });

      // Log it
      await logging.send(guildId, {
        title: "🔓 Member Unbanned",
        color: 0x00FF00,
        fields: [
          { name: "User ID", value: userId, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Reason", value: reason }
        ]
      });

    } catch (err) {
      await interaction.reply({ content: "❌ Failed to unban. Either the ID is invalid or they aren't banned.", flags: [MessageFlags.Ephemeral] });
    }
  }
};