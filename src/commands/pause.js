const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('再生を一時停止します'),

  async execute(interaction, musicQueue) {
    const guildQueue = musicQueue.get(interaction.guildId);
    if (!guildQueue) return interaction.reply({ content: '❌ 現在再生中の曲はありません。', ephemeral: true });
    if (guildQueue.player.state.status === AudioPlayerStatus.Paused)
      return interaction.reply({ content: '⏸️ すでに一時停止中です。', ephemeral: true });

    guildQueue.player.pause();
    await interaction.reply('⏸️ 一時停止しました。');
  },
};