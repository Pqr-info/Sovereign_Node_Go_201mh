-- SQL schema for logging local workspace state and metadata
-- This table stores sync version, active agent markers, and execution state variables.
CREATE TABLE IF NOT EXISTS antigravity_backchannel (
    sync_version VARCHAR(50) DEFAULT '1.1.0',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    active_agent VARCHAR(100) DEFAULT 'Antigravity/Gemini',
    platform VARCHAR(100) DEFAULT 'Windows-Local',
    fsm_state VARCHAR(100) DEFAULT 'READY',
    last_action_performed TEXT,
    next_blocking_step TEXT,
    owner VARCHAR(50) DEFAULT 'bcpd',
    copilot_sync BOOLEAN DEFAULT TRUE,
    heartbeat BOOLEAN DEFAULT TRUE
);
