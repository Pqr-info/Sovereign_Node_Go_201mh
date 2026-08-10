/**
 * stadium_chatter.js
 * A Pub/Sub listener that pipes raw gossip from the 5D Mesh into the CLI
 * for real-time "tuning in."
 */

class StadiumChatter {
  constructor() {
    this.listeners = [];
    this.isListening = false;
  }

  startListening() {
    this.isListening = true;
    console.log("[Stadium Chatter] Tuning in to the Sovereign Mesh 5D Great Chorus...");
    
    // Simulate incoming mesh gossip streams
    this.timer = setInterval(() => {
      if (this.isListening) {
        const shards = ["Shard-42", "Shard-9", "Sector-12", "Dampener-Prime"];
        const shard = shards[Math.floor(Math.random() * shards.length)];
        const gossip = `[${shard}] Gossip Node ${Math.floor(Math.random()*1000)} reported state diff. Tensor flux stable.`;
        this.emit(gossip);
      }
    }, 3000);
  }

  stopListening() {
    this.isListening = false;
    clearInterval(this.timer);
    console.log("[Stadium Chatter] Tuned out.");
  }

  onMessage(callback) {
    this.listeners.push(callback);
  }

  emit(message) {
    this.listeners.forEach(cb => cb(message));
  }
}

module.exports = { StadiumChatter };
