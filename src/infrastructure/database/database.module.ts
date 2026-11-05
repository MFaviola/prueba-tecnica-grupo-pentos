import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex from 'knex';
import type { Knex } from 'knex';
import { KNEX } from './database.constants.js';

@Global()
@Module({
  providers: [
    {
      provide: KNEX,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Knex =>
        knex({
          client: 'mysql2',
          connection: {
            host: config.get<string>('DB_HOST'),
            port: Number(config.get('DB_PORT')),
            user: config.get<string>('DB_USER'),
            password: config.get<string>('DB_PASSWORD'),
            database: config.get<string>('DB_NAME'),
            timezone: 'Z',
          },
          pool: {
            afterCreate: (conn: any, done: (err: Error | null, conn: any) => void) => {
              conn.query("SET time_zone = '+00:00'", (err: Error | null) => done(err, conn));
            },
          },
        }),
    },
  ],
  exports: [KNEX],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(KNEX) private readonly knex: Knex) {}

  async onApplicationShutdown() {
    await this.knex.destroy();
  }
}