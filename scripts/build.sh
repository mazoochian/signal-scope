#!/usr/bin/env bash
# Build Docker images for signal-scope-db, signal-scope-api, and signal-scope-fe.
# Usage: ./scripts/build.sh [--no-cache]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NO_CACHE=""
if [[ "${1:-}" == "--no-cache" ]]; then
  NO_CACHE="--no-cache"
  echo "[build] Cache disabled"
fi

# Load .env if present (for NEXT_PUBLIC_API_URL etc.)
if [[ -f .env ]]; then
  set -a; source .env; set +a
fi

echo "[build] Building signal-scope-db ..."
docker build $NO_CACHE \
  -t signal-scope-db:latest \
  -f signal-scope-db/Dockerfile \
  signal-scope-db/

echo "[build] Building signal-scope-api ..."
docker build $NO_CACHE \
  -t signal-scope-api:latest \
  -f signal-scope-be/Dockerfile \
  signal-scope-be/

echo "[build] Building signal-scope-fe ..."
docker build $NO_CACHE \
  --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:4000}" \
  -t signal-scope-fe:latest \
  -f signal-scope-fe/Dockerfile \
  signal-scope-fe/

echo "[build] Done."
docker images | grep "signal-scope" || true
