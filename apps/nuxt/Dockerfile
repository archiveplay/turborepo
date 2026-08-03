ARG NODE_VERSION=26.0.0
FROM node:${NODE_VERSION}-alpine AS base

RUN npm install -g pnpm@11.18.0
ENV PNPM_PATH="/root/.local/share/pnpm/bin"
ENV PATH="${PNPM_PATH}:${PATH}"

FROM base AS prepare
WORKDIR /app

RUN pnpm add -g turbo
COPY . .
# Create a minimal version of the monorepo that contains
# only the selected workspace (nuxt) and everything it depends on
# (@pkg/api, @tooling/eslint).
#
# Result:
# /app/out/
#   ├── json/   -> package.json files + lockfile
#   └── full/   -> actual source code
#
# NOTE: nuxt does NOT depend on @pkg/db, so no prisma/openssl is needed here
# and the build can stay on alpine (unlike apps/api/Dockerfile).
RUN turbo prune nuxt --docker

FROM base AS builder
WORKDIR /app

# First install dependencies (as they change less often).
# NODE_ENV is deliberately left unset: devDependencies (nuxt CLI, typescript,
# etc.) would be skipped under NODE_ENV=production.
COPY --from=prepare /app/out/json/ .
RUN pnpm install

COPY --from=prepare /app/out/full/ .

# Deliberately NOT `turbo build`: nuxt#build -> @pkg/api#build -> @pkg/api#sdk:generate,
# and orval would try to fetch OPENAPI_INPUT_SRC from a running API that does not
# exist during an image build. The generated clients are committed
# (packages/api/clients/*.ts) and @pkg/api/@tooling/env ship raw TS, so building
# only the nuxt package is sufficient here.
#
# Regenerate the SDK on the host (`pnpm sdk:generate`) whenever the API contract
# changes -- this image compiles whatever is committed.
RUN pnpm --filter nuxt build

# ---------------------------------------------------------------------------
# Runtime: Nuxt/Nitro ships its own Node server (the `node-server` preset), so
# unlike apps/web (a static bundle served by nginx) no separate web server is
# needed here -- the same Node process serves pages AND proxies "/api" to the
# api service (see server/routes/api/[...].ts), keeping the SPA/API
# same-origin with no CORS involved.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
# Overridden by docker-compose.yaml at runtime (never baked into the image).
ENV NUXT_API_UPSTREAM=http://api:4000

COPY --from=builder /app/apps/nuxt/.output ./.output

# Documentation only: the published port is set in docker-compose.yaml.
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
