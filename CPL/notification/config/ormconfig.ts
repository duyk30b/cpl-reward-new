export = [
  {
    type: 'mysql',
    host: process.env.MYSQL_MASTER_HOST,
    port: process.env.MYSQL_MASTER_PORT,
    username: process.env.MYSQL_MASTER_USER,
    password: process.env.MYSQL_MASTER_PASS,
    database: process.env.MYSQL_MASTER_DB,
    migrations: ['migration/*{.ts,.js}'],
    migrationsTransactionMode: 'each',
    cli: {
      migrationsDir: 'migration',
    },
  },
  {
    name: 'seed',
    type: 'mysql',
    host: process.env.MYSQL_MASTER_HOST,
    port: process.env.MYSQL_MASTER_PORT,
    username: process.env.MYSQL_MASTER_USER,
    password: process.env.MYSQL_MASTER_PASS,
    database: process.env.MYSQL_MASTER_DB,
    migrations: ['seed/*{.ts,.js}'],
    migrationsTableName: 'seed',
    migrationsTransactionMode: 'each',
    cli: {
      migrationsDir: 'seed',
    },
  },
]
