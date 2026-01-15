"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { consoleInterceptor, type LogEntry, type HookType } from "./consoleInterceptor";

type LogLevel = LogEntry["level"];

const ALL_HOOK_TYPES: HookType[] = [
  "useState",
  "useReducer",
  "useMemo",
  "useCallback",
  "useEffect",
  "useLayoutEffect",
  "useTransition",
  "useOptimistic",
  "useContext",
  "useRef",
  "ref-callback",
  "render",
  "other",
];

export default function ConsoleLogViewer() {
  const logs = useSyncExternalStore(
    consoleInterceptor.subscribe,
    consoleInterceptor.getSnapshot,
    consoleInterceptor.getServerSnapshot
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [enabledHookTypes, setEnabledHookTypes] = useState<Set<HookType>>(
    new Set(ALL_HOOK_TYPES)
  );
  const [showFilters, setShowFilters] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  // Filter logs based on search text and hook types
  const filteredLogs = logs.filter((log) => {
    // Filter by hook type
    if (log.hookType && !enabledHookTypes.has(log.hookType)) {
      return false;
    }

    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      return (
        log.formatted.toLowerCase().includes(searchLower) ||
        (log.hookType && log.hookType.toLowerCase().includes(searchLower))
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

  const toggleHookType = (hookType: HookType) => {
    setEnabledHookTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(hookType)) {
        newSet.delete(hookType);
      } else {
        newSet.add(hookType);
      }
      return newSet;
    });
  };

  const selectAllHookTypes = () => {
    setEnabledHookTypes(new Set(ALL_HOOK_TYPES));
  };

  const deselectAllHookTypes = () => {
    setEnabledHookTypes(new Set());
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        Show Console
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-150 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl flex flex-col max-h-[70vh]">
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

          {/* Hook Type Filters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                Hook Types
              </label>
              <div className="flex gap-1">
                <button
                  onClick={selectAllHookTypes}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  All
                </button>
                <button
                  onClick={deselectAllHookTypes}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  None
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_HOOK_TYPES.map((hookType) => (
                <label
                  key={hookType}
                  className="flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={enabledHookTypes.has(hookType)}
                    onChange={() => toggleHookType(hookType)}
                    className="w-3 h-3 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {hookType === "ref-callback" ? "ref callback" : hookType}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
        <strong>Note:</strong> This panel shows both server-side and client-side console logs.
        Server logs are marked with a badge.
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
              )} wrap-break-word`}
            >
              <div className="flex items-start gap-2">
                <span
                  className={`font-semibold text-[10px] uppercase shrink-0 ${getLogLevelColor(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>
                {log.source && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                      log.source === "server"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    }`}
                  >
                    {log.source}
                  </span>
                )}
                {log.hookType && log.hookType !== "other" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                    {log.hookType === "ref-callback" ? "ref" : log.hookType}
                  </span>
                )}
                <span className="text-gray-500 dark:text-gray-400 text-[10px] shrink-0">
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

