# syntax=docker.io/docker/dockerfile:1

FROM cgr.dev/chainguard/node:latest-dev AS base

# Install dependencies only when needed
FROM base AS deps
# libc6-compat equivalent is already handled by Wolfi/glibc — not needed
# apk is available in the -dev variant
RUN apk upgrade && apk add --no-cache git

# Update OpenSSL to fix CVE-2025-4575
RUN apk upgrade openssl

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm install --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY src ./src

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_GITHUB_TOKEN
ENV NEXT_PUBLIC_GITHUB_TOKEN=${NEXT_PUBLIC_GITHUB_TOKEN}
# Create .env file with the GitHub token
RUN echo "NEXT_PUBLIC_GITHUB_TOKEN=${NEXT_PUBLIC_GITHUB_TOKEN}" > .env

RUN npm run build


# Production image — use minimal distroless runtime (no shell, no apk)
FROM cgr.dev/chainguard/node:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Chainguard node:latest already runs as a non-root user (uid 65532 / "nonroot")
# No need to create nodejs/nextjs users — just use the built-in nonroot user

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

USER nonroot

EXPOSE 3000

ENV PORT=3000

ARG NEXT_PUBLIC_GITHUB_TOKEN
ENV NEXT_PUBLIC_GITHUB_TOKEN=${NEXT_PUBLIC_GITHUB_TOKEN}

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]


# docker build --build-arg NEXT_PUBLIC_GITHUB_TOKEN=<your_token_here> -t ccdi-ods-ui .