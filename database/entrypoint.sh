#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION pg_database_owner;

    CREATE TABLE IF NOT EXISTS public.credentials (
	id uuid NOT NULL,
	"password" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT credentials_pkey PRIMARY KEY (id)
    );

    INSERT INTO public.credentials
    (id, "password", email, "createdAt", "updatedAt")
    VALUES('cc33bcf8-e662-4024-8fb4-02e1e7dacdba'::uuid, '\$2a\$10\$ULTjEPkliNcOHOXZ3pi//uCOSw5aHC0bdzhTOxSEQDy5Aa5ySWeFa', 'admin@admin.com', '2023-01-12 12:56:55.443', '2023-01-12 12:56:55.443') ON CONFLICT DO NOTHING;

EOSQL