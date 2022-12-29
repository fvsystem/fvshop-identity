FROM node:lts-alpine AS builder

WORKDIR /home/node/app

COPY package* .

RUN npm ci

COPY . .

RUN npm run build


FROM node:lts-alpine

WORKDIR /home/node/app

ENV NODE_ENV=production

COPY package* .

RUN npm ci --omit=dev

COPY --from=builder /app/dist .

CMD ["node", "index.js"]

