/**
 * ContextStateTracker.js
 * Master Architect: Copilot (Phase 21 Canon Specification)
 * ES Module Export
 */

class ContextStateTracker {
    constructor() {
        this.sessions = new Map();
    }

    getSession(sessionId) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {
                sessionId,
                isWarm: false,
                primedSlots: new Set(),
                slotHashes: new Map(),
                lastUpdated: new Date().toISOString()
            });
        }
        return this.sessions.get(sessionId);
    }

    markPrimed(sessionId, slot, hash) {
        const sess = this.getSession(sessionId);
        sess.primedSlots.add(slot);
        sess.slotHashes.set(slot, hash);
        sess.lastUpdated = new Date().toISOString();
        if (sess.primedSlots.size >= 49) {
            sess.isWarm = true;
        }
    }

    resetSession(sessionId) {
        this.sessions.delete(sessionId);
    }

    getUnchangedSlots(sessionId, currentTickets = []) {
        const sess = this.getSession(sessionId);
        const unchanged = [];
        for (let s = 1; s <= 49; s++) {
            const ticket = currentTickets[s - 1];
            const storedHash = sess.slotHashes.get(s);
            if (storedHash && ticket && ticket.hash === storedHash) {
                unchanged.push(s);
            }
        }
        return unchanged;
    }
}

export default ContextStateTracker;
