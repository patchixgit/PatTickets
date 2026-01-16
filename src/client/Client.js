const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");

class PatTickets extends Discord.Client {
  constructor() {
    super({
      intents: [],
    });

    this.commands = new Discord.Collection();
  }

  async register() {}

  async commandHandler(p = path.join(__dirname, "../commands")) {
    const commandFiles = fs.readdirSync(p).filter((f) => f.endsWith(".js"));

    let currentPos = 0;
    let totalPositions = commandFiles.length;

    for (const f of commandFiles) {
      const filePath = path.join(p, f);

      const commandExports = require(filePath);

      let posMarker = `[${++currentPos}/${totalPositions}]`;

      if ("data" in commandExports && "execute" in commandExports) {
        this.commands.set(commandExports.data.name, commandExports);
        console.log(`
            [LOADED] The command ${commandExports.data.name} has been loaded. ${posMarker}.
        `);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property. ${posMarker}.`,
        );
      }
    }
  }

  async eventHandler(p = path.join(__dirname, "../events")) {
    const eventFiles = fs.readdirSync(p).filter((f) => f.endsWith(".js"));

    let currentPos = 0;
    let totalPositions = eventFiles.length;
    let posMarker = `[${++currentPos}/${totalPositions}]`;

    for (const f of eventFiles) {
      const fPath = path.join(p, f);
      const evExports = require(fPath);

      if (!("name" in evExports && "execute" in evExports)) {
        console.log(
          `[WARNING] The event at ${fPath} failed to load. Needs name & exports. ${posMarker}.`,
        );
        continue;
      }

      if (evExports.once) {
        this.once(evExports.name, (...args) =>
          evExports.execute(...args, this),
        );
        console.log(`[EV-O] The event at ${fPath} was loaded. ${posMarker}`);
      } else {
        this.on(evExports.name, (...args) => evExports.execute(this, ...args));
        console.log(`[EV] The event at ${fPath} was loaded. ${posMarker}`);
      }
    }
  }

  async initialize() {
    await this.commandHandler();
    await this.eventHandler();

    await this.login(process.env.CLIENT_TOKEN);
  }
}

module.exports = PatTickets;
