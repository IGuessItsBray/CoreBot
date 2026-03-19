const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const User = require("../../../models/User");
const paginate = require("../../../utils/pagination"); // 🔹 Reuse our utility

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("View the warning history of a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName("target").setDescription("The user to check").setRequired(true)),

  async execute(interaction, container) {
    const target = interaction.options.getUser("target");
    const guildId = interaction.guild.id;

    try {
      const profile = await User.findOne({ guildId, userId: target.id });

      if (!profile || !profile.warnings || profile.warnings.length === 0) {
        return interaction.reply({
          content: `✅ **${target.tag}** has a clean record (0 warnings).`,
          flags: [MessageFlags.Ephemeral]
        });
      }

      const warnings = [...profile.warnings].reverse();
      const chunkSize = 3;
      const pages = [];

      // Loop through warnings in chunks of 3
      for (let i = 0; i < warnings.length; i += chunkSize) {
        const currentChunk = warnings.slice(i, i + chunkSize);
        
        const embed = new EmbedBuilder()
          .setAuthor({ name: `Warning History: ${target.tag}`, iconURL: target.displayAvatarURL() })
          .setColor(0xFEE75C)
          .setFooter({ text: `Page ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(warnings.length / chunkSize)}` })
          .setTimestamp();

        currentChunk.forEach((warn, index) => {
          // Calculate the original warning number (total - current index in global list)
          const warnNum = warnings.length - (i + index);
          const date = new Date(warn.timestamp).toLocaleDateString();
          
          embed.addFields({
            name: `Warning #${warnNum}`,
            value: `**ID:** \`${warn._id}\`\n**Reason:** ${warn.reason}\n**Moderator:** <@${warn.moderatorId}>\n**Date:** ${date}`,
            inline: false
          });
        });

        pages.push(embed);
      }

      // 🔹 Utility handles the "less than 3" check:
      // If pages.length is 1, it just sends the embed without buttons.
      await paginate(interaction, pages);

    } catch (err) {
      container.get("logger").error(err);
      await interaction.reply({ 
        content: "❌ Failed to fetch warning history.", 
        flags: [MessageFlags.Ephemeral] 
      });
    }
  }
};