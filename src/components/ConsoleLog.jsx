/**
 * Console Log Display Component
 * Displays console logs at the top of the page for debugging purposes
 * This component is temporary and can be removed later
 */

import { useState, useEffect, useRef } from 'react';

export function ConsoleLog() {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    // Helper to add log entry
    const addLog = (type, args) => {
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      setLogs(prev => [...prev.slice(-100), { // Keep last 100 logs
        id: crypto.randomUUID(),
        type,
        message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    // Override console methods
    console.log = (...args) => {
      originalLog.apply(console, args);
      addLog('log', args);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      addLog('error', args);
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      addLog('warn', args);
    };

    console.info = (...args) => {
      originalInfo.apply(console, args);
      addLog('info', args);
    };

    // Add initial log to show it's working
    console.log('🔧 Console Log Display initialized');

    // Cleanup: restore original console methods
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, []);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logsEndRef.current && isExpanded) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warn': return 'text-yellow-700 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const clearLogs = () => {
    setLogs([]);
    console.log('🧹 Logs cleared');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">🖥️</span>
          <span className="font-semibold text-sm">Console Logs</span>
          <span className="text-xs text-gray-400">({logs.length} entries)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearLogs}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            {isExpanded ? '▼ Collapse' : '▲ Expand'}
          </button>
        </div>
      </div>

      {/* Log entries */}
      {isExpanded && (
        <div className="max-h-48 overflow-y-auto p-2 space-y-1 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No logs yet. Console output will appear here.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`p-2 rounded ${getLogColor(log.type)} flex items-start gap-2`}
              >
                <span>{getLogIcon(log.type)}</span>
                <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                <pre className="whitespace-pre-wrap break-all flex-1">{log.message}</pre>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}

export default ConsoleLog;
