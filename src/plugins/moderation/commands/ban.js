const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const User = require("../../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server by mention or ID.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(opt => opt.setName("target").setDescription("The User ID or @Mention").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the ban"))
    .addIntegerOption(opt => opt.setName("days").setDescription("Days of messages to delete (0-7)").setMinValue(0).setMaxValue(7)),

  async execute(interaction, container) {
    const targetInput = interaction.options.getString("target").replace(/[<@!>]/g, "");
    const reason = interaction.options.getString("reason") || "No reason provided.";
    const deleteMessageDays = interaction.options.getInteger("days") || 0;
    const guildId = interaction.guild.id;
    const logging = container.get("logging");

    try {
      // 1. Fetch user to ensure they exist
      const user = await interaction.client.users.fetch(targetInput).catch(() => null);
      if (!user) return interaction.reply({ content: "❌ Invalid User or ID.", flags: [MessageFlags.Ephemeral] });

      // 2. Perform the Ban
      await interaction.guild.members.ban(user.id, { 
        deleteMessageSeconds: deleteMessageDays * 86400, 
        reason 
      });

      // 3. Update Database
      await User.findOneAndUpdate(
        { guildId, userId: user.id },
        { $push: { bans: { reason, moderatorId: interaction.user.id, type: 'BAN' } } },
        { upsert: true }
      );

      await interaction.reply({ content: `🔨 **${user.tag}** has been banned.`, flags: [MessageFlags.Ephemeral] });

      // 4. Log it
      await logging.send(guildId, {
        title: "🔨 Member Banned",
        color: 0xFF0000,
        fields: [
          { name: "Target", value: `${user.tag} (${user.id})`, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Reason", value: reason }
        ]
      });

    } catch (err) {
      container.get("logger").error(err);
      await interaction.reply({ content: "❌ I cannot ban this user (Missing Perms or Hierarchy).", flags: [MessageFlags.Ephemeral] });
    }
  }
};