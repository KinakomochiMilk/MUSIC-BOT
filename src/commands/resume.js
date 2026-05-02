const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('一時停止した再生を再開します'),

  async execute(interaction, musicQueue) {
    const guildQueue = musicQueue.get(interaction.guildId);
    if (!guildQueue) return interaction.reply({ content: '❌ 現在再生中の曲はありません。', ephemeral: true });
    if (guildQueue.player.state.status !== AudioPlayerStatus.Paused)
      return interaction.reply({ content: '▶️ すでに再生中です。', ephemeral: true });

    guildQueue.player.unpause();
    await interaction.reply('▶️ 再生を再開しました！');
  },
};