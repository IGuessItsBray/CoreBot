const { SlashCommandBuilder } = require("discord.js");
const Guild = require("../../../models/Guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("authenticate")
    .setDescription("Enter the server password to unlock channels.")
    .addStringOption(option =>
      option.setName("password")
        .setDescription("The entry password")
        .setRequired(true)
    ),

  /**
   * Executes the authenticate command.
   * Validates input against the Guild config and assigns the configured role.
   */
  async execute(interaction, container) {
    const inputPassword = interaction.options.getString("password");
    const guildId = interaction.guild.id;
    const logger = container.get("logger");

    try {
      // 1. Fetch the guild configuration from MongoDB
      const guildConfig = await Guild.findOne({ guildId });

      // 2. Safety Check: Ensure the access system is configured
      if (!guildConfig || !guildConfig.access || !guildConfig.access.enabled) {
        return interaction.reply({
          content: "❌ The authentication system is not currently active for this server.",
          ephemeral: true
        });
      }

      const { password, roleId } = guildConfig.access;

      // 3. Password Validation
      if (inputPassword !== password) {
        return interaction.reply({
          content: "❌ Incorrect password. Access denied.",
          ephemeral: true
        });
      }

      // 4. Role Resolution
      const role = interaction.guild.roles.cache.get(roleId);

      if (!role) {
        logger.error(`Access Plugin: Role ID ${roleId} not found in guild ${guildId}`);
        return interaction.reply({
          content: "❌ Configuration Error: The entry role was not found. Please notify staff.",
          ephemeral: true
        });
      }

      // 5. Grant the role to the member
      await interaction.member.roles.add(role);

      // 6. Success Feedback
      await interaction.reply({
        content: `✅ **Success!** You have been granted the **${role.name}** role.`,
        ephemeral: true
      });

      logger.info(`Access: User ${interaction.user.id} successfully authenticated in guild ${guildId}`);

    } catch (err) {
      logger.error(err, `Access Plugin: Failed to authenticate user ${interaction.user.id}`);
      
      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ An error occurred during authentication. Check bot permissions.",
          ephemeral: true
        });
      }
    }
  }
};