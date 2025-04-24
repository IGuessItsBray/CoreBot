const {
  PermissionFlagsBits,
  ButtonStyle,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const Sentry = require("@sentry/node");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "inerr",
  description: "Intentionally errors to check err handling",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction) {
    Sentry.startSpan(
      {
        op: "test",
        name: "My First Test Span",
      },
      () => {
        try {
          foo();
        } catch (e) {
          Sentry.captureException(e);
        }
      }
    );
  },

  // ------------------------------------------------------------------------------
};
