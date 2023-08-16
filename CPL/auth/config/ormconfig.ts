import db from './db'

export = {
  type: 'mysql',
  host: db().authenticate.mysql.master.host,
  port: parseInt(db().authenticate.mysql.master.port.toString()),
  username: db().authenticate.mysql.master.user,
  password: db().authenticate.mysql.master.pass,
  database: db().authenticate.mysql.master.db,
  migrations: ['migration/*{.ts,.js}'],
  migrationsTransactionMode: 'each',
  cli: {
    migrationsDir: 'migration',
  },
}
