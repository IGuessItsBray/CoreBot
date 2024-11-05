const { addMasterLog, purgeGuildConfig } = require("../db/dbAccess");

module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "When the bot leaves/is kicked from a Guild",
  type: "guildDelete",

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(guild) {
    await addMasterLog(
      `Left Guild ${guild.name} ${guild.id} ... Purging configuration`
    );
    await purgeGuildConfig(guild.id);
  },

  // ------------------------------------------------------------------------------
};
