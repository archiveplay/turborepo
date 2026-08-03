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
# only the selected workspace (web) and everything it depends on
# (@pkg/api, @tooling/env, @tooling/typescript, @tooling/eslint).
#
# Result:
# /app/out/
#   ├── json/   -> package.json files + lockfile
#   └── full/   -> actual source code
#
# NOTE: web does NOT depend on @pkg/db, so no prisma/openssl is needed here and
# the build can stay on alpine (unlike apps/api/Dockerfile).
RUN turbo prune web --docker

FROM base AS builder
WORKDIR /app

# First install dependencies (as they change less often).
# NODE_ENV is deliberately left unset: `vite`/`vue-tsc` are devDependencies and
# would be skipped under NODE_ENV=production.
COPY --from=prepare /app/out/json/ .
RUN pnpm install

COPY --from=prepare /app/out/full/ .

# Vite INLINES every VITE_* variable at BUILD time -- it cannot be changed at
# runtime. The default is empty because the app talks to the API through the
# same origin ("/api", proxied by nginx, see nginx.conf.template), so nothing
# needs to be baked in. Only set this when you point the SPA at an absolute
# backend origin instead. Never pass secrets: they end up in the JS bundle.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Deliberately NOT `turbo build`: web#build -> @pkg/api#build -> @pkg/api#sdk:generate,
# and orval would try to fetch OPENAPI_INPUT_SRC from a running API that does not
# exist during an image build. The generated clients are committed
# (packages/api/clients/*.ts) and @pkg/api/@tooling/env ship raw TS, so building
# only the web package is sufficient here.
#
# Regenerate the SDK on the host (`pnpm sdk:generate`) whenever the API contract
# changes -- this image compiles whatever is committed.
RUN pnpm --filter web build

# ---------------------------------------------------------------------------
# Static runtime: the build output is plain HTML/JS/CSS, so no node process is
# needed -- nginx serves the files and reverse-proxies /api to the api service.
# ---------------------------------------------------------------------------
FROM nginx:1.29-alpine AS runner

# Rendered to /etc/nginx/conf.d/default.conf on startup by the image's
# docker-entrypoint (20-envsubst-on-templates.sh). The FILTER restricts
# envsubst to API_UPSTREAM, otherwise nginx's own $uri/$host/... variables
# would be substituted with empty strings.
ENV NGINX_ENVSUBST_FILTER=API_UPSTREAM
ENV API_UPSTREAM=api:4000
COPY apps/web/nginx.conf.template /etc/nginx/templates/default.conf.template

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Documentation only: the published port is set in docker-compose.yaml.
EXPOSE 80
