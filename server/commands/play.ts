import { GuildMember } from "discord.js";
import { QueryType } from "discord-player";
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("plays a song in a vc")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The song to play")
        .setRequired(true)
    ),
  async execute(interaction, player) {
    try {
      if (
        !(interaction.member instanceof GuildMember) ||
        !interaction.member.voice.channel
      ) {
        return void interaction.reply({
          content: "You are not in a voice channel",
          ephemeral: true,
        });
      }

      await interaction.deferReply();

      const query = interaction.options.get("query").value;
      console.log(player);
      const searchResult = await player.search(query, {
        requestedBy: interaction.user,
        searchEnginer: QueryType.AUTO,
      });
      if (!searchResult || !searchResult.tracks.length)
        return void interaction.followUp({ content: "No results were found" });

      const queue = await player.createQueue(interaction.guild, {
        metadata: interaction.channel,
      });

      try {
        if (!queue.connection)
          await queue.connect(interaction.member.voice.channel);
      } catch {
        void player.deleteQueue(interaction.guildId);
        return void interaction.followUp({
          content: "Could not join voice channel",
        });
      }

      await interaction.followUp({
        content: `Loading your ${
          searchResult.playlist ? "playlist" : "track"
        }...`,
      });
      searchResult.playlist
        ? queue.addTracks(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: "There was an error trying to execute that command",
      });
    }
  },
};
