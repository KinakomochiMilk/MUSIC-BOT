const { REST, Routes } = require('discord.js');

async function registerCommands(commands) {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!token || !clientId) {
    console.error('❌ DISCORD_TOKEN または DISCORD_CLIENT_ID が設定されていません。');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(token);
  const commandData = commands.map((c) => c.data.toJSON());

  try {
    console.log('📡 スラッシュコマンドを登録中...');
    await rest.put(Routes.applicationCommands(clientId), { body: commandData });
    console.log('✅ スラッシュコマンドの登録が完了しました！');
  } catch (error) {
    console.error('❌ コマンド登録エラー:', error);
  }
}

module.exports = { registerCommands };