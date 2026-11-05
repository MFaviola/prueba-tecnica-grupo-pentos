import 'dotenv/config';
import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

try {
  await db.raw(
    'CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
    [process.env.DB_NAME],
  );
} catch (error) {
  process.exitCode = 1;
} finally {
  await db.destroy();
}