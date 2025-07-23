# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Cache dependencies layer
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .
RUN npm run lint
# Copy and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built assets and runtime dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.next ./.next          
COPY --from=builder /usr/src/app/public ./public        
COPY --from=builder /usr/src/app/.output ./.output       
COPY --from=builder /usr/src/app/dist ./dist             

# Non-root user for security
RUN addgroup -g 1001 -S frontend && \
    adduser -S -u 1001 -G frontend frontend && \
    chown -R frontend:frontend /usr/src/app

USER frontend

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000 || exit 1

EXPOSE 3000

# Choose appropriate command:
CMD ["npm", "start"]                                     # For production
# CMD ["npx", "serve", "-s", "build"]                   # For create-react-app
# CMD ["node", "server.js"]                             # Custom server