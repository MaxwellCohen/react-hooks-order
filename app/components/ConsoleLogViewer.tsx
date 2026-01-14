"use client";
import { useEffect, useRef, useState } from "react";
import { consoleInterceptor, type LogEntry } from "./consoleInterceptor";

type LogLevel = LogEntry["level"];

export default function ConsoleLogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>(() => consoleInterceptor.getLogs());
  const [isOpen, setIsOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(() => consoleInterceptor.isPaused());
  const [searchText, setSearchText] = useState("");
  const [enabledLevels, setEnabledLevels] = useState<Set<LogLevel>>(
    new Set(["log", "warn", "error", "info", "debug"])
  );
  const [showFilters, setShowFilters] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  // Subscribe to new logs
  useEffect(() => {
    const unsubscribe = consoleInterceptor.subscribe((entry) => {
      setLogs((prev) => [...prev, entry]);
    });

    return unsubscribe;
  }, []);

  // Filter logs based on search text and enabled levels
  const filteredLogs = logs.filter((log) => {
    // Filter by level
    if (!enabledLevels.has(log.level)) {
      return false;
    }

    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      return (
        log.formatted.toLowerCase().includes(searchLower) ||
        log.level.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (shouldAutoScrollRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [filteredLogs]);

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      shouldAutoScrollRef.current =
        scrollTop + clientHeight >= scrollHeight - 10;
    }
  };

  const clearLogs = () => {
    consoleInterceptor.clearLogs();
    setLogs([]);
  };

  const getLogLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "text-red-600 dark:text-red-400";
      case "warn":
        return "text-yellow-600 dark:text-yellow-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
      case "debug":
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-800 dark:text-gray-200";
    }
  };

  const getLogLevelBg = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warn":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "debug":
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
      default:
        return "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800";
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  };

  const toggleLevel = (level: LogLevel) => {
    setEnabledLevels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(level)) {
        newSet.delete(level);
      } else {
        newSet.add(level);
      }
      return newSet;
    });
  };

  const selectAllLevels = () => {
    setEnabledLevels(new Set(["log", "warn", "error", "info", "debug"]));
  };

  const deselectAllLevels = () => {
    setEnabledLevels(new Set());
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        Show Console ({logs.length})
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[600px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl flex flex-col max-h-[70vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Console Logs
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({filteredLogs.length} / {logs.length} entries)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-2 py-1 text-xs rounded ${
              showFilters
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            } hover:opacity-80 transition-opacity`}
          >
            Filter
          </button>
          <button
            onClick={() => {
              const newPaused = !isPaused;
              consoleInterceptor.setPaused(newPaused);
              setIsPaused(newPaused);
            }}
            className={`px-2 py-1 text-xs rounded ${
              isPaused
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            } hover:opacity-80 transition-opacity`}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={clearLogs}
            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-3">
          {/* Search Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search logs..."
              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Log Level Filters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                Log Levels
              </label>
              <div className="flex gap-1">
                <button
                  onClick={selectAllLevels}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  All
                </button>
                <button
                  onClick={deselectAllLevels}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  None
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["log", "warn", "error", "info", "debug"] as LogLevel[]).map(
                (level) => (
                  <label
                    key={level}
                    className="flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={enabledLevels.has(level)}
                      onChange={() => toggleLevel(level)}
                      className="w-3 h-3 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`font-medium ${getLogLevelColor(level)}`}
                    >
                      {level.toUpperCase()}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
        <strong>Note:</strong> Server-side console logs appear in the terminal.
        This panel shows client-side logs only.
      </div>

      {/* Logs container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs"
      >
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No logs yet. Console logs will appear here.
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No logs match the current filter.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded border ${getLogLevelBg(
                log.level
              )} break-words`}
            >
              <div className="flex items-start gap-2">
                <span
                  className={`font-semibold text-[10px] uppercase flex-shrink-0 ${getLogLevelColor(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-[10px] flex-shrink-0">
                  {formatTime(log.timestamp)}
                </span>
              </div>
              <div
                className={`mt-1 ${getLogLevelColor(log.level)} whitespace-pre-wrap`}
              >
                {log.formatted}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

