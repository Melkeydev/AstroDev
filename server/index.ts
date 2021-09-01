import express from "express";
import { Client, Intents } from "discord.js";
require("dotenv").config();

const testToken = process.env.TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("Ready to serve");
});

client.login(testToken);

//const app = express();
//app.use(express.json());

//const PORT = 5069;

//app.listen(PORT, () => console.log(``));
