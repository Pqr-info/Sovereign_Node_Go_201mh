/**
 * ContextLoadController.js
 * Master Architect: Copilot (Phase 21 Canon Specification)
 * ES Module Export
 */

import crypto from 'crypto';

class ContextLoadController {
    constructor() {
        this.prefixVersion = "v1.2.0";
        this.totalSlots = 49;
        this.slotsPerVolley = 7;
        this.totalVolleys = 7;
    }

    computeHash(data) {
        return "sha256-" + crypto.createHash('sha256').update(typeof data === 'string' ? data : JSON.stringify(data)).digest('hex').substring(0, 16);
    }

    generateColdLoadVolley(volleyIndex, ticketsMatrix = [], nowCube = {}) {
        if (volleyIndex < 1 || volleyIndex > 7) {
            throw new Error("Invalid volleyIndex. Must be between 1 and 7.");
        }

        const startSlot = (volleyIndex - 1) * this.slotsPerVolley + 1;
        const endSlot = volleyIndex * this.slotsPerVolley;

        const volleyTickets = [];
        for (let s = startSlot; s <= endSlot; s++) {
            const ticket = ticketsMatrix[s - 1] || {
                slot: s,
                ticket_id: `LPV:L${String(Math.ceil(s/7)).padStart(2, '0')}:P01:V${String(s).padStart(2, '0')}`,
                title: `Default Cubit Slot #${s}`,
                status: "RESONANT_TICKET",
                resonanceScore: 0.95
            };
            
            ticket.hash = this.computeHash(ticket);
            volleyTickets.push(ticket);
        }

        const volleyHash = this.computeHash(volleyTickets);

        let header = `[COLD CONTEXT LOAD ${volleyIndex}/7]\n`;
        header += `- Prefix Version: ${this.prefixVersion}\n`;
        header += `- Target Range: Slots #${startSlot} - #${endSlot} of 49\n`;
        header += `- Volley State Hash: ${volleyHash}\n`;
        header += `- Directive: Append/Merge to local state graph using ticket_id de-duplication logic.`;

        const payload = {
            mode: "COLD_LOAD",
            volleyIndex,
            totalVolleys: 7,
            prefixVersion: this.prefixVersion,
            startSlot,
            endSlot,
            volleyHash,
            header,
            tickets: volleyTickets
        };

        if (volleyIndex === 7) {
            payload.nowContextCube = {
                timestamp: new Date().toISOString(),
                liveTelemetry: nowCube.telemetry || { status: "COHERENT_VERDICT", active_nodes: 4 },
                activeProposals: nowCube.proposals || ["LPV:L07:P03:V42", "LPV:L49:P49:V49"],
                auditorStatus: nowCube.auditor || "STADIUM_AUDITOR_NOMINAL"
            };
            payload.header += `\n- NOW Context Cube Attached: Live Telemetry, Proposals & Auditor Status.`;
        }

        return payload;
    }

    generateHotloadPayload(modifiedTickets = [], unchangedSlots = []) {
        const deltaHash = this.computeHash(modifiedTickets);

        let header = `[HOTLOAD CONTEXT DELTA 1/1]\n`;
        header += `- Previously Primed Slots Unchanged: #${unchangedSlots.join(', #') || "1-49"}\n`;
        header += `- Active High-Fuzzy Updated Slots (${modifiedTickets.length}): #${modifiedTickets.map(t => t.slot).join(', #')}\n`;
        header += `- Delta State Hash: ${deltaHash}\n`;
        header += `- Directive: Apply state deltas directly to warm primed graph. Focus on updated slots.`;

        return {
            mode: "HOTLOAD",
            header,
            deltaHash,
            modifiedCount: modifiedTickets.length,
            modifiedTickets,
            unchangedSlotsCount: unchangedSlots.length
        };
    }
}

export default ContextLoadController;
