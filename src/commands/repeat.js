const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('リピートモードを切り替えます')
    .addStringOption((opt) =>
      opt.setName('mode')
        .setDescription('リピートモード')
        .setRequired(true)
        .addChoices(
          { name: '🔁 1曲リピート', value: 'one' },
          { name: '🔂 全曲リピート', value: 'all' },
          { name: '❌ オフ', value: 'off' },
        )
    ),

  async execute(interaction, musicQueue) {
    const guildQueue = musicQueue.get(interaction.guildId);
    if (!guildQueue) {
      return interaction.reply({ content: '❌ 現在再生中の曲はありません。', ephemeral: true });
    }

    const mode = interaction.options.getString('mode');
    guildQueue.repeatMode = mode;

    const labels = { one: '🔁 1曲リピート', all: '🔂 全曲リピート', off: '❌ オフ' };
    await interaction.reply(`リピートモードを **${labels[mode]}** に設定しました。`);
  },
};