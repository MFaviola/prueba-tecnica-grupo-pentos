import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../../interfaces/client.repository.js';

@Injectable()
export class ListClientsUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute() {
    const clients = await this.clientRepository.findAll();
    return clients.map(({ id, fullName, dni }) => ({ id, fullName, dni }));
  }
}