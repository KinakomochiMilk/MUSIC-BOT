
YouTubeの曲をDiscordのボイスチャンネルで再生できる音楽ボットです。

## コマンド一覧

| コマンド | 説明 |
|---|---|
| `/play <URLまたはキーワード>` | YouTubeのURLまたはキーワードで検索して再生 |
| `/pause` | 一時停止 |
| `/resume` | 再開 |
| `/skip` | 現在の曲をスキップ |
| `/queue` | 再生キューを表示 |
| `/volume <0-100>` | 音量を変更 |
| `/stop` | 再生を停止してボイスチャンネルから退出 |
| `/repeat <mode>` | リピートモードを変更（off / one / all） |

## セットアップ

### 必要なもの

- Node.js v18以上
- yt-dlp
- FFmpeg

### インストール

```bash
npm install
```

### 環境変数

`.env` ファイルを作成して以下を記入：

```
DISCORD_TOKEN=DiscordボットのToken
DISCORD_CLIENT_ID=ボットのClientID
```

### 起動

```bash
npm start
```

## 使用技術

- [discord.js](https://discord.js.org/) v14
- [@discordjs/voice](https://github.com/discordjs/voice)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- FFmpeg