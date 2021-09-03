import fs from "fs";
import express from "express";
import { Client, Collection, Intents } from "discord.js";
require("dotenv").config();
import ytdl from "ytdl-core";

//TODO: figure this out lol
const { Player } = require("discord-player");

const testToken = process.env.TOKEN;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
  ],
});
const player = new Player(client);

// TODO: Fix this
// @ts-expect-error
client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".ts"));

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // TODO: Fix this
  // @ts-expect-error
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
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
    await command.execute(interaction, player);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "There was an error executing this command",
      ephemeral: true,
    });
  }
});

client.login(testToken);
