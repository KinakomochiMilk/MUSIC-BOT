const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('再生を停止してボイスチャンネルから退出します'),

  async execute(interaction, musicQueue) {
    const guildQueue = musicQueue.get(interaction.guildId);
    if (!guildQueue) return interaction.reply({ content: '❌ 現在再生中の曲はありません。', ephemeral: true });

    guildQueue.songs = [];
    guildQueue.player.stop();
    guildQueue.connection.destroy();
    musicQueue.delete(interaction.guildId);

    await interaction.reply('⏹️ 再生を停止し、ボイスチャンネルから退出しました。');
  },
};