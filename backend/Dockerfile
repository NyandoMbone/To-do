FROM node:18-alpine AS build-backend
WORKDIR /app

# copy backend source
COPY package*.json ./
RUN npm install --production
COPY . ./

FROM node:18-alpine
WORKDIR /app

# copy installed deps and app
COPY --from=build-backend /app/node_modules ./node_modules
COPY --from=build-backend /app .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
