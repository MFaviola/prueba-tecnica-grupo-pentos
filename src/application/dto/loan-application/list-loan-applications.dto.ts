import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import type { LoanStatus } from '../../../domain/entities/loan-application.entity.js';

export class ListLoanApplicationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page debe ser un número entero' })
  @Min(1, { message: 'page debe ser al menos 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit debe ser un número entero' })
  @Min(1, { message: 'limit debe ser al menos 1' })
  @Max(100, { message: 'limit no puede ser mayor a 100' })
  limit: number = 10;

  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'], {
    message: 'status debe ser pending, approved o rejected',
  })
  status?: LoanStatus;

  @IsOptional()
  @IsDateString({}, { message: 'from debe ser una fecha válida (YYYY-MM-DD)' })
  from?: string;

  @IsOptional()
  @IsDateString({}, { message: 'to debe ser una fecha válida (YYYY-MM-DD)' })
  to?: string;
}