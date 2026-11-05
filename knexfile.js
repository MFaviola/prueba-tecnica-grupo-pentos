import 'dotenv/config';

export default {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone : 'Z'
  },
  pool:{
    afterCreate:(conn,done)=> {
        conn.query("SET time_zone='+00:00'",(err) => done (err,conn))
    },
  },
  migrations: {
    directory: './database/migrations',
    extension: 'js',
    loadExtensions: ['.js'],
  },
  seeds: {
    directory: './database/seeds',
    loadExtensions: ['.js'],
  },
};