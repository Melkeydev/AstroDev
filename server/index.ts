import fs from "fs";
import express from "express";
import { Client, Collection, Intents } from "discord.js";
require("dotenv").config();

const testToken = process.env.TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// TODO: Fix this
// @ts-expect-error
client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // TODO: Fix this
  // @ts-expect-error
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Ready to serve");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  // TODO: Fix this
  // @ts-expect-error
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "There was an error executing this command",
      ephemeral: true,
    });
  }
});

client.login(testToken);
