const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const User = require("../../../models/User");
const paginate = require("../../../utils/pagination");

// Hardcoded constants for the Hub Guild
const HUB_GUILD_ID = '1350126112432328704';

const BADGE_MAP = [
  { roles: ['1350126255470674020', '1350126506252177468'], emote: '<:CB_Logo:1484274546092671127>' }, // Founder / Bot Dev
  { roles: ['1350126640549728276', '1350126692580069436'], emote: '<:CB_Dark:1484274576799174878>' }, // Net Dev / Web Dev
  { roles: ['1350126329302876194'], emote: '<:CB_Vibe:1484274594373304546>' },                       // Dev
  { roles: ['1350126920582430833'], emote: '<:CB_Trees:1484274484394328066>' }                        // Support
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("View a comprehensive profile including activity and global staff badges.")
    .addStringOption(opt => 
      opt.setName("target")
        .setDescription("User ID or @Mention")
        .setRequired(true)
    ),

  async execute(interaction, container) {
    const targetInput = interaction.options.getString("target").replace(/[<@!>]/g, "");
    const guildId = interaction.guild.id;
    const client = container.get("client");
    const logger = container.get("logger");

    try {
      // 1. Resolve User
      const user = await client.users.fetch(targetInput).catch(() => null);
      if (!user) {
        return interaction.reply({ 
          content: "❌ Could not find a user with that ID.", 
          flags: [MessageFlags.Ephemeral] 
        });
      }

      // 2. Resolve Member (Local)
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      // 3. Fetch Database Profile
      const profile = await User.findOne({ guildId, userId: user.id });

      // 4. 🌐 GLOBAL BADGE LOGIC 🌐
      let badgeLine = "";
      try {
        const hubGuild = await client.guilds.fetch(HUB_GUILD_ID);
        const hubMember = await hubGuild.members.fetch(user.id).catch(() => null);

        if (hubMember) {
          const foundBadges = [];
          for (const entry of BADGE_MAP) {
            if (entry.roles.some(roleId => hubMember.roles.cache.has(roleId))) {
              foundBadges.push(entry.emote);
            }
          }
          if (foundBadges.length > 0) {
            badgeLine = foundBadges.join(" ");
          }
        }
      } catch (err) {
        // Silently skip badge check if hub is unreachable
      }

      const pages = [];

      // --- DATA CALCULATIONS ---
      const totalMsgs = profile?.messageCount || 0;
      const totalChars = profile?.characterCount || 0;
      const avgLength = totalMsgs > 0 ? (totalChars / totalMsgs).toFixed(1) : 0;

      // --- PAGE 1: IDENTITY & ACTIVITY ---
      const mainEmbed = new EmbedBuilder()
        .setAuthor({ name: `User Information: ${user.tag}`, iconURL: user.displayAvatarURL() })
        // Append badges below the username if they exist
        .setDescription(badgeLine ? `${badgeLine}` : null) 
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

      // --- SUBSEQUENT PAGES: WARNING HISTORY ---
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