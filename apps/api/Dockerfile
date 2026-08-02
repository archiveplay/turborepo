ARG NODE_VERSION=26.0.0
FROM node:${NODE_VERSION}-slim AS base

# `prisma generate` requires DATABASE_URL to be present, but never connects to
# it. So we default to a throwaway DSN: the real one is injected at RUNTIME by
# docker compose. Never pass real credentials here -- build args are persisted
# in the image history.
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=$DATABASE_URL

RUN npm install -g pnpm@11.5.2
ENV PNPM_PATH="/root/.local/share/pnpm/bin"
ENV PATH="${PNPM_PATH}:${PATH}"

FROM base AS prepare
# Set working directory
WORKDIR /app

RUN pnpm add -g turbo
COPY . .
# Create a minimal version of the monorepo that contains
# only the selected workspace (api) and everything it depends on.
#
# Result:
# /app/out/
#   ├── json/   -> package.json files + lockfile
#   └── full/   -> actual source code
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS builder
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN pnpm install

# Build the project and its dependencies
COPY --from=prepare /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build

# NOTE: must stay on the same libc as the builder (debian/glibc). Prisma's
# query engine is fetched at generate time for the build platform, so copying
# those node_modules into an alpine/musl image fails at runtime.
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

# Prisma needs openssl, which is not in the slim image.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Don't run production as root
RUN addgroup --system --gid 1001 nestjs \
  && adduser --system --uid 1001 --ingroup nestjs nestjs

COPY --from=builder --chown=nestjs:nestjs /app .

USER nestjs

# Documentation only: the published port is set in docker-compose.yaml.
EXPOSE 4000

CMD ["node","apps/api/dist/main.js"]
