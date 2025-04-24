const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
  } = require('discord.js');
  
  async function paginateEmbeds(interaction, embeds, { timeout = 60000 } = {}) {
    if (!embeds || embeds.length === 0) {
      return interaction.reply({ content: 'No pages to display.', ephemeral: true });
    }
  
    let currentPage = 0;
  
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡️')
        .setStyle(ButtonStyle.Primary),
    );
  
    const reply = await interaction.reply({
      embeds: [embeds[currentPage]],
      components: embeds.length > 1 ? [row] : [],
      fetchReply: true
    });
  
    if (embeds.length <= 1) return;
  
    const collector = reply.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: timeout
    });
  
    collector.on('collect', async i => {
      if (i.customId === 'next') {
        currentPage = (currentPage + 1) % embeds.length;
      } else if (i.customId === 'prev') {
        currentPage = (currentPage - 1 + embeds.length) % embeds.length;
      }
  
      await i.update({
        embeds: [embeds[currentPage]],
        components: [row]
      });
    });
  
    collector.on('end', async () => {
      try {
        await reply.edit({ components: [] });
      } catch (e) {
        console.warn('Failed to disable buttons after timeout:', e.message);
      }
    });
  }
  
  module.exports = { paginateEmbeds };