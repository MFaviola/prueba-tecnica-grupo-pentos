import { Inject, Injectable } from '@nestjs/common';
import { LoanApplicationRepository } from '../../application/interfaces/loan-application.repository.js';
import type { Knex } from 'knex';
import { KNEX } from '../database/database.constants.js';
import { LoanApplication, LoanStatus } from '../../domain/entities/loan-application.entity.js';
import { ScheduledInstallment } from '../../domain/value-objects/scheduled-installment.js';

@Injectable()
export class KnexLoanApplicationRepository extends LoanApplicationRepository {
  constructor(@Inject(KNEX) private readonly knex: Knex) {
    super();
  }

    async createWithInstallments(
    data: { clientId: number; requestedAmount: number; termMonths: number; status: LoanStatus },
    installments: ScheduledInstallment[],
  ): Promise<LoanApplication> {
     return this.knex.transaction(async (trx) => {
        
      const [loanApplicationId] = await trx('loan_application').insert({
        client_id: data.clientId,
        requested_amount: data.requestedAmount,
        term_months: data.termMonths,
        status: data.status,
      });
      
       if (installments.length > 0) {
        await trx('installment').insert(
          installments.map((installment) => ({
            loan_application_id: loanApplicationId,
            due_date: installment.dueDate.toISOString().slice(0, 10), 
            amount: installment.amount,
            paid: false,
          })),
        );
      }

      const row = await trx('loan_application').where({ id: loanApplicationId }).first();
      return this.toEntity(row);
    });
  }

  private toEntity(row: any): LoanApplication {
    return {
      id: row.id,
      clientId: row.client_id,
      requestedAmount: Number(row.requested_amount),
      termMonths: row.term_months,
      status: row.status,
      createdAt: row.created_at,
    };
  }




}