#!/usr/bin/env bash
# Deploy signal-scope using Docker Compose.
# Usage: ./scripts/deploy.sh [--build] [--pull]
#   --build   rebuild images before deploying
#   --pull    git pull before deploying (requires a git remote)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BUILD=false
PULL=false
for arg in "$@"; do
  case "$arg" in
    --build) BUILD=true ;;
    --pull)  PULL=true ;;
  esac
done

# ── Pre-flight checks ─────────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  echo "Error: docker is not installed." >&2; exit 1
fi
if ! docker compose version &>/dev/null; then
  echo "Error: docker compose (v2) is not available." >&2; exit 1
fi

# ── Optional git pull ─────────────────────────────────────────────────────────
if [[ "$PULL" == true ]]; then
  echo "[deploy] Pulling latest code ..."
  git pull --ff-only
fi

# ── Load env ──────────────────────────────────────────────────────────────────
if [[ ! -f .env ]]; then
  echo "[deploy] No .env found — copying .env.example as .env"
  cp .env.example .env
fi
set -a; source .env; set +a

# ── Build images ──────────────────────────────────────────────────────────────
if [[ "$BUILD" == true ]]; then
  echo "[deploy] Building images ..."
  bash "$ROOT/scripts/build.sh"
fi

# ── Deploy ────────────────────────────────────────────────────────────────────
echo "[deploy] Starting services ..."
docker compose up -d --remove-orphans

echo "[deploy] Waiting for health checks ..."
sleep 5

echo "[deploy] Status:"
docker compose ps

echo ""
echo "[deploy] Done. Frontend → http://localhost:${FE_PORT:-3000}"
echo "         API      → http://localhost:${API_PORT:-4000}"
