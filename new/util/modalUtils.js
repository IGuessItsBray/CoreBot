// ------------------------------------------------------------------------------
// modalUtils.js
// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------

module.exports = {
    doModal,
};

// ------------------------------------------------------------------------------
// Public Functions
// ------------------------------------------------------------------------------

async function doModal(modal, sourceInteraction, timeoutMins = 2) {

    // Add the Custom ID
    modal = modal.setCustomId(`modal-${sourceInteraction.id}`);

    // Send the modal
    await sourceInteraction.showModal(modal);

    // Set up a collector for the modal, return the interaction
    try {
        const modalSubmitInteraction = await sourceInteraction.awaitModalSubmit({
            filter: i => i.customId === `modal-${sourceInteraction.id}`,
            time: timeoutMins * 60 * 1000,
        });
        return modalSubmitInteraction;
    }
    catch (e) {
        console.error(`modalUtils: doModal: ${sourceInteraction.commandName}: ${e}`);
        // console.debug(e);
    }
}

// ------------------------------------------------------------------------------
