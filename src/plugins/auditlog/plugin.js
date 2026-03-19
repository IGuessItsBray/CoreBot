module.exports = {
  name: "auditLog",
  enabled: true,

  async init(container) {
    this.container = container;
    this.logging = container.get("logging");
  },

  async start() {
    const client = this.container.get("client");
// --- Message Update (Edit) Listener ---
    client.on("messageUpdate", async (oldMessage, newMessage) => {
      // 1. Handle Partials: If we don't have the old message in cache, we can't show the change
      if (oldMessage.partial) {
        try {
          await oldMessage.fetch();
        } catch (err) {
          // If the old message can't be fetched, we just stop
          return;
        }
      }

      // 2. Ignore if the content didn't actually change (e.g., just an embed/pin update)
      if (oldMessage.content === newMessage.content) return;
      
      // 3. Ignore bots
      if (newMessage.author?.bot) return;

      await this.logging.send(newMessage.guild.id, {
        title: "📝 Message Edited",
        color: 0xFFAA00, // Orange
        fields: [
          { name: "Author", value: `${newMessage.author.tag}`, inline: true },
          { name: "Channel", value: `${newMessage.channel}`, inline: true },
          { name: "Original", value: oldMessage.content || "*No text content*" },
          { name: "New", value: newMessage.content || "*No text content*" }
        ],
        footer: `User ID: ${newMessage.author.id}`
      });
    });
    // --- Role Update Listener ---
    client.on("guildMemberUpdate", async (oldMember, newMember) => {
      // If the member isn't fully cached, fetch the full data
      if (oldMember.partial) {
        try { await oldMember.fetch(); } catch (e) { return; }
      }

      const oldRoles = oldMember.roles.cache;
      const newRoles = newMember.roles.cache;

      // Filter to find the difference
      const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
      const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

      if (addedRoles.size > 0) {
        await this.logging.send(newMember.guild.id, {
          title: "🛡️ Role Granted",
          color: 0x5865F2,
          fields: [
            { name: "User", value: `<@${newMember.id}>`, inline: true },
            { name: "Role(s) Added", value: addedRoles.map(r => `${r}`).join(", ") }
          ]
        });
      }

      if (removedRoles.size > 0) {
        await this.logging.send(newMember.guild.id, {
          title: "🛡️ Role Removed",
          color: 0xF47B67,
          fields: [
            { name: "User", value: `<@${newMember.id}>`, inline: true },
            { name: "Role(s) Removed", value: removedRoles.map(r => `${r}`).join(", ") }
          ]
        });
      }
    });

    // --- Message Delete Listener (with Partial handling) ---
    client.on("messageDelete", async (message) => {
      if (message.partial) {
        try { await message.fetch(); } catch (e) { return; }
      }
      if (message.author?.bot) return;

      await this.logging.send(message.guild.id, {
        title: "🗑️ Message Deleted",
        color: 0xFF0000,
        fields: [
          { name: "Author", value: message.author?.tag || "Unknown", inline: true },
          { name: "Channel", value: `${message.channel}`, inline: true },
          { name: "Content", value: message.content || "*No text content*" }
        ]
      });
    });
  },
  

  async stop() {
    const client = this.container.get("client");
    client.removeAllListeners("guildMemberUpdate");
    client.removeAllListeners("messageDelete");
    client.removeAllListeners("messageUpdate");
  }
};