# Self-hosting / container deploy for the SSC CGL Prep platform.
FROM node:20-alpine AS base
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and generate data + build
COPY . .
RUN node scripts/generate-questions.mjs \
 && node scripts/daily-update.mjs \
 && npm run build

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
