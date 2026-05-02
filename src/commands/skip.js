const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('現在の曲をスキップします'),

  async execute(interaction, musicQueue) {
    const guildQueue = musicQueue.get(interaction.guildId);
    if (!guildQueue || guildQueue.songs.length === 0)
      return interaction.reply({ content: '❌ スキップする曲がありません。', ephemeral: true });

    const skipped = guildQueue.songs[0];
    guildQueue.player.stop();
    await interaction.reply(`⏭️ **${skipped.title}** をスキップしました。`);
  },
};