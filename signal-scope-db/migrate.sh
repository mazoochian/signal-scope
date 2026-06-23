#!/usr/bin/env bash
# Apply all migrations in order to the signalscope database.
# Usage:
#   ./migrate.sh                    # uses DB_* env vars or defaults
#   DB_HOST=prod.db ./migrate.sh    # override host
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-signalscope}"
DB_USER="${DB_USER:-signalscope}"
DB_PASS="${DB_PASS:-signalscope}"

export PGPASSWORD="$DB_PASS"
PSQL="psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"

echo "[migrate] Target: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"

# Create a migrations tracking table if it doesn't exist
$PSQL <<'SQL'
CREATE TABLE IF NOT EXISTS schema_migrations (
  filename   TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
SQL

APPLIED=0
SKIPPED=0

for file in "$SCRIPT_DIR/migrations/"*.sql; do
  name="$(basename "$file")"

  # Check if already applied
  already=$($PSQL -t -c "SELECT COUNT(*) FROM schema_migrations WHERE filename = '$name';" | tr -d ' ')

  if [[ "$already" -gt 0 ]]; then
    echo "[migrate] skip  $name (already applied)"
    ((SKIPPED++))
    continue
  fi

  echo "[migrate] apply $name ..."
  $PSQL -f "$file"
  $PSQL -c "INSERT INTO schema_migrations (filename) VALUES ('$name');"
  ((APPLIED++))
done

echo "[migrate] Done. Applied: $APPLIED  Skipped: $SKIPPED"
