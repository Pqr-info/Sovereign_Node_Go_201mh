use serde::Serialize;
use chrono::Utc;
use sqlx::{Pool, Postgres};

use crate::substrate::evolution::Corridor;
use crate::agents::pantheon::PantheonEntity;
use crate::runtime::state::SovereignState;
use crate::sidecars::health::mesh_health_sidecar::MeshHealth;
use crate::runtime::lens::LensMode;

#[derive(Serialize)]
pub struct MeshSnapshot {
    pub timestamp: String,
    pub state: String,
    pub lens_mode: String,
    pub corridor_count: usize,
    pub pantheon_count: usize,
    pub health: MeshHealth,
}

pub struct MeshPersistenceLayer {
    pub db: Pool<Postgres>,
}

impl MeshPersistenceLayer {
    pub fn new(db: Pool<Postgres>) -> Self {
        Self { db }
    }

    pub async fn persist_snapshot(
        &self,
        state: SovereignState,
        lens: LensMode,
        corridors: &[Corridor],
        pantheon: &[PantheonEntity],
        health: &MeshHealth,
    ) {
        let snapshot = MeshSnapshot {
            timestamp: Utc::now().to_rfc3339(),
            state: format!("{:?}", state),
            lens_mode: format!("{:?}", lens),
            corridor_count: corridors.len(),
            pantheon_count: pantheon.len(),
            health: health.clone(),
        };

        let _ = sqlx::query!(
            r#"
            INSERT INTO mesh_snapshots (
                timestamp,
                state,
                lens_mode,
                corridor_count,
                pantheon_count,
                corridor_stress,
                coherence_index,
                lineage_stability,
                symbolic_density,
                state_stability,
                warnings
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            "#,
            snapshot.timestamp,
            snapshot.state,
            snapshot.lens_mode,
            snapshot.corridor_count as i32,
            snapshot.pantheon_count as i32,
            snapshot.health.corridor_stress,
            snapshot.health.coherence_index,
            snapshot.health.lineage_stability,
            snapshot.health.symbolic_density,
            snapshot.health.state_stability,
            snapshot.health.warnings.join(", ")
        )
        .execute(&self.db)
        .await;
    }

    pub async fn persist_state_transition(
        &self,
        from: SovereignState,
        to: SovereignState,
    ) {
        let _ = sqlx::query!(
            r#"
            INSERT INTO state_transitions (
                timestamp,
                from_state,
                to_state
            )
            VALUES ($1,$2,$3)
            "#,
            Utc::now().to_rfc3339(),
            format!("{:?}", from),
            format!("{:?}", to)
        )
        .execute(&self.db)
        .await;
    }

    pub async fn persist_lineage(
        &self,
        pantheon: &[PantheonEntity],
    ) {
        for p in pantheon {
            let _ = sqlx::query!(
                r#"
                INSERT INTO pantheon_lineage (
                    timestamp,
                    entity_id,
                    role,
                    domain,
                    lineage
                )
                VALUES ($1,$2,$3,$4,$5)
                "#,
                Utc::now().to_rfc3339(),
                hex::encode(&p.id),
                p.role,
                p.domain,
                hex::encode(&p.lineage)
            )
            .execute(&self.db)
            .await;
        }
    }
}
