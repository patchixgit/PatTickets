(async () => {
  require("dotenv").config({ quiet: true });

  const envCheckPass = await require("./envCheck")();

  const Discord = require("discord.js");

  const client = new Discord.Client({
    intents: [],
  });

  if (envCheckPass) {
    client.login(process.env.CLIENT_TOKEN);
  } else {
    throw new Error("Env Check Not Passed!");
  }
})();
