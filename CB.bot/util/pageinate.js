// ------------------------------------------------------------------------------
// Function + Prop Exports

const { ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, ActionRowBuilder } = require("discord.js");
const { max } = require("moment/moment");

// ------------------------------------------------------------------------------
module.exports = {
	paginateText
};

// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

async function paginateText(interaction, pages, ephemeral = true) {
    await interaction.deferReply({ephemeral});

    const masterEmbed = new EmbedBuilder();

    const backButton = new ButtonBuilder()
        .setCustomId(`${interaction.id}_back`)
        .setLabel('←')
        .setStyle(ButtonStyle.Secondary);

    const nextButton = new ButtonBuilder()
        .setCustomId(`${interaction.id}_next`)
        .setLabel('→')
        .setStyle(ButtonStyle.Secondary);

    const pageButton = new ButtonBuilder()
        .setCustomId(`dummy_pages`)
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary);

    const maxPage = pages.length - 1;
    const minPage = 0;
    let curPage = 0;

    // eslint-disable-next-line no-constant-condition
    while(true) {
        curPage === minPage ? backButton.setDisabled(true) : backButton.setDisabled(false);
        curPage === maxPage ? nextButton.setDisabled(true) : nextButton.setDisabled(false);

        pageButton.setLabel(`${curPage+1} / ${maxPage+1}`);

        const { content, title, footer, image, color } = pages[curPage]
        
        masterEmbed
            .setDescription(content ?? null)
            .setTitle(title ?? null)
            .setFooter(footer === undefined ? null : { text: footer })
            .setImage(image ?? null)
            .setColor(color ?? '#2f3136');

        const message = await interaction.editReply({
            embeds: [masterEmbed],
            components: [
                new ActionRowBuilder()
                    .addComponents([
                        backButton,
                        pageButton,
                        nextButton,
                    ])
            ],
            ephemeral,
        });

        const filter = i => {
            i.deferUpdate();
            return i.customId.startsWith(interaction.id) && i.user.id === interaction.user.id;
        };
        const buttonInteraction = await message
            .awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 120_000 })
            .catch(() => { curPage = -1 });

        if (buttonInteraction?.customId.endsWith('back')) curPage --;
        if (buttonInteraction?.customId.endsWith('next')) curPage ++;

        if (curPage === -1) {
            backButton.setDisabled(true);
            nextButton.setDisabled(true);

            return await interaction.editReply({
                embeds: [masterEmbed],
                components: [
                    new ActionRowBuilder()
                        .addComponents([
                            backButton,
                            pageButton,
                            nextButton,
                        ])
                ],
                ephemeral,
            });
        }
    }
}