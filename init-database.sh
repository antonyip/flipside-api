#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE TABLE IF NOT EXISTS public.stored_queries
(
    id bigserial,
    query text,
    result json,
    last_updated timestamp without time zone,
    ttl_seconds bigint,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.stored_queries
    OWNER to postgres;
EOSQL