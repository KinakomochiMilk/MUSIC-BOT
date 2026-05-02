const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { formatDuration } = require('../player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('現在の再生キューを表示します'),

  async execute(interaction, musicQueue) {
    const guildQueue = musicQueue.get(interaction.guildId);
    if (!guildQueue || guildQueue.songs.length === 0)
      return interaction.reply({ content: '📭 キューは空です。', ephemeral: true });

    const songs = guildQueue.songs;
    const current = songs[0];
    const upcoming = songs.slice(1, 11);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🎵 再生キュー')
      .addFields({
        name: '▶️ 現在再生中',
        value: `**${current.title}** (${formatDuration(current.duration)}) | ${current.requester}`,
      });

    if (upcoming.length > 0) {
      const list = upcoming
        .map((s, i) => `${i + 1}. **${s.title}** (${formatDuration(s.duration)}) | ${s.requester}`)
        .join('\n');
      embed.addFields({ name: '⏳ 次の曲', value: list });
    }

    if (songs.length > 11) embed.setFooter({ text: `他 ${songs.length - 11} 曲がキューにあります` });
    embed.addFields({ name: '🔊 音量', value: `${guildQueue.volume}%`, inline: true });

    await interaction.reply({ embeds: [embed] });
  },
};