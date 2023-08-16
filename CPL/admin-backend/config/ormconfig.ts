import db from './db'

export = {
  type: 'mysql',
  host: db().host,
  port: parseInt(db().port.toString()),
  username: db().user,
  password: db().pass,
  database: db().db,
  migrations: ['migration/*{.ts,.js}'],
  migrationsTransactionMode: 'each',
  cli: {
    migrationsDir: 'migration',
  },
}
