
FROM node:20.17-alpine AS base
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /node

COPY ./.eslintrc.json /node/.eslintrc.json
COPY ./.graphqlrc.yml /node/.graphqlrc.yml
COPY ./codegen.ts /node/codegen.ts
COPY ./components.json /node/components.json
COPY ./next.config.mjs /node/next.config.mjs
COPY ./package.json /node/package.json
COPY ./postcss.config.mjs /node/postcss.config.mjs
COPY ./tailwind.config.ts /node/tailwind.config.ts
COPY ./tsconfig.json /node/tsconfig.json
COPY ./yarn.lock /node/yarn.lock
COPY ./src /node/src

RUN yarn install
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /node

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /node/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /node/.next/static ./.next/static


USER nextjs

EXPOSE 5000

ENV PORT=5000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js