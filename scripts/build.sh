#!/usr/bin/env bash
# Build Docker images for signal-scope-db, signal-scope-api, and signal-scope-fe.
# Images are built from their respective GitHub repos via docker compose.
# Usage: ./scripts/build.sh [--no-cache]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NO_CACHE=""
if [[ "${1:-}" == "--no-cache" ]]; then
  NO_CACHE="--no-cache"
  echo "[build] Cache disabled"
fi

# Load .env if present (NEXT_PUBLIC_API_URL etc. are passed as build args via compose)
if [[ -f .env ]]; then
  set -a; source .env; set +a
fi

echo "[build] Building all images via docker compose ..."
docker compose build $NO_CACHE

echo "[build] Done."
docker images | grep "signal-scope" || true
