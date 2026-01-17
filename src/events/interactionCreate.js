const { Events, Interaction } = require("discord.js");
const PatTickets = require("../client/Client");

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param {PatTickets} ptClient
   * @param {Interaction} interaction
   */
  execute: async (ptClient, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = ptClient.commands.get(interaction.commandName);

    if (!command) {
      // Command handler should already check for name, etc
      return interaction.reply(
        "That command doesn't seem to exist anymore. The error has been logged. \n -# Typing !register to register commands might fix this.",
      );
    }

    try {
      const result = await command.execute(ptClient, interaction);

      if (typeof result === "string") {
        await interaction.reply({ content: result });
      } else if (typeof result === "object" && result !== null) {
        // Javascript NULL returns will Return Typeof object
        await interaction.reply(result);
      }
    } catch (e) {
      console.error(e);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content:
            "Error Executing That Command! Please open an issue on the PatTickets Github.",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content:
            "Error Executing That Command! Please open an issue on the PatTickets Github.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
