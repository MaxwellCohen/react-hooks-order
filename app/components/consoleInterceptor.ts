// This module intercepts console methods immediately when imported
// It runs before React components mount, ensuring we capture all logs

type LogLevel = "log" | "warn" | "error" | "info" | "debug";

export interface LogEntry {
  id: number;
  timestamp: number;
  level: LogLevel;
  args: unknown[];
  formatted: string;
}

type LogListener = (entry: LogEntry) => void;

// Global store for logs
const logs: LogEntry[] = [];
let logIdCounter = 0;
let isPaused = false;
const listeners = new Set<LogListener>();

// Format log arguments to string
function formatLogArgs(args: unknown[]): string {
  return args
    .map((arg) => {
      if (typeof arg === "object" && arg !== null) {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(" ");
}

// Store original console methods
const originalConsole = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
};

// Intercept console methods
function interceptConsole(level: LogLevel, originalMethod: typeof console.log) {
  return (...args: unknown[]) => {
    // Call original console method
    originalMethod(...args);

    // Don't capture if paused
    if (isPaused) return;

    // Create log entry
    const entry: LogEntry = {
      id: logIdCounter++,
      timestamp: Date.now(),
      level,
      args: [...args],
      formatted: formatLogArgs(args),
    };

    // Add to logs array
    logs.push(entry);

    // Notify all listeners
    listeners.forEach((listener) => listener(entry));
  };
}

// Initialize interception (runs immediately when module is imported)
if (typeof window !== "undefined") {
  console.log = interceptConsole("log", originalConsole.log);
  console.warn = interceptConsole("warn", originalConsole.warn);
  console.error = interceptConsole("error", originalConsole.error);
  console.info = interceptConsole("info", originalConsole.info);
  console.debug = interceptConsole("debug", originalConsole.debug);
}

// Public API
export const consoleInterceptor = {
  getLogs: () => [...logs],
  clearLogs: () => {
    logs.length = 0;
    logIdCounter = 0;
  },
  subscribe: (listener: LogListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setPaused: (paused: boolean) => {
    isPaused = paused;
  },
  isPaused: () => isPaused,
};

