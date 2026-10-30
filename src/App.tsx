import { useState } from 'react';
import type { LogFilters } from './types';
import { useMetrics, useLogs, useSimulateLoad, usePolling } from './hooks';
import { ServiceMetricsCard } from './components/MetricsCards';
import { LogsTable } from './components/LogsTable';
import { SimulateLoadButton } from './components/SimulateLoadButton';

function App() {
  const [filters, setFilters] = useState<LogFilters>({
    service: undefined,
    status: undefined,
    from: undefined,
    to: undefined,
    page: 0,
    size: 20,
  });

  const { metrics, loading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useMetrics();
  const { logs, loading: logsLoading, error: logsError, refetch: refetchLogs } = useLogs(filters);
  const { simulate, loading: simulateLoading, result: simulateResult, error: simulateError } = useSimulateLoad();

  const handleSimulate = () => {
    simulate();
    setTimeout(() => {
      refetchMetrics();
      refetchLogs();
    }, 1000);
  };

  usePolling(() => {
    refetchMetrics();
    refetchLogs();
  }, 5000);

  const handleFiltersChange = (newFilters: Partial<LogFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Microservices Observability Dashboard</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
              <span>Auto-refresh: 5s</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(metricsError || logsError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error loading data: {metricsError || logsError}
            <button
              onClick={() => { refetchMetrics(); refetchLogs(); }}
              className="ml-4 text-sm underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        <section aria-labelledby="metrics-heading" className="mb-8">
          <h2 id="metrics-heading" className="text-lg font-semibold text-gray-900 mb-4">Service Metrics</h2>
          {metricsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics.map((metric) => (
                <ServiceMetricsCard key={metric.serviceId} metrics={metric} />
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="simulate-heading" className="mb-8">
          <SimulateLoadButton
            onSimulate={handleSimulate}
            loading={simulateLoading}
            result={simulateResult}
            error={simulateError}
          />
        </section>

        <section aria-labelledby="logs-heading">
          <h2 id="logs-heading" className="text-lg font-semibold text-gray-900 mb-4">Logs</h2>
          <LogsTable
            logs={logs}
            loading={logsLoading}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          Microservices Monitoring System — Proxy Audit & Logging
        </div>
      </footer>
    </div>
  );
}

export default App;