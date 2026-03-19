const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Guild = require("../../../models/Guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setaccess")
    .setDescription("Configure the server password and entry role.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option.setName("password")
        .setDescription("The password users must enter to unlock the server")
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName("role")
        .setDescription("The role to grant upon successful authentication")
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName("enabled")
        .setDescription("Whether the access gate is active")
        .setRequired(false)
    ),

  /**
   * Executes the setaccess command.
   * Updates MongoDB and clears relevant caches to ensure immediate logic updates.
   */
  async execute(interaction, container) {
    const password = interaction.options.getString("password");
    const role = interaction.options.getRole("role");
    const isEnabled = interaction.options.getBoolean("enabled") ?? true;
    
    const guildId = interaction.guild.id;
    const logger = container.get("logger");
    const config = container.get("config");

    try {
      // 1. Update the database within the Guild model
      // We store this under an 'access' object to keep the schema organized
      await Guild.findOneAndUpdate(
        { guildId },
        { 
          access: {
            password: password,
            roleId: role.id,
            enabled: isEnabled,
            lastUpdated: new Date()
          }
        },
        { upsert: true, new: true }
      );

      // 2. ⚡ Invalidate cache if your config service uses one
      // This ensures the /authenticate command pulls the fresh password immediately
      if (config.clearCache) {
        await config.clearCache(guildId);
      }

      // 3. Provide feedback to the admin
      await interaction.reply({
        content: `✅ **Access Configured**\n**Password:** \`${password}\`\n**Role:** ${role}\n**Status:** ${isEnabled ? "Enabled" : "Disabled"}`,
        ephemeral: true
      });

      logger.info(`Config: Guild ${guildId} updated access settings (Role: ${role.id})`);

    } catch (err) {
      logger.error(err, `Failed to update access config for guild ${guildId}`);
      
      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ An error occurred while saving the access configuration.",
          ephemeral: true
        });
      }
    }
  }
};