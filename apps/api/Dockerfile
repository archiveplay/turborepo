ARG NODE_VERSION=26.0.0
FROM node:${NODE_VERSION}-slim AS base

# set up ENV
ARG DATABASE_URL
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

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs
COPY --from=builder /app .

CMD ["node","apps/api/dist/main.js"]
