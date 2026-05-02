const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getVideoInfo, playNext, createPlayer } = require('../player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('YouTubeの曲を再生します')
    .addStringOption((opt) =>
      opt.setName('query')
        .setDescription('YouTube URL または検索キーワード')
        .setRequired(true)
    ),

  async execute(interaction, musicQueue) {
    await interaction.deferReply();

    const query = interaction.options.getString('query', true);
    console.log('query:', query);

    const voiceChannel = interaction.member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.editReply('❌ まずボイスチャンネルに参加してください！');
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      return interaction.editReply('❌ そのボイスチャンネルに接続する権限がありません。');
    }

    let song;
    try {
      await interaction.editReply('🔍 検索中...');
      song = await getVideoInfo(query);
      song.requester = interaction.user.username;
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ 曲が見つかりませんでした。URLまたはキーワードを確認してください。');
    }

    const guildId = interaction.guildId;

    if (!musicQueue.has(guildId)) {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const player = createPlayer();
      connection.subscribe(player);

      const guildQueue = {
        guildId,
        connection,
        player,
        songs: [song],
        volume: 50,
        repeatMode: 'off',
        textChannel: interaction.channel,
        resource: null,
      };

      musicQueue.set(guildId, guildQueue);
      await interaction.editReply(`✅ **${song.title}** をキューに追加しました！`);
      await playNext(guildQueue, musicQueue);
    } else {
      const guildQueue = musicQueue.get(guildId);
      guildQueue.songs.push(song);
      await interaction.editReply(
        `✅ **${song.title}** をキューに追加しました！（位置: ${guildQueue.songs.length}番目）`
      );
    }
  },
};