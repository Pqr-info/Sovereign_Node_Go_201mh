use serde::{Serialize, Deserialize};
use std::time::{SystemTime, UNIX_EPOCH, Instant};
use std::thread;
use std::sync::Arc;

#[derive(Serialize, Deserialize)]
struct TemporalMarker {
    id: String,
    track_id: u32,
    tick: u64,
    created_at: i64,
    echo_cycle: u32,
    stability: i32,
}

#[derive(Serialize)]
struct BenchResult {
    language: String,
    total_events: usize,
    duration_sec: f64,
    events_per_sec: f64,
    routines: usize,
    logical_threads: usize,
}

fn simulate_teleport_to_global_brain(marker: &TemporalMarker) -> Vec<u8> {
    serde_json::to_vec(marker).unwrap()
}

fn main() {
    println!("Sovereign-27 JetWeb Time Machine Benchmark (Rust)");

    let routines = 2048;
    let events_per_routine = 10000;
    let total_events = routines * events_per_routine;

    let start = Instant::now();

    let mut handles = vec![];

    for i in 0..routines {
        let handle = thread::spawn(move || {
            for j in 0..events_per_routine {
                let marker = TemporalMarker {
                    id: "b8c62b53-46cf-4c4f-9e79-509a2e6f49f4".to_string(),
                    track_id: i as u32,
                    tick: j as u64,
                    created_at: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as i64,
                    echo_cycle: (j % 7) as u32,
                    stability: 1, // STABLE
                };
                let _ = simulate_teleport_to_global_brain(&marker);
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let duration = start.elapsed().as_secs_f64();

    let result = BenchResult {
        language: "Rust".to_string(),
        total_events,
        duration_sec: duration,
        events_per_sec: (total_events as f64) / duration,
        routines,
        logical_threads: std::thread::available_parallelism().unwrap().get(),
    };

    let res_bytes = serde_json::to_string_pretty(&result).unwrap();
    println!("{}", res_bytes);

    std::fs::write("rust_bench_result.json", res_bytes).expect("Unable to write file");
}
