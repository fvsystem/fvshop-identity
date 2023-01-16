#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION pg_database_owner;

    CREATE TABLE IF NOT EXISTS public.users (
	id uuid NOT NULL,
	email varchar(255) NOT NULL,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
    );

    CREATE TABLE IF NOT EXISTS public.roles (
	id uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT roles_name_key UNIQUE (name),
	CONSTRAINT roles_pkey PRIMARY KEY (id)
    );  

    CREATE TABLE IF NOT EXISTS public."roles-users" (
	user_id uuid NOT NULL,
	role_id uuid NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "roles-users_pkey" PRIMARY KEY (user_id, role_id)
    );

    ALTER TABLE public."roles-users" DROP CONSTRAINT IF EXISTS "roles-users_role_id_fkey"  ;
    ALTER TABLE public."roles-users" DROP CONSTRAINT IF EXISTS "roles-users_user_id_fkey" ;


    ALTER TABLE public."roles-users" ADD CONSTRAINT "roles-users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE public."roles-users" ADD CONSTRAINT "roles-users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE;

    INSERT INTO public.users
    (id, email, first_name, last_name, "createdAt", "updatedAt")
    VALUES('cc33bcf8-e662-4024-8fb4-02e1e7dacdba'::uuid, 'admin@admin.com', 'Admin', 'Admin', '2023-01-06 23:28:29.194', '2023-01-06 23:28:29.194') ON CONFLICT DO NOTHING;

    INSERT INTO public.roles
    (id, "name", "createdAt", "updatedAt")
    VALUES('f7a58b05-c706-49e9-b901-1e81b5c72d2c'::uuid, 'admin', '2023-01-06 23:28:29.194', '2023-01-06 23:28:29.194') ON CONFLICT DO NOTHING;

    INSERT INTO public."roles-users"
    (user_id, role_id, "createdAt", "updatedAt")
    VALUES('cc33bcf8-e662-4024-8fb4-02e1e7dacdba'::uuid, 'f7a58b05-c706-49e9-b901-1e81b5c72d2c'::uuid, '2023-01-06 23:28:29.194', '2023-01-06 23:28:29.194') ON CONFLICt DO NOTHING;

EOSQL