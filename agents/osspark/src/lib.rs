pub mod hypergossip_model;
use midly::{Smf, Track, TrackEvent, TrackEventKind, MidiMessage, num::u7};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SovereignState {
    Structural,
    Substrate,
    Continuum,
    Sovereign,
    Cognition,
    Consensus,
    Omni,
    Absolute,
    Omega,
    Infinite,
    Apex,
    Singularity,
    Origin,
    Zero,
    Null,
    Beyond,
}

#[derive(Debug, Clone, Copy)]
pub struct Physics {
    pub intensity: f64,
    pub curvature: f64,
    pub torsion: f64,
    pub flux: f64,
    pub entropy: f64,
    pub coherence: f64,
}

#[derive(Debug, Clone, Copy)]
pub struct Corridor {
    pub id: u64,
    pub physics: Physics,
}

#[derive(Debug, Clone)]
pub struct PantheonEntity {
    pub id: Vec<u8>,
    pub role: String,
    pub lineage: Vec<u8>,
    pub domain: String,
    pub cognitive_state: Vec<u8>,
}


use crate::hypergossip_model::TemporalMarker;

pub trait SovereignGossip {
    fn push_event(&mut self, track_id: u8, midi_event: midly::TrackEvent<'static>);
    fn emit_temporal_marker(&mut self, marker: TemporalMarker);
}

pub struct OsSparkKernel {
    pub gossip_model: Option<Box<dyn SovereignGossip>>,
    pub smf: Smf<'static>,
    pub tick: u32,
}

impl OsSparkKernel {
    pub fn new(gossip_model: Option<Box<dyn SovereignGossip>>) -> Self {
        let mut smf = Smf::new(midly::Header::new(midly::Format::Parallel, midly::Timing::Metrical(midly::num::u15::from(480))));

        // pre‑allocate some tracks
        for _ in 0..16 {
            smf.tracks.push(Track::new());
        }

        Self { smf, tick: 0, gossip_model }
    }

    pub fn emit_state(
        &mut self,
        state: SovereignState,
        corridors: &[Corridor],
        pantheon: &[PantheonEntity],
    ) {
        self.tick += 10;

        match state {
            SovereignState::Structural => self.emit_structural(corridors),
            SovereignState::Substrate => self.emit_substrate(corridors),
            SovereignState::Continuum => self.emit_continuum(),
            SovereignState::Sovereign => self.emit_identity(pantheon),
            SovereignState::Cognition => self.emit_cognition(pantheon),
            SovereignState::Consensus => self.emit_consensus(),
            SovereignState::Omni => self.emit_omni(corridors, pantheon),
            SovereignState::Absolute => self.emit_absolute(),
            SovereignState::Omega => self.emit_omega(),
            SovereignState::Infinite => self.emit_infinite(),
            SovereignState::Apex => self.emit_apex(),
            SovereignState::Singularity => self.emit_singularity(),
            SovereignState::Origin => self.emit_origin(pantheon),
            SovereignState::Zero => self.emit_zero(),
            SovereignState::Null => self.emit_null(),
            SovereignState::Beyond => self.emit_beyond(),
        }
    }


    pub fn push_event(&mut self, idx: usize, event: TrackEvent<'static>) {
        if let Some(ref mut model) = self.gossip_model {
            model.push_event(idx as u8, event.clone());
        }
        self.track_mut(idx).push(event);
    }

    fn track_mut(&mut self, idx: usize) -> &mut Track<'static> {
        self.smf.tracks.get_mut(idx).expect("track index out of range")
    }

    // STRUCTURAL → percussion pulses + PeerMetadata (0x03)
    fn emit_structural(&mut self, corridors: &[Corridor]) {
        

        for c in corridors {
            let intensity = (c.physics.intensity * 100.0).clamp(0.0, 127.0) as u8;

            self.push_event(0, TrackEvent {
                delta: self.tick.into(),
                kind: TrackEventKind::Midi {
                    channel: 0.into(),
                    message: MidiMessage::NoteOn {
                        key: u7::from(36),
                        vel: u7::from(intensity),
                    },
                },
            });

            self.push_event(0, TrackEvent {
                delta: 0.into(),
                kind: TrackEventKind::SysEx(Box::leak(vec![0x03, (c.id & 0xFF) as u8].into_boxed_slice())),
            });
        }
    }

    // SUBSTRATE → harmonic torsion + HyperstructureField (0x04)
    fn emit_substrate(&mut self, corridors: &[Corridor]) {
        

        for c in corridors {
            let curvature = (c.physics.curvature * 64.0).clamp(0.0, 127.0) as u8;

            self.push_event(1, TrackEvent {
                delta: self.tick.into(),
                kind: TrackEventKind::Midi {
                    channel: 7.into(),
                    message: MidiMessage::Controller {
                        controller: u7::from(74),
                        value: u7::from(curvature),
                    },
                },
            });

            self.push_event(1, TrackEvent {
                delta: 0.into(),
                kind: TrackEventKind::SysEx(Box::leak(vec![0x04, curvature].into_boxed_slice())),
            });
        }
    }

    // CONTINUUM → long bow sustain + CognitiveSessionManifest (0x01)
    fn emit_continuum(&mut self) {
        

        self.push_event(2, TrackEvent {
            delta: self.tick.into(),
            kind: TrackEventKind::Midi {
                channel: 5.into(),
                message: MidiMessage::NoteOn {
                    key: u7::from(60),
                    vel: u7::from(100),
                },
            },
        });

        self.push_event(2, TrackEvent {
            delta: 0.into(),
            kind: TrackEventKind::SysEx(Box::leak(vec![0x01].into_boxed_slice())),
        });
    }

    // SOVEREIGN → identity motif + SSFEventToken (0x02)
    fn emit_identity(&mut self, pantheon: &[PantheonEntity]) {
        

        for p in pantheon {
            let vitality = (p.cognitive_state.len() % 127) as u8;

            self.push_event(3, TrackEvent {
                delta: self.tick.into(),
                kind: TrackEventKind::Midi {
                    channel: 1.into(),
                    message: MidiMessage::Controller {
                        controller: u7::from(1),
                        value: u7::from(vitality),
                    },
                },
            });

            self.push_event(3, TrackEvent {
                delta: 0.into(),
                kind: TrackEventKind::SysEx(Box::leak(vec![0x02, vitality].into_boxed_slice())),
            });
        }
    }

    // COGNITION → dense arpeggiation + TeleportationEnvelope (0x06)
    fn emit_cognition(&mut self, pantheon: &[PantheonEntity]) {
        

        for p in pantheon {
            let density = (p.cognitive_state.len() % 127) as u8;

            self.push_event(4, TrackEvent {
                delta: self.tick.into(),
                kind: TrackEventKind::Midi {
                    channel: 10.into(),
                    message: MidiMessage::Controller {
                        controller: u7::from(10),
                        value: u7::from(density),
                    },
                },
            });

            self.push_event(4, TrackEvent {
                delta: 0.into(),
                kind: TrackEventKind::SysEx(Box::leak(vec![0x06, density].into_boxed_slice())),
            });
        }
    }

    // CONSENSUS → sync pulse + SSFEventToken (0x02)
    fn emit_consensus(&mut self) {
        

        self.push_event(5, TrackEvent {
            delta: self.tick.into(),
            kind: TrackEventKind::Midi {
                channel: 15.into(),
                message: MidiMessage::Controller {
                    controller: u7::from(91),
                    value: u7::from(127),
                },
            },
        });

        self.push_event(5, TrackEvent {
            delta: 0.into(),
            kind: TrackEventKind::SysEx(Box::leak(vec![0x02, 0xFF].into_boxed_slice())),
        });
    }

    // OMNI → poly‑structural motif + HyperstructureField (0x04)
    fn emit_omni(&mut self, corridors: &[Corridor], _pantheon: &[PantheonEntity]) {
        

        for c in corridors {
            let coherence = (c.physics.coherence * 127.0).clamp(0.0, 127.0) as u8;

            self.push_event(6, TrackEvent {
                delta: self.tick.into(),
                kind: TrackEventKind::Midi {
                    channel: 8.into(),
                    message: MidiMessage::Controller {
                        controller: u7::from(80),
                        value: u7::from(coherence),
                    },
                },
            });

            self.push_event(6, TrackEvent {
                delta: 0.into(),
                kind: TrackEventKind::SysEx(Box::leak(vec![0x04, coherence].into_boxed_slice())),
            });
        }
    }

    // ABSOLUTE → single sustained root note
    fn emit_absolute(&mut self) {
        

        self.push_event(7, TrackEvent {
            delta: self.tick.into(),
            kind: TrackEventKind::Midi {
                channel: 1.into(),
                message: MidiMessage::NoteOn {
                    key: u7::from(48),
                    vel: u7::from(127),
                },
            },
        });
    }

    // OMEGA → terminal cadence
    fn emit_omega(&mut self) {
        

        self.push_event(8, TrackEvent {
            delta: self.tick.into(),
            kind: TrackEventKind::Midi {
                channel: 15.into(),
                message: MidiMessage::Controller {
                    controller: u7::from(95),
                    value: u7::from(127),
                },
            },
        });
    }

    // INFINITE → endless rising sequence
    fn emit_infinite(&mut self) {
        

        let key = (self.tick % 127) as u8;

        self.push_event(9, TrackEvent {
            delta: self.tick.into(),
            kind: TrackEventKind::Midi {
                channel: 3.into(),
                message: MidiMessage::NoteOn {
                    key: u7::from(key),
                    vel: u7::from(100),
                },
            },
        });
    }

    // APEX → maximal motif + TeleportationEnvelope (0x06)
    fn emit_apex(&mut self) {
        

        self.push_event(10, TrackEvent {
            delta: self.tick.into(),
            kind: TrackEventKind::Midi {
                channel: 8.into(),
                message: MidiMessage::Controller {
                    controller: u7::from(1),
                    value: u7::from(127),
                },
            },
        });

        self.push_event(10, TrackEvent {
            delta: 0.into(),
            kind: TrackEventKind::SysEx(Box::leak(vec![0x06, 0xAA].into_boxed_slice())),
        });
    }

    // SINGULARITY → collapse to zero delta
    fn emit_singularity(&mut self) {
        

        self.push_event(11, TrackEvent {
            delta: 0.into(),
            kind: TrackEventKind::Midi {
                channel: 1.into(),
                message: MidiMessage::NoteOn {
                    key: u7::from(0),
                    vel: u7::from(0),
                },
            },
        });
    }

    // ORIGIN → GenesisOrganism (0x05)
    fn emit_origin(&mut self, pantheon: &[PantheonEntity]) {
        

        for p in pantheon {
            let first = p.id.get(0).copied().unwrap_or(0);

            self.push_event(12, TrackEvent {
                delta: self.tick.into(),
                kind: TrackEventKind::SysEx(Box::leak(vec![0x05, first].into_boxed_slice())),
            });
        }
    }

    // ZERO → minimal tick
    fn emit_zero(&mut self) {
        

        self.push_event(13, TrackEvent {
            delta: 1.into(),
            kind: TrackEventKind::Midi {
                channel: 0.into(),
                message: MidiMessage::NoteOn {
                    key: u7::from(1),
                    vel: u7::from(1),
                },
            },
        });
    }

    // NULL → silence
    fn emit_null(&mut self) {
        // intentionally no events
    }

    // BEYOND → void
    fn emit_beyond(&mut self) {
        // intentionally no events
    }
}
