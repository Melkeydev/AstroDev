const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Echoes the users message")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("the input for command")
        .setRequired(true)
    ),
  async execute(interaction) {
    const value = interaction.options.getString("input");
    await interaction.reply(`${interaction.user.username} said ${value}`);
  },
};
