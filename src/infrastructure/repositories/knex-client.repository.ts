import { Inject, Injectable } from '@nestjs/common';
import type { Knex } from 'knex';
import { KNEX } from '../database/database.constants.js';
import { ClientRepository } from '../../application/interfaces/client.repository.js';
import type { Client } from '../../domain/entities/client.entity.js';

@Injectable()
export class KnexClientRepository extends ClientRepository {
  constructor(@Inject(KNEX) private readonly knex: Knex) {
    super();
  }

  async findById(id: number): Promise<Client | null> {
    const row = await this.knex('client').where({ id }).first();
    return row ? this.toEntity(row) : null;
  }

  async findAll(): Promise<Client[]> {
    const rows = await this.knex('client').select('*').orderBy('full_name', 'asc');
    return rows.map((row: any) => this.toEntity(row));
  }

  private toEntity(row: any): Client {
    return {
      id: row.id,
      fullName: row.full_name,
      dni: row.dni,
      monthlyIncome: Number(row.monthly_income),
      createdAt: row.created_at,
    };
  }
}