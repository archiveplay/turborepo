# Kickstart

- install dependencies

```sh
pnpm install
```

## setup env

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

## Prod (docker build)

```sh
docker compose up
```

## Setup client sdk (required `packages/db/.env`)

```sh
pnpm sdk:generate
```
