const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

/**
 * @param {CommandInteraction} interaction - The original interaction
 * @param {EmbedBuilder[]} pages - An array of embed objects
 * @param {number} timeout - How long until buttons stop working (default 60s)
 */
async function paginate(interaction, pages, timeout = 60000) {
  if (!interaction || !pages || pages.length === 0) return;

  if (pages.length === 1) {
    return interaction.reply({ embeds: pages });
  }

  const prev = new ButtonBuilder()
    .setCustomId('prev')
    .setLabel('Previous')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

  const next = new ButtonBuilder()
    .setCustomId('next')
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(prev, next);

  const response = await interaction.reply({
    embeds: [pages[0]],
    components: [row],
    fetchReply: true,
  });

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: timeout,
  });

  let currentIndex = 0;

  collector.on('collect', async (i) => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({ content: "This menu isn't for you!", ephemeral: true });
    }

    if (i.customId === 'prev') currentIndex--;
    if (i.customId === 'next') currentIndex++;

    prev.setDisabled(currentIndex === 0);
    next.setDisabled(currentIndex === pages.length - 1);

    await i.update({
      embeds: [pages[currentIndex]],
      components: [row],
    });
  });

  collector.on('end', () => {
    const disabledRow = new ActionRowBuilder().addComponents(
      prev.setDisabled(true),
      next.setDisabled(true)
    );
    response.edit({ components: [disabledRow] }).catch(() => null);
  });
}

module.exports = paginate;