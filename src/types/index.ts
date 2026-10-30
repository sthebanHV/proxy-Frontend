export type Status = 'SUCCESS' | 'ERROR';

export interface LogEntry {
  serviceId: string;
  operation: string;
  durationMs: number;
  status: Status;
  requestId: string;
  timestamp: string;
  errorMessage?: string;
}

export interface ServiceMetrics {
  serviceId: string;
  totalCalls: number;
  errorRate: number;
  avgDurationMs: number;
  callsByStatus: Record<Status, number>;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface LogFilters {
  service?: string;
  status?: Status;
  from?: string;
  to?: string;
  page: number;
  size: number;
}

export interface SimulateLoadResponse {
  message: string;
  totalCalls: number;
  successful: number;
  failed: number;
  errorRate: string;
}