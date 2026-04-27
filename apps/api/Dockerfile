# Stage 1: Pruning
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune leva-eu-api --docker

# Stage 2: Installing dependencies
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Stage 3: Building the application
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Generate Prisma Client
RUN pnpm turbo run db:generate --filter=leva-eu-api...

# Build the API
WORKDIR /app/apps/api
RUN ../../node_modules/.bin/tsc -p tsconfig.build.json --incremental false

# Stage 4: Production runner
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=installer /app ./

# Setup entrypoint
RUN chmod +x apps/api/docker-entrypoint.sh

USER nestjs

WORKDIR /app/apps/api
EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
