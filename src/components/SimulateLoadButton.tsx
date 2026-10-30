interface SimulateLoadButtonProps {
  onSimulate: () => void;
  loading: boolean;
  result: { successful: number; failed: number; errorRate: string } | null;
  error: string | null;
}

export function SimulateLoadButton({ onSimulate, loading, result, error }: SimulateLoadButtonProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Load Simulation</h3>
        <button
          onClick={onSimulate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Simulating...
            </span>
          ) : (
            'Simulate Load (50 calls)'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{result.successful}</p>
            <p className="text-sm text-green-600">Successful</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{result.failed}</p>
            <p className="text-sm text-red-600">Failed</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{result.errorRate}</p>
            <p className="text-sm text-blue-600">Error Rate</p>
          </div>
        </div>
      )}
    </div>
  );
}