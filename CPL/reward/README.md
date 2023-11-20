## I. Prepare

- Copy .env.example to .env

## II. Start Project

- Start all container `docker compose up -d --build`
- Migrate Database: `npm run migrate:run`
- Migrate old queue: `node ./dist/apps/command-line/main.js redis-queue:migrate`

## III. For Develop

1. Seed fake data: `npm run seed:data`
