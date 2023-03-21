const { time } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, Events, PermissionsBitField, PermissionFlagsBits, ChannelType } = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { setAvatar, setTags, getMemberByID, getMembers } = require('../../db/dbAccess');
const { paginateText } = require('../../util/pageinate')
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'searchcollection',
    description: 'gives a list of members from another persons collection',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'user',
            description: 'The user to list the collection of',
            type: OPTION.USER,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, client, ephemeral = true) {
        const owner = interaction.options.getMember('user')
        const user = await interaction.client.users.fetch(owner);
        const members = await getMembers(user.id)
       
        //Fetch from db
        const bigArray = await getMembers(user.id);

        //Split the array into small(er) arrays of 20
        const arrayOfArrays = split(bigArray, 20);

        //each array within the big array is one page
        const pages = arrayOfArrays.map(a => {
            //This map defines what one line on one page looks like, join the lines on one page with \n
            return {
                content: a.map(m => `\`${m._id}\` ${m.name} - ${m.tags}`).join('\n'),
            }
        });

        //do the pagination
        await paginateText(interaction, pages, false);
       
    },

    // ------------------------------------------------------------------------------
};
// ------------------------------------------------------------------------------
//This would go outside of the module exports, or you could shove it into genutils
/**
 * @param arr The large array to be split
 * @param num Desired number of elements per array
 * @returns Array of Arrays that are num in length
 */
 function split(arr, num) {
    const size = Math.ceil(arr.length / num);
    return Array.from({ length: num }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
}