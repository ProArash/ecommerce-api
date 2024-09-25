FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm i

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["sh","-c","npx prisma migrate deploy && npm run start:prod"]

