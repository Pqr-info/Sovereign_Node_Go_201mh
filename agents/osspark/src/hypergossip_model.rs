use crate::SovereignGossip;
use midly::TrackEvent;
use std::sync::mpsc::Sender;

#[derive(Clone, Debug)]
pub struct TemporalMarker {
    pub id: uuid::Uuid,
    pub track_id: u8,
    pub tick: u64,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub echo_cycle: u32,
}

#[derive(Clone, Debug, PartialEq)]
pub enum TemporalStability {
    Stable,
    Chaotic,
    Metastable,
}

pub struct Clock {
    pub current_tick: u64,
}

impl Clock {
    pub fn current_tick(&self) -> u64 {
        self.current_tick
    }
}

pub struct HyperGossipModel {
    pub enabled: bool,
    pub echo_cycle: u32,
    pub clock: Clock,
    pub buffer: Vec<(u8, TrackEvent<'static>, TemporalMarker)>,
    pub time_machine_tx: Sender<TemporalMarker>,
}

impl HyperGossipModel {
    pub fn new(time_machine_tx: Sender<TemporalMarker>) -> Self {
        Self {
            enabled: true,
            echo_cycle: 0,
            clock: Clock { current_tick: 0 },
            buffer: Vec::new(),
            time_machine_tx,
        }
    }
}

impl SovereignGossip for HyperGossipModel {
    fn push_event(&mut self, track_id: u8, midi_event: TrackEvent<'static>) {
        if !self.enabled {
            return;
        }

        let marker = TemporalMarker {
            id: uuid::Uuid::new_v4(),
            track_id,
            tick: self.clock.current_tick(),
            created_at: chrono::Utc::now(),
            echo_cycle: self.echo_cycle,
        };

        self.buffer.push((track_id, midi_event, marker.clone()));
        self.emit_temporal_marker(marker);
    }

    fn emit_temporal_marker(&mut self, marker: TemporalMarker) {
        let _ = self.time_machine_tx.send(marker);
    }
}
