import type { ServiceMetrics } from '../types';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export function MetricCard({ title, value, subtitle, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className={`p-5 rounded-xl border ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

interface ServiceMetricsCardProps {
  metrics: ServiceMetrics;
}

export function ServiceMetricsCard({ metrics }: ServiceMetricsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">{metrics.serviceId}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          metrics.errorRate > 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {metrics.errorRate.toFixed(1)}% error
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <MetricCard title="Total Calls" value={metrics.totalCalls} color="blue" />
        <MetricCard title="Avg Latency" value={`${metrics.avgDurationMs.toFixed(1)}ms`} color="purple" />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Success</p>
          <p className="font-semibold text-green-600">{metrics.callsByStatus.SUCCESS || 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Errors</p>
          <p className="font-semibold text-red-600">{metrics.callsByStatus.ERROR || 0}</p>
        </div>
      </div>
    </div>
  );
}