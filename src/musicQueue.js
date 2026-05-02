class MusicQueue {
  constructor() {
    this.queues = new Map();
  }
  get(guildId) { return this.queues.get(guildId); }
  set(guildId, data) { this.queues.set(guildId, data); }
  delete(guildId) { this.queues.delete(guildId); }
  has(guildId) { return this.queues.has(guildId); }
}

module.exports = new MusicQueue();