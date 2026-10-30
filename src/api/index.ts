import type { LogEntry, ServiceMetrics, PageResponse, LogFilters, SimulateLoadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  getSummary: () => fetchApi<ServiceMetrics[]>('/api/metrics/summary'),

  getLogs: (filters: LogFilters) => {
    const params = new URLSearchParams();
    if (filters.service) params.append('service', filters.service);
    if (filters.status) params.append('status', filters.status);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    params.append('page', filters.page.toString());
    params.append('size', filters.size.toString());
    return fetchApi<PageResponse<LogEntry>>(`/api/metrics/logs?${params.toString()}`);
  },

  simulateLoad: () => fetchApi<SimulateLoadResponse>('/api/metrics/simulate-load', {
    method: 'POST',
  }),

  executeService: (service: string, operation: string, body?: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>(`/api/services/${service}/${operation}`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};