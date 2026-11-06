import { Inject, Injectable } from '@nestjs/common';
import type { Knex } from 'knex';
import { KNEX } from '../database/database.constants.js';
import { InstallmentRepository } from '../../application/interfaces/installment.repository.js';
import type { Installment } from '../../domain/entities/installment.entity.js';

@Injectable()
export class KnexInstallmentRepository extends InstallmentRepository {
  constructor(@Inject(KNEX) private readonly knex: Knex) {
    super();
  }

  async findByLoanApplicationId(loanApplicationId: number): Promise<Installment[]> {
    const rows = await this.knex('installment')
      .where({ loan_application_id: loanApplicationId })
      .orderBy('due_date', 'asc');

    return rows.map((row: any) => this.toEntity(row));
  }

  private toEntity(row: any): Installment {
    return {
      id: row.id,
      loanApplicationId: row.loan_application_id,
      dueDate: row.due_date,
      amount: Number(row.amount),
      paid: Boolean(row.paid),
    };
  }
}