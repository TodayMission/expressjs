import pgPromise from "pg-promise"

const pgp = require('pg-promise')();
const env = process.env

export const db = pgp({
  host: env.PG_HOSTNAME,
  port: env.PG_PORT,
  database: env.PG_DATABASE,
  user: env.PG_USER,
  password: env.PG_PASSWORD
})