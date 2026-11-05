import { BadRequestException, Injectable } from '@nestjs/common';
import { LoanApplicationRepository } from '../../interfaces/loan-application.repository.js';
import { ListLoanApplicationsDto } from '../../dto/loan-application/list-loan-applications.dto.js';

@Injectable()
export class ListLoanApplicationsUseCase {
  constructor(private readonly loanApplicationRepository: LoanApplicationRepository) {}

  async execute(dto: ListLoanApplicationsDto) {
    const from = dto.from ? new Date(dto.from) : undefined;

    const to = dto.to ? new Date(dto.to) : undefined;
    if (to) {
      to.setUTCDate(to.getUTCDate() + 1);
    }

    if (from && to && from >= to) {
      throw new BadRequestException('La fecha "from" no puede ser mayor que "to"');
    }

    return this.loanApplicationRepository.findAll({
      page: dto.page,
      limit: dto.limit,
      status: dto.status,
      from,
      to,
    });
  }
}