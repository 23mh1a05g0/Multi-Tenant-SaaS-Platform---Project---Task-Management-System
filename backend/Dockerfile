FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "node scripts/runMigrations.js && node scripts/runSeeds.js && npm run dev"]
