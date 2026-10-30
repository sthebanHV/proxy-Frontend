import type { LogEntry, PageResponse, LogFilters } from '../types';
import { useState, useMemo } from 'react';

interface LogsTableProps {
  logs: PageResponse<LogEntry> | null;
  loading: boolean;
  filters: LogFilters;
  onFiltersChange: (filters: Partial<LogFilters>) => void;
}

export function LogsTable({ logs, loading, filters, onFiltersChange }: LogsTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof LogEntry; direction: 'asc' | 'desc' } | null>(null);

  const sortedLogs = useMemo(() => {
    if (!logs?.content || !sortConfig) return logs?.content || [];
    return [...logs.content].sort((a, b) => {
      const aVal = a[sortConfig.key] as string | number;
      const bVal = b[sortConfig.key] as string | number;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [logs?.content, sortConfig]);

  const handleSort = (key: keyof LogEntry) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status: LogEntry['status']) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {status}
    </span>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            value={filters.service || ''}
            onChange={(e) => onFiltersChange({ service: e.target.value || undefined, page: 0 })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Services</option>
            <option value="inventory">Inventory</option>
            <option value="orders">Orders</option>
            <option value="payments">Payments</option>
          </select>
          <select
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({ status: e.target.value as 'SUCCESS' | 'ERROR' | undefined, page: 0 })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="ERROR">Error</option>
          </select>
          <input
            type="datetime-local"
            value={filters.from || ''}
            onChange={(e) => onFiltersChange({ from: e.target.value || undefined, page: 0 })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="datetime-local"
            value={filters.to || ''}
            onChange={(e) => onFiltersChange({ to: e.target.value || undefined, page: 0 })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'serviceId', label: 'Service' },
                { key: 'operation', label: 'Operation' },
                { key: 'durationMs', label: 'Duration (ms)' },
                { key: 'status', label: 'Status' },
                { key: 'requestId', label: 'Request ID' },
                { key: 'timestamp', label: 'Timestamp' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(key as keyof LogEntry)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortConfig?.key === key && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedLogs?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No logs found
                </td>
              </tr>
            ) : (
              sortedLogs?.map((log) => (
                <tr key={log.requestId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize">{log.serviceId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{log.operation}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">{log.durationMs}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(log.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono truncate max-w-[150px]">{log.requestId}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatTimestamp(log.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {logs && logs.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {logs.page + 1} of {logs.totalPages} — {logs.totalElements} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onFiltersChange({ page: 0 })}
              disabled={logs.first}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              First
            </button>
            <button
              onClick={() => onFiltersChange({ page: logs.page - 1 })}
              disabled={logs.first}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => onFiltersChange({ page: logs.page + 1 })}
              disabled={logs.last}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
            <button
              onClick={() => onFiltersChange({ page: logs.totalPages - 1 })}
              disabled={logs.last}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}