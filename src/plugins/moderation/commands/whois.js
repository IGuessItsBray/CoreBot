const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const User = require("../../../models/User");
const paginate = require("../../../utils/pagination");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("View a comprehensive profile including activity and warning history.")
    .addStringOption(opt => 
      opt.setName("target")
        .setDescription("User ID or @Mention")
        .setRequired(true)
    ),

  async execute(interaction, container) {
    const targetInput = interaction.options.getString("target").replace(/[<@!>]/g, "");
    const guildId = interaction.guild.id;
    const logger = container.get("logger");

    try {
      // 1. Resolve User (Works for non-members/banned users)
      const user = await interaction.client.users.fetch(targetInput).catch(() => null);
      if (!user) {
        return interaction.reply({ 
          content: "❌ Could not find a user with that ID.", 
          flags: [MessageFlags.Ephemeral] 
        });
      }

      // 2. Resolve Member (Check if currently in the server)
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      // 3. Fetch Database Profile
      const profile = await User.findOne({ guildId, userId: user.id });

      const pages = [];

      // --- DATA CALCULATIONS ---
      const totalMsgs = profile?.messageCount || 0;
      const totalChars = profile?.characterCount || 0;
      // Calculate average length, defaulting to 0 if no messages exist
      const avgLength = totalMsgs > 0 ? (totalChars / totalMsgs).toFixed(1) : 0;

      // --- PAGE 1: IDENTITY & ACTIVITY ---
      const mainEmbed = new EmbedBuilder()
        .setAuthor({ name: `User Information: ${user.tag}`, iconURL: user.displayAvatarURL() })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor(member ? member.displayColor : 0x2B2D31)
        .addFields(
          { 
            name: "👤 Identity", 
            value: `**ID:** ${user.id}\n**Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>`, 
            inline: true 
          },
          { 
            name: "📊 Activity", 
            value: [
              `**Messages:** ${totalMsgs.toLocaleString()}`,
              `**Characters:** ${totalChars.toLocaleString()}`,
              `**Avg. Length:** ${avgLength} chars`,
              `**Last Seen:** ${profile?.lastSeen ? `<t:${Math.floor(profile.lastSeen.getTime() / 1000)}:R>` : "Never"}`
            ].join('\n'), 
            inline: true 
          },
          { 
            name: "🛡️ Mod Stats", 
            value: `**Warnings:** ${profile?.warnings?.length || 0}\n**Kicks:** ${profile?.kicks?.length || 0}\n**Bans:** ${profile?.bans?.filter(b => b.type === 'BAN').length || 0}`, 
            inline: true 
          }
        );

      if (member) {
        const roles = member.roles.cache
          .filter(r => r.id !== interaction.guild.id)
          .sort((a, b) => b.position - a.position)
          .map(r => r.toString())
          .join(", ") || "None";

        mainEmbed.addFields(
          { 
            name: "🏠 Server Status", 
            value: `**Joined:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>\n**Nickname:** ${member.nickname || "None"}`, 
            inline: false 
          },
          { name: `🎭 Roles [${member.roles.cache.size - 1}]`, value: roles, inline: false }
        );
      } else {
        mainEmbed.addFields({ name: "🏠 Server Status", value: "User is not currently in this server.", inline: false });
      }

      pages.push(mainEmbed);

      // --- SUBSEQUENT PAGES: WARNING HISTORY (3 per page) ---
      if (profile?.warnings?.length > 0) {
        const warnings = [...profile.warnings].reverse();
        const chunkSize = 3;

        for (let i = 0; i < warnings.length; i += chunkSize) {
          const currentChunk = warnings.slice(i, i + chunkSize);
          const warnPage = new EmbedBuilder()
            .setTitle(`Warning History (Page ${Math.floor(i / chunkSize) + 1})`)
            .setColor(0xFEE75C)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });

          currentChunk.forEach((warn, idx) => {
            const warnNum = warnings.length - (i + idx);
            warnPage.addFields({
              name: `Warning #${warnNum}`,
              value: `**ID:** \`${warn._id}\`\n**Reason:** ${warn.reason}\n**Moderator:** <@${warn.moderatorId}>\n**Date:** <t:${Math.floor(warn.timestamp.getTime() / 1000)}:d>`,
              inline: false
            });
          });

          pages.push(warnPage);
        }
      }

      // 🔹 Execute Pagination (Utility handles 1-page vs Multi-page)
      await paginate(interaction, pages);

    } catch (err) {
      logger.error(err, `Whois command failed for ${targetInput}`);
      await interaction.reply({ 
        content: "❌ An error occurred while generating the user profile.", 
        flags: [MessageFlags.Ephemeral] 
      });
    }
  }
};