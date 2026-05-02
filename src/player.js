const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
  NoSubscriberBehavior,
} = require('@discordjs/voice');
const ytdlp = require('yt-dlp-exec');
const { spawn } = require('child_process');

async function getAudioStream(url) {
  console.log('🚀 yt-dlp + ffmpeg 起動中...');

  const ytdlpProc = spawn('yt-dlp', [
    '-f', 'bestaudio/best',
    '-o', '-',
    '--quiet',
    '--no-warnings',
    url,
  ], { stdio: ['ignore', 'pipe', 'ignore'] });

  const ffmpegProc = spawn('ffmpeg', [
    '-i', 'pipe:0',
    '-vn',
    '-loglevel', 'quiet',
    '-f', 's16le',
    '-ar', '48000',
    '-ac', '2',
    'pipe:1',
  ], { stdio: ['pipe', 'pipe', 'ignore'] });

  ytdlpProc.stdout.pipe(ffmpegProc.stdin);


  ytdlpProc.stdout.on('error', () => {});
  ffmpegProc.stdin.on('error', () => {});
  ffmpegProc.stdout.on('error', () => {});

  ytdlpProc.on('close', () => ffmpegProc.stdin.end());

  return ffmpegProc.stdout;
}

async function getVideoInfo(query) {
  if (!query) throw new Error('クエリが空です');

  const isUrl = typeof query === 'string' && (query.startsWith('http://') || query.startsWith('https://'));
  const searchQuery = isUrl ? query : `ytsearch1:${query}`;

  const result = await ytdlp(searchQuery, {
    dumpSingleJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
  });

  const info = result.entries ? result.entries[0] : result;
  return {
    title: info.title,
    url: info.webpage_url || info.url,
    duration: info.duration,
    thumbnail: info.thumbnail,
    requester: null,
  };
}

async function playNext(guildQueue, musicQueue) {
  if (!guildQueue || guildQueue.songs.length === 0) {
    if (guildQueue?.connection) guildQueue.connection.destroy();
    if (guildQueue?.guildId) musicQueue.delete(guildQueue.guildId);
    return;
  }

  const song = guildQueue.songs[0];

  try {
    const stream = await getAudioStream(song.url);
    const resource = createAudioResource(stream, {
      inputType: StreamType.Raw,
      inlineVolume: true,
    });

    resource.volume.setVolume(guildQueue.volume / 100);
    guildQueue.resource = resource;
    guildQueue.player.play(resource);

    guildQueue.player.once(AudioPlayerStatus.Idle, () => {
      if (guildQueue.repeatMode === 'one') {

        playNext(guildQueue, musicQueue);
      } else if (guildQueue.repeatMode === 'all') {

        guildQueue.songs.push(guildQueue.songs.shift());
        playNext(guildQueue, musicQueue);
      } else {

        guildQueue.songs.shift();
        playNext(guildQueue, musicQueue);
      }
    });

    if (guildQueue.textChannel) {
      const repeatIcon = guildQueue.repeatMode === 'one' ? ' 🔁' : guildQueue.repeatMode === 'all' ? ' 🔂' : '';
      guildQueue.textChannel.send(
        `▶️ **再生中:** ${song.title}${repeatIcon}\n🕐 ${formatDuration(song.duration)} | リクエスト: ${song.requester}`
      );
    }
  } catch (err) {
    console.error('再生エラー:', err);
    if (guildQueue.textChannel) {
      guildQueue.textChannel.send(`❌ 再生エラー: ${song.title} をスキップします`);
    }
    guildQueue.songs.shift();
    playNext(guildQueue, musicQueue);
  }
}

function formatDuration(seconds) {
  if (!seconds) return '不明';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function createPlayer() {
  return createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
  });
}

module.exports = { getVideoInfo, playNext, createPlayer, formatDuration };