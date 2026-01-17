const { SlashCommandBuilder, InteractionContextType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong to show you the bot is online! :)")
        .setContexts(InteractionContextType.Guild),
    
    execute: async () => {
        return "Pong!";
    }
}