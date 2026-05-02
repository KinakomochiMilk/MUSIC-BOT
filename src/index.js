const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { registerCommands } = require('./deploy-commands');
const musicQueue = require('./musicQueue');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

const commands = [
  require('./commands/play'),
  require('./commands/pause'),
  require('./commands/resume'),
  require('./commands/skip'),
  require('./commands/queue'),
  require('./commands/volume'),
  require('./commands/stop'),
  require('./commands/repeat'),
];

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`✅ ログイン成功: ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, musicQueue);
  } catch (error) {
    console.error(error);
    const msg = { content: '❌ コマンドの実行中にエラーが発生しました。', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg);
    } else {
      await interaction.reply(msg);
    }
  }
});

(async () => {
  await registerCommands(commands);
  client.login(process.env.DISCORD_TOKEN);
})();