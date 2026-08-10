const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4080;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'lexicon.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('[-] Error opening database:', err.message);
    } else {
        console.log('[+] Connected to the local SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS terms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            term TEXT NOT NULL,
            abbreviation TEXT NOT NULL,
            definition TEXT NOT NULL,
            category TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('[-] Error creating table:', err.message);
            } else {
                console.log('[+] Table ready.');
                seedDatabase();
            }
        });
    }
});

function seedDatabase() {
    db.get("SELECT COUNT(*) as count FROM terms", (err, row) => {
        if (!err && row.count === 0) {
            const initialTerms = [
                ["Agent Trust Index", "ATI", "Reputation score tracking the reliability and parity alignment of a mesh participant.", "SpaceBook 5D"],
                ["Mesh Cohesion Factor", "MCF", "The density and synchronization stability of local active mesh nodes.", "Sovereign-27"],
                ["Linear Provenance Vector", "LPV", "The cryptographic routing mechanism ensuring determinism across the Swarm Mesh.", "Sovereign-27"],
                ["Starlight Flux", "Flux", "Quantifiable anomaly energy extracted by participants and used for synthesis.", "SpaceBook 5D"]
            ];
            
            const stmt = db.prepare("INSERT INTO terms (term, abbreviation, definition, category) VALUES (?, ?, ?, ?)");
            initialTerms.forEach(t => stmt.run(t));
            stmt.finalize();
            console.log('[+] Seeded initial lexicon terms.');
        }
    });
}

// API Routes
app.get('/api/terms', (req, res) => {
    db.all("SELECT * FROM terms ORDER BY term ASC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/terms', (req, res) => {
    const { term, abbreviation, definition, category } = req.body;
    db.run("INSERT INTO terms (term, abbreviation, definition, category) VALUES (?, ?, ?, ?)",
        [term, abbreviation, definition, category],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, term, abbreviation, definition, category });
        });
});

app.put('/api/terms/:id', (req, res) => {
    const { term, abbreviation, definition, category } = req.body;
    db.run("UPDATE terms SET term = ?, abbreviation = ?, definition = ?, category = ? WHERE id = ?",
        [term, abbreviation, definition, category, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ changes: this.changes });
        });
});

app.delete('/api/terms/:id', (req, res) => {
    db.run("DELETE FROM terms WHERE id = ?", req.params.id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`[+] Sovereign Lexicon Backend running on http://localhost:${PORT}`);
});
