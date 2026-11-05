import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateLoanApplicationUseCase } from './create-loan-application.use-case.js';
import type { ClientRepository } from '../../interfaces/client.repository.js';
import type { LoanApplicationRepository } from '../../interfaces/loan-application.repository.js';

describe('CreateLoanApplicationUseCase', () => {
  let clientRepository: { findById: ReturnType<typeof vi.fn> };
  let loanApplicationRepository: { createWithInstallments: ReturnType<typeof vi.fn> };
  let useCase: CreateLoanApplicationUseCase;

  beforeEach(() => {
    clientRepository = { findById: vi.fn() };
    loanApplicationRepository = { createWithInstallments: vi.fn() };
    useCase = new CreateLoanApplicationUseCase(
      clientRepository as unknown as ClientRepository,
      loanApplicationRepository as unknown as LoanApplicationRepository,
    );
  });

  it('lanza 404 si el cliente no existe', async () => {
    clientRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ clientId: 999, requestedAmount: 10000, termMonths: 3, status: 'approved' }),
    ).rejects.toThrow(NotFoundException);

    expect(loanApplicationRepository.createWithInstallments).not.toHaveBeenCalled();
  });

  it('genera el plan de cuotas cuando la solicitud viene aprobada', async () => {
    clientRepository.findById.mockResolvedValue({ id: 1 });

    await useCase.execute({ clientId: 1, requestedAmount: 10000, termMonths: 3, status: 'approved' });

    const [, installments] = loanApplicationRepository.createWithInstallments.mock.calls[0];
    expect(installments).toHaveLength(3);
    expect(installments.map((i: { amount: number }) => i.amount)).toEqual([3333.33, 3333.33, 3333.34]);
  });

  it('no genera cuotas y usa pending por defecto si no viene el status', async () => {
    clientRepository.findById.mockResolvedValue({ id: 1 });

    await useCase.execute({ clientId: 1, requestedAmount: 5000, termMonths: 12 });

    const [data, installments] = loanApplicationRepository.createWithInstallments.mock.calls[0];
    expect(data.status).toBe('pending');
    expect(installments).toHaveLength(0);
  });
});