import { API_URL } from '../config/env';
import { handleResponse } from './http';
import type { Client } from '../types/client.types';

export async function fetchClients(signal?: AbortSignal): Promise<Client[]> {
  const response = await fetch(`${API_URL}/clients`, { signal });
  return handleResponse<Client[]>(response);
}