import { Controller, Get, Inject } from '@nestjs/common';
import type { Knex } from 'knex';
import { KNEX } from './infrastructure/database/database.constants.js';

@Controller()
export class AppController {
  constructor(@Inject(KNEX) private readonly knex: Knex) {}

  @Get('health')
  async health() {
    const [rows] = await this.knex.raw('SELECT UTC_TIMESTAMP() AS db_time');
    return { status: 'ok', db_time: rows[0].db_time };
  }
}