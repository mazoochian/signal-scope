FROM timescale/timescaledb:latest-pg16

# Default credentials — override via environment variables or docker-compose.
# POSTGRES_USER becomes the database superuser inside the container, which is
# required so that CREATE EXTENSION timescaledb can succeed without a separate
# superuser step.
ENV POSTGRES_DB=signalscope \
    POSTGRES_USER=signalscope \
    POSTGRES_PASSWORD=signalscope

# Copy SQL migrations into the init dir.  PostgreSQL/TimescaleDB runs every
# *.sql file in alphabetical order on the very first container start (when the
# data directory is empty).  Subsequent starts skip this directory entirely, so
# the volume-persisted data is never re-initialised.
COPY migrations/ /docker-entrypoint-initdb.d/

EXPOSE 5432
