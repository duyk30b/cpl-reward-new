export default () => ({
  bce_mysql: {
    slave: {
      host: process.env.BCE_SLAVE_DB_HOST,
      port: process.env.BCE_SLAVE_DB_PORT,
      user: process.env.BCE_SLAVE_DB_USERNAME,
      pass: process.env.BCE_SLAVE_DB_PASSWORD,
      db: process.env.BCE_SLAVE_DB_DATABASE,
    },
  },
})
