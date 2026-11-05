import { Body, Controller, Post } from '@nestjs/common';
import { CreateLoanApplicationDto } from '../../application/dto/loan-application/create-loan-application.dto.js';
import { CreateLoanApplicationUseCase } from '../../application/use-cases/loan-application/create-loan-application.use-case.js';

@Controller('loan-applications')
export class LoanApplicationController {
  constructor(private readonly createLoanApplication: CreateLoanApplicationUseCase) {}

  @Post()
  create(@Body() dto: CreateLoanApplicationDto) {
    return this.createLoanApplication.execute(dto);
  }
}