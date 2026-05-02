const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('音量を変更します (0〜100)')
    .addIntegerOption((opt) =>
      opt.setName('level')
        .setDescription('音量 (0〜100)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100)
    ),

  async execute(interaction, musicQueue) {
    const guildQueue = musicQueue.get(interaction.guildId);
    const level = interaction.options.getInteger('level');
    if (!guildQueue) return interaction.reply({ content: '❌ 現在再生中の曲はありません。', ephemeral: true });

    guildQueue.volume = level;
    if (guildQueue.resource?.volume) guildQueue.resource.volume.setVolume(level / 100);

    await interaction.reply(`🔊 音量を **${level}%** に設定しました。`);
  },
};