// shared/utils/paginateHandler.js
module.exports = async function paginate(interaction, pages, options = {}) {
    if (!interaction || !pages || pages.length === 0) {
      throw new Error('Missing required arguments for pagination.');
    }
  
    const userId = interaction.user.id;
    let currentPage = 0;
  
    const row = (disabled = false) => ({
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          label: 'Previous',
          custom_id: 'prev',
          disabled: disabled || currentPage === 0,
        },
        {
          type: 2,
          style: 1,
          label: 'Next',
          custom_id: 'next',
          disabled: disabled || currentPage === pages.length - 1,
        },
      ],
    });
  
    const message = await interaction.reply({
      content: pages[currentPage],
      components: [row()],
      ephemeral: options.ephemeral ?? true,
      fetchReply: true,
    });
  
    const collector = message.createMessageComponentCollector({
      filter: (i) => i.user.id === userId,
      time: 5 * 60 * 1000,
    });
  
    collector.on('collect', async (i) => {
      if (i.customId === 'next' && currentPage < pages.length - 1) currentPage++;
      else if (i.customId === 'prev' && currentPage > 0) currentPage--;
  
      await i.update({
        content: pages[currentPage],
        components: [row()],
      });
    });
  
    collector.on('end', async () => {
      try {
        await message.edit({ components: [row(true)] });
      } catch (err) {
        // Silent fail if message was deleted
      }
    });
  };