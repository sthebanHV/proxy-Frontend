import { useState, useEffect, useCallback } from 'react';
import type { ServiceMetrics, LogEntry, PageResponse, LogFilters } from '../types';
import { api } from '../api';

export function useMetrics() {
  const [metrics, setMetrics] = useState<ServiceMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSummary();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

export function useLogs(filters: LogFilters) {
  const [logs, setLogs] = useState<PageResponse<LogEntry> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getLogs(filters);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}

export function useSimulateLoad() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ successful: number; failed: number; errorRate: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const data = await api.simulateLoad();
      setResult({
        successful: data.successful,
        failed: data.failed,
        errorRate: data.errorRate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate load');
    } finally {
      setLoading(false);
    }
  }, []);

  return { simulate, loading, result, error };
}

export function usePolling(callback: () => void, intervalMs: number = 5000) {
  useEffect(() => {
    const interval = setInterval(callback, intervalMs);
    return () => clearInterval(interval);
  }, [callback, intervalMs]);
}