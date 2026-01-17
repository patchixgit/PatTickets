const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");

class PatTickets extends Discord.Client {
  constructor() {
    super({
      intents: ["Guilds", "GuildMessages", "MessageContent"],
    });

    this.commands = new Discord.Collection();
    this.rest = new Discord.REST().setToken(process.env.CLIENT_TOKEN);
  }

  async register(p = path.join(__dirname, "../commands")) {
    const commands = [];

    const commandFiles = fs.readdirSync(p).filter((f) => f.endsWith(".js"));

    for (const f of commandFiles) {
      const fP = path.join(p, f);
      const command = require(fP);
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing the required props.`,
        );
      }
    }

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = await this.rest.put(
      Discord.Routes.applicationGuildCommands(this.user.id, process.env.GUILD_ID),
      { body: commands },
    );
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );

    return data.length;
  }

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
        console.log(
          `[LOADED] The command ${commandExports.data.name} has been loaded. ${posMarker}.`,
        );
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

    for (const f of eventFiles) {
      const fPath = path.join(p, f);
      const evExports = require(fPath);
      let posMarker = `[${++currentPos}/${totalPositions}]`;

      if (!("name" in evExports && "execute" in evExports)) {
        console.log(
          `[WARNING] The event at ${fPath} failed to load. Needs name & exports. ${posMarker}.`,
        );
        continue;
      }

      if (evExports.once) {
        this.once(evExports.name, (...args) =>
          evExports.execute(this, ...args),
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
