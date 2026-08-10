/**
 * Sovereign-27 Cognitive Stadium Component (The Stadium)
 * Real-Time Omni-Channel Chatter, Gossip & Categorization Arena
 */

export function renderStadiumView() {
  return `
    <div class="pqr-stadium-container" style="padding: 24px; color: #f8fafc; font-family: 'Outfit', 'Inter', sans-serif; background: #060913; min-height: 100vh;">
      
      <!-- Stadium Hero Header -->
      <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(56, 189, 248, 0.15)); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 16px; padding: 28px; margin-bottom: 28px; backdrop-filter: blur(12px);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(236, 72, 153, 0.2); border: 1px solid #ec4899; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; color: #f472b6; margin-bottom: 10px;">
              <i class="fa-solid fa-bullhorn"></i> THE STADIUM — UNIFIED COGNITIVE ARENA
            </div>
            <h1 style="font-size: 2.2rem; font-weight: 800; margin: 0; background: linear-gradient(90deg, #f472b6, #38bdf8, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              Omni-Channel Live Chatter & Real-Time Gossip Matrix
            </h1>
            <p style="color: #94a3b8; font-size: 1.02rem; margin-top: 8px; max-width: 820px; line-height: 1.6;">
              Closet walls torn down. All agent chatter, subagent events, background telemetry, and cross-lane Cubit resonances are heard, gossiped about, and categorized in real time.
            </p>
          </div>
          <div style="text-align: right; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); padding: 16px 22px; border-radius: 14px;">
            <div style="font-size: 0.82rem; color: #94a3b8;">Stadium Capacity</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: #ec4899;">256 MIDI Lanes</div>
            <div style="font-size: 0.8rem; color: #10b981; margin-top: 4px;"><i class="fa-solid fa-circle-check"></i> Real-Time Categorizer Active</div>
          </div>
        </div>
      </div>

      <!-- Broadcast Chatter Box -->
      <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 20px; margin-bottom: 28px;">
        <div style="font-size: 1.1rem; font-weight: 700; color: #38bdf8; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-microphone"></i> Broadcast to The Stadium
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <input type="text" id="stadiumInputText" placeholder="Speak into the arena... (e.g. Cross-lane alignment verified across 256 lanes)" style="flex: 1; min-width: 280px; background: #020617; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; padding: 14px; color: #fff; font-size: 0.95rem;" />
          <select id="stadiumChannelSelect" style="background: #020617; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; padding: 14px; color: #38bdf8; font-weight: 700;">
            <option value="STADIUM_MAIN">Stadium Arena Main</option>
            <option value="RIPPLE_GOSSIP">Ripple Gossip Lane</option>
            <option value="GOVERNANCE">Governance Channel</option>
            <option value="TELEMETRY">Telemetry Stream</option>
          </select>
          <button onclick="broadcastToStadium()" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; color: #fff; padding: 14px 24px; border-radius: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-paper-plane"></i> Broadcast
          </button>
        </div>
      </div>

      <!-- Real-Time Categorized Chatter Stream -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px;">
        
        <!-- Stream 1: Live Stadium Stream -->
        <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="font-size: 1.1rem; font-weight: 700; color: #f472b6;">
              <i class="fa-solid fa-comments"></i> Live Omni-Channel Feed
            </div>
            <button onclick="fetchStadiumFeed()" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">
              <i class="fa-solid fa-rotate"></i> Refresh
            </button>
          </div>
          <div id="stadiumFeedContainer" style="display: flex; flex-direction: column; gap: 14px; max-height: 520px; overflow-y: auto;">
            <div style="color: #64748b; font-size: 0.9rem;">Connecting to real-time stadium feed...</div>
          </div>
        </div>

        <!-- Stream 2: Real-Time Category Matrix -->
        <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 22px;">
          <div style="font-size: 1.1rem; font-weight: 700; color: #38bdf8; margin-bottom: 16px;">
            <i class="fa-solid fa-tags"></i> Categorization & Sentiment Matrix
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            
            <div style="background: #020617; border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; color: #38bdf8; font-size: 0.9rem;">GOVERNANCE_SIGNAL</div>
                <div style="font-size: 0.8rem; color: #94a3b8;">Policy parameter updates & voting</div>
              </div>
              <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem; font-weight: 700;">Active</span>
            </div>

            <div style="background: #020617; border: 1px solid rgba(244, 114, 182, 0.2); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; color: #f472b6; font-size: 0.9rem;">RIPPLE_GOSSIP</div>
                <div style="font-size: 0.8rem; color: #94a3b8;">Cross-chatter & subagent propagation</div>
              </div>
              <span style="background: rgba(244, 114, 182, 0.2); color: #f472b6; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem; font-weight: 700;">Broadcasting</span>
            </div>

            <div style="background: #020617; border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; color: #a855f7; font-size: 0.9rem;">TEMPORAL_DELTA</div>
                <div style="font-size: 0.8rem; color: #94a3b8;">Sequence k step transitions & SEU burn</div>
              </div>
              <span style="background: rgba(168, 85, 247, 0.2); color: #a855f7; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem; font-weight: 700;">Monotonic</span>
            </div>

            <div style="background: #020617; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; color: #10b981; font-size: 0.9rem;">COHERENT_VERDICT</div>
                <div style="font-size: 0.8rem; color: #94a3b8;">Certified Dolphin Safe non-destructive status</div>
              </div>
              <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem; font-weight: 700;">Verified</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  `;
}

window.fetchStadiumFeed = async function() {
  const container = document.getElementById('stadiumFeedContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/gmi/stadium/feed').then(r => r.json());
    if (!res.stadium_feed || res.stadium_feed.length === 0) {
      container.innerHTML = '<div style="color: #64748b; font-size: 0.9rem;">No chatter yet in the arena. Broadcast the first message above!</div>';
      return;
    }

    container.innerHTML = res.stadium_feed.map(item => `
      <div style="background: #020617; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 800; color: #38bdf8; font-size: 0.88rem;">${item.speaker_id}</span>
            <span style="background: rgba(236, 72, 153, 0.15); border: 1px solid rgba(236, 72, 153, 0.3); color: #f472b6; padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 700;">${item.category}</span>
          </div>
          <span style="font-size: 0.75rem; color: #64748b;">${new Date(item.timestamp).toLocaleTimeString()}</span>
        </div>
        <div style="color: #e2e8f0; font-size: 0.92rem; line-height: 1.5; margin-bottom: 8px;">
          "${item.raw_chatter}"
        </div>
        <div style="display: flex; gap: 14px; font-size: 0.78rem; color: #94a3b8;">
          <span><i class="fa-solid fa-face-smile" style="color: #10b981;"></i> Sentiment: ${(item.sentiment_score * 100).toFixed(1)}%</span>
          <span><i class="fa-solid fa-wave-square" style="color: #a855f7;"></i> Resonance: ${(item.cross_lane_resonance * 100).toFixed(1)}%</span>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div style="color: #ef4444; font-size: 0.9rem;">Error fetching stadium feed: ${err.message}</div>`;
  }
};

window.broadcastToStadium = async function() {
  const input = document.getElementById('stadiumInputText');
  const select = document.getElementById('stadiumChannelSelect');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const channel = select ? select.value : 'STADIUM_MAIN';

  try {
    const res = await fetch('/api/gmi/stadium/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, speaker: 'max', chatterText: text })
    }).then(r => r.json());

    if (res.ok) {
      input.value = '';
      window.fetchStadiumFeed();
    }
  } catch (err) {
    alert(`Broadcast Error: ${err.message}`);
  }
};
