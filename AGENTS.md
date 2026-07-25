# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

pnpm + Turborepo monorepo with a single NestJS API app (`apps/api`), shared packages (`packages/`), and shared tooling (`tooling/`).

- `apps/api` — NestJS REST API (PostgreSQL via Prisma, Redis caching, Swagger docs at `/api`)
- `packages/db` — Prisma client + auto-generated Zod schemas (via `prisma-zod-generator`)
- `packages/shared` — shared utilities (built with tsup, ESM + CJS)
- `tooling/env` — Zod-validated env loader (`@tooling/env/server`, `@tooling/env/vite`)
- `tooling/eslint` — shared ESLint flat config (`@tooling/eslint/base`)
- `tooling/typescript` — shared tsconfig bases (`base.json`, `node.json`, `browser.json`)

## Commands

All commands run from the repo root via Turbo unless working in a specific package.

```bash
pnpm install          # install all dependencies
pnpm build            # build all packages + format
pnpm lint             # lint all packages
pnpm test             # run all tests (vitest, requires build first per turbo.json)
pnpm format           # prettier --write on all ts/tsx/md/json files
```

**Database** (requires `DATABASE_URL` in env):

```bash
pnpm db:generate      # prisma generate (regenerates Prisma client + Zod schemas)
pnpm db:migrate       # prisma migrate dev (create + apply a new migration)
pnpm db:deploy        # prisma migrate deploy (apply pending migrations in prod)
```

**Run a single test file** (from `apps/api`):

```bash
pnpm --filter api test -- --reporter=verbose path/to/file.test.ts
# or using vitest directly:
pnpm --filter api exec vitest run src/user/user.service.spec.ts
```

**SDK generation** (if an OpenAPI-based SDK needs regenerating):

```bash
pnpm sdk:generate
```

## Environment Variables

Each app/package loads env via `@tooling/env/server`. Required vars (see `tooling/env/src/server.ts`):

| Variable       | Required | Default                  |
| -------------- | -------- | ------------------------ |
| `DATABASE_URL` | yes      | —                        |
| `PORT`         | no       | `4000`                   |
| `NODE_ENV`     | no       | `development`            |
| `REDIS_URL`    | no       | `redis://localhost:6379` |
| `CACHE_TTL`    | no       | `60000` (ms)             |
| `CORS_ORIGINS` | no       | `*`                      |

Place a `.env` file in `packages/db/` for Prisma CLI commands and in `apps/api/` for running the API. See `packages/db/example.env` for the template.

## Architecture

### Request / Response envelope

Every HTTP response from the API is wrapped by `ResponseInterceptor` and `HttpExceptionFilter`:

```ts
{ success: true,  data: T }      // 2xx
{ success: false, error: string } // 4xx/5xx
```

The `HttpResponseSchema` Zod helper in `apps/api/src/common/schemas/http.response.schema.ts` produces a discriminated union for client-side typing.

### DTO pattern

DTOs are created from the auto-generated Zod schemas using `createZodDto` from `nestjs-zod`. The flow is:

1. Define/update a model in `packages/db/prisma/schema.prisma`
2. Run `pnpm db:generate` — this regenerates `packages/db/generated/zod/schemas.ts` (do **not** edit this file manually)
3. Import the relevant `*ZodSchema` from `@pkg/db/schemas` in `apps/api/src/common/dto/`
4. Create DTOs with `createZodDto(SomeZodSchema)` and annotate controller responses with `@ZodResponse({ type: ResDto })`

### Cache layer

`CacheModule` (global) provides a two-layer cache via `cacheable`:

- **Primary**: in-memory LRU (5 s TTL, 5000 entries)
- **Secondary**: Redis (`REDIS_URL`)

`QueryCacheInterceptor` (registered as `APP_INTERCEPTOR`) caches responses keyed by route path + a hash of the Prisma query shape fields (`where`, `select`, `include`, `orderBy`, `take`, `skip`). Apply `@UseInterceptors(QueryCacheInterceptor)` on a controller method to opt in to per-endpoint caching.

### Global NestJS modules

`PrismaModule` and `CacheModule` are `@Global()`, so `PrismaService` and the `CACHE_CLIENT` token are available in any module without re-importing.

### Adding a new resource

1. Create `apps/api/src/<resource>/<resource>.module.ts`, `.controller.ts`, `.service.ts`
2. Add DTOs in `apps/api/src/common/dto/<resource>.dto.ts` using `createZodDto`
3. Import the module in `apps/api/src/app.module.ts`

## Commit Conventions

Commits are linted by commitlint (conventional commits). Subject must be lowercase. Allowed types:

`config` | `feat` | `fix` | `chore` | `docs` | `refactor` | `test` | `perf` | `ci` | `build` | `revert`

Pre-commit hook runs `lint-staged` (prettier on staged `*.{js,ts,vue,css,md,json}` files).
