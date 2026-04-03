# syntax=docker.io/docker/dockerfile:1

FROM node:25-alpine3.23 AS base

#
# Patch CVEs in this layer
#

# zlib: CVE-2026-27171, OpenSSL: CVE-2025-4575
RUN apk update && apk add --no-cache --upgrade zlib=1.3.2-r0 openssl

# Install dependencies only when needed
FROM base AS deps
USER root

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk upgrade && apk --no-cache add git bash

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY src ./src

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_GITHUB_TOKEN
ENV NEXT_PUBLIC_GITHUB_TOKEN=${NEXT_PUBLIC_GITHUB_TOKEN}
# Create .env file with the GitHub token
RUN echo "NEXT_PUBLIC_GITHUB_TOKEN=${NEXT_PUBLIC_GITHUB_TOKEN}" > .env

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

# Remove npm from production layer
RUN rm -rf /usr/local/lib/node_modules/npm \
  && rm -f /usr/local/bin/npm \
  && rm -f /usr/local/bin/npx

USER root
WORKDIR /app
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ARG NEXT_PUBLIC_GITHUB_TOKEN

ENV NEXT_PUBLIC_GITHUB_TOKEN=${NEXT_PUBLIC_GITHUB_TOKEN}
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
