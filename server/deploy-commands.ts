import fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
require("dotenv").config();

const clientId = process.env.CLIENT_ID as string;
const guildId = process.env.GUILD_ID as string;
const token = process.env.TOKEN as string;

// TODO: FIx this
const commands = [] as any;
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".ts"));

console.log(commandFiles);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
