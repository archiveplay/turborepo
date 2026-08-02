# Kickstart

- install dependencies

```sh
pnpm install
```

## setup env

There are two kinds of env files, and mixing them up is the usual source of
"works locally, breaks in docker":

| file                | read by                            | db host     |
| ------------------- | ---------------------------------- | ----------- |
| `.env` (root)       | `docker compose` + root-level CLIs | `postgres`  |
| `apps/api/.env`     | `pnpm dev` (host)                  | `localhost` |
| `packages/db/.env`  | prisma CLI (host)                  | `localhost` |
| `packages/api/.env` | orval / sdk generation (host)      | n/a         |

The root `.env` is the **only** file docker reads. It stores the postgres
credentials as parts and `docker-compose.yaml` assembles the container
`DATABASE_URL` from them using the in-network hostname, so container and host
values can never drift.

- provide `.env` (see `.env.example`)

```sh
cp .env.example .env
```

- provide `packages/db/.env` (see `packages/db/.env.example`)

```sh
cp packages/db/.env.example packages/db/.env
```

- provide `packages/api/.env` (see `packages/api/.env.example`)

```sh
cp packages/api/.env.example packages/api/.env
```

- provide `apps/api/.env` (see `apps/api/.env.example`)

```sh
cp apps/api/.env.example apps/api/.env
```

You can use repo docker services urls, start them first

```sh
docker compose up postgres redis --detach
```

## Setup db (`packages/db/.env` required)

```sh
pnpm db:generate && pnpm db:migrate && pnpm format
```

## Dev mode

```sh
pnpm dev
```

## Prod (build)

```sh
pnpm build
```

## Deploy (docker compose)

On the VPS, the only file to fill in is the root `.env`:

```sh
cp .env.example .env   # then edit: POSTGRES_PASSWORD, CORS_ORIGINS
docker compose up --build --detach
```

Missing required variables abort the command by name (e.g.
`POSTGRES_PASSWORD: required in .env`) before a single container starts, so
there is no need to hunt through per-package env files.

What the stack does:

- `postgres` / `redis` — published on `127.0.0.1` only, never on the public
  interface. Put a reverse proxy in front of `api` for TLS.
- `migrate` — one-shot `prisma migrate deploy`; `api` only starts once it has
  exited successfully, so the app never boots against an outdated schema.
- `api` — receives its configuration explicitly from compose (no `env_file`),
  so secrets are not shared with the other containers.

Useful commands:

```sh
docker compose config          # render the resolved config, validates env vars
docker compose logs -f api
docker compose up -d --build api   # redeploy just the api (re-runs migrations)
```

## Setup client sdk (required `packages/db/.env`)

```sh
pnpm sdk:generate
```
