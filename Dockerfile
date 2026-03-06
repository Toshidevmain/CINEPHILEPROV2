FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Skip env validation during build if using T3 Env
ENV SKIP_ENV_VALIDATION=1
# Ensure production mode
ENV NODE_ENV=production

RUN npm run build

FROM node:20-slim

WORKDIR /app

# Copy only what's needed for production to keep image small
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
