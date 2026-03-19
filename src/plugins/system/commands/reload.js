const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a specific plugin's code and events.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option.setName("plugin")
        .setDescription("The name of the plugin to reload")
        .setRequired(true)
        .setAutocomplete(true) // This uses the autocomplete logic in CommandRouter
    ),

  async execute(interaction, container) {
    const pluginName = interaction.options.getString("plugin");
    const loader = container.get("pluginLoader");

    await interaction.reply({ content: `Reloading \`${pluginName}\`...`, ephemeral: true });

    try {
      await loader.reloadPlugin(pluginName);
      await interaction.editReply({ content: `✅ Plugin \`${pluginName}\` reloaded successfully.` });
    } catch (err) {
      await interaction.editReply({ content: `❌ Failed to reload \`${pluginName}\`. Check logs.` });
    }
  },

  async autocomplete(interaction, container) {
    const loader = container.get("pluginLoader");
    const focusedValue = interaction.options.getFocused();
    const choices = loader.getLoadedPluginNames();
    
    const filtered = choices.filter(choice => choice.startsWith(focusedValue));
    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice }))
    );
  }
};