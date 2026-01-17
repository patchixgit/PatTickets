const { Events, Message } = require("discord.js");
const PatTickets = require("../client/Client");

module.exports = {
  name: Events.MessageCreate,

  /**
   *
   * @param {PatTickets} ptClient
   * @param {Message} message
   */
  execute: async (ptClient, message) => {
    if (message.author.bot) return;

    if (message.author.id !== process.env.BOT_OWNER_ID) return;

    if (message.content === "!register") {
      try {
        const amountRegistered = await ptClient.register();

        await message.reply(
          `Success! Registered ${amountRegistered} slash commands.`,
        );
      } catch (e) {
        await message.reply(
          "Error registering (/) commands! The error has been logged to the console.",
        );
        console.error(e);
      }
    } else return;
  },
};
