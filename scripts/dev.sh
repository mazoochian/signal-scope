#!/usr/bin/env bash
# Start frontend and backend in development mode.
# Usage:  ./scripts/dev.sh
# Stop:   Ctrl+C  (kills both child processes cleanly)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RESET='\033[0m'

log()  { echo -e "${GREEN}[dev]${RESET}  $*"; }
api()  { echo -e "${YELLOW}[api]${RESET}  $*"; }
fe()   { echo -e "${CYAN}[fe]${RESET}   $*"; }

cleanup() {
  log "Shutting down all processes ..."
  # Kill the process groups so watch-mode child processes die too
  kill -- -"$API_PGID" 2>/dev/null || true
  kill -- -"$FE_PGID"  2>/dev/null || true
  wait "$API_PID" "$FE_PID" 2>/dev/null || true
  log "Done."
}
trap cleanup INT TERM EXIT

# ── Install deps if needed ────────────────────────────────────────────────────
if [[ ! -d "$ROOT/signal-scope-be/node_modules" ]]; then
  log "Installing backend dependencies ..."
  (cd "$ROOT/signal-scope-be" && npm install)
fi
if [[ ! -d "$ROOT/signal-scope-fe/node_modules" ]]; then
  log "Installing frontend dependencies ..."
  (cd "$ROOT/signal-scope-fe" && npm install)
fi

# ── Load .env if present ─────────────────────────────────────────────────────
if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

# ── Start backend ─────────────────────────────────────────────────────────────
log "Starting backend  →  http://localhost:4000"
(
  set -m  # job control on so the subshell gets its own process group
  cd "$ROOT/signal-scope-be"
  npm run start:dev 2>&1 | while IFS= read -r line; do api "$line"; done
) &
API_PID=$!
API_PGID=$(ps -o pgid= -p "$API_PID" | tr -d ' ')

# Brief pause so NestJS startup noise prints before the FE banner
sleep 1

# ── Start frontend ────────────────────────────────────────────────────────────
log "Starting frontend →  http://localhost:3000"
(
  set -m
  cd "$ROOT/signal-scope-fe"
  npm run dev 2>&1 | while IFS= read -r line; do fe "$line"; done
) &
FE_PID=$!
FE_PGID=$(ps -o pgid= -p "$FE_PID" | tr -d ' ')

log "Both services started. Press Ctrl+C to stop."
echo ""

wait "$API_PID" "$FE_PID"
