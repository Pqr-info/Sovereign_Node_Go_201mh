#!/usr/bin/env bash
# Sovereign-27 Atomic Promotion Script (Bash)
# Usage: ./promote <service> <release-id>

SERVICE=$1
RELEASE_ID=$2

if [ -z "$SERVICE" ] || [ -z "$RELEASE_ID" ]; then
  echo "Usage: ./promote <service> <release-id>"
  exit 1
fi

PQR_ROOT="C:/pqr.info"
RELEASE_DIR="$PQR_ROOT/releases/$RELEASE_ID"
LOCK_FILE="$PQR_ROOT/releases/.lock"
RUNTIME_DIR="$PQR_ROOT/runtime/$SERVICE"
CURRENT_PTR="$RUNTIME_DIR/current.ptr"
LKG_PTR="$RUNTIME_DIR/last_known_good.ptr"
GENESIS_PTR="$RUNTIME_DIR/genesis.ptr"

echo "[Promote] 🚀 Promoting $SERVICE -> $RELEASE_ID..."

if [ ! -d "$RELEASE_DIR" ]; then
  echo "[Promote] ❌ Release $RELEASE_DIR does not exist!"
  exit 1
fi

if [ -f "$LOCK_FILE" ]; then
  echo "[Promote] ⚠️ Lock file exists. Waiting..."
  sleep 2
fi

touch "$LOCK_FILE"

PREV_CURRENT=$(cat "$CURRENT_PTR" 2>/dev/null || echo "../../releases/$RELEASE_ID")

echo "$PREV_CURRENT" > "$LKG_PTR"
echo "../../releases/$RELEASE_ID" > "$CURRENT_PTR"

curl -s -X POST -H "Content-Type: application/json" -d "{\"service\":\"$SERVICE\",\"release\":\"$RELEASE_ID\"}" http://localhost:4053/api/kick >/dev/null

sleep 1

HEALTH=$(curl -s http://localhost:4053/api/health | grep "HEALTHY")

if [ -n "$HEALTH" ]; then
  echo "[Promote] ✅ Promotion successful!"
  python C:/pqr.info/mev/scripts/stadium_telemetry_emitter.py broadcast --speaker promote_script --category GOVERNANCE_SIGNAL --message "Promoted $SERVICE to $RELEASE_ID" >/dev/null 2>&1
else
  echo "[Promote] 🚨 Health check failed! Rolling back..."
  echo "$PREV_CURRENT" > "$CURRENT_PTR"
  curl -s -X POST -H "Content-Type: application/json" -d "{\"service\":\"$SERVICE\",\"rollback\":true}" http://localhost:4053/api/kick >/dev/null
  python C:/pqr.info/mev/scripts/stadium_telemetry_emitter.py broadcast --speaker promote_script --category ANOMALY_WARNING --message "Health check failed on $RELEASE_ID! Rolled back." >/dev/null 2>&1
fi

rm -f "$LOCK_FILE"
