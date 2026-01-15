/* eslint-disable @typescript-eslint/no-explicit-any */
// This module intercepts console methods immediately when imported
// It runs before React components mount, ensuring we capture all logs

type LogLevel = "log" | "warn" | "error" | "info" | "debug";

export type HookType =
  | "useState"
  | "useReducer"
  | "useMemo"
  | "useCallback"
  | "useEffect"
  | "useLayoutEffect"
  | "useTransition"
  | "useOptimistic"
  | "useContext"
  | "useRef"
  | "ref-callback"
  | "render"
  | "other";

export interface LogEntry {
  id: number;
  timestamp: number;
  level: LogLevel;
  args: unknown[];
  formatted: string;
  source?: "client" | "server";
  hookType?: HookType;
}

// Global store for logs
const logs: LogEntry[] = [];
let logIdCounter = 0;
const listeners = new Set<() => void>();

// Cached empty array for server snapshot to avoid creating new arrays
const EMPTY_LOGS: LogEntry[] = [];

// Server logs storage (per-request in Next.js)
// eslint-disable-next-line prefer-const
let serverLogs: LogEntry[] = [];
let serverLogIdCounter = 0;

// Notify all listeners of changes
function notifyListeners() {
  listeners.forEach((listener) => listener());
}

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

// Detect hook type from log message
function detectHookType(formatted: string): HookType {
  const lower = formatted.toLowerCase();
  
  // Check for specific hook patterns
  if (lower.includes("usestate")) return "useState";
  if (lower.includes("usereducer")) return "useReducer";
  if (lower.includes("usememo")) return "useMemo";
  if (lower.includes("usecallback")) return "useCallback";
  if (lower.includes("useeffect")) return "useEffect";
  if (lower.includes("uselayouteffect")) return "useLayoutEffect";
  if (lower.includes("usetransition")) return "useTransition";
  if (lower.includes("useoptimistic")) return "useOptimistic";
  if (lower.includes("usecontext")) return "useContext";
  if (lower.includes("useref")) return "useRef";
  if (lower.includes("ref callback") || lower.includes("refcallback")) return "ref-callback";
  if (lower.includes("render") && !lower.includes("rendered") && !lower.includes("rendering")) return "render";
  
  return "other";
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
function interceptConsole(
  level: LogLevel,
  originalMethod: typeof console.log,
  source: "client" | "server" = "client"
) {
  return (...args: unknown[]) => {
    // Call original console method
    originalMethod(...args);

    // Format log arguments
    const formatted = formatLogArgs(args);
    
    // Detect hook type from formatted message
    const hookType = detectHookType(formatted);

    // Create log entry
    const entry: LogEntry = {
      id: source === "client" ? logIdCounter++ : serverLogIdCounter++,
      timestamp: Date.now(),
      level,
      args: [...args],
      formatted,
      source,
      hookType,
    };

    // Add to appropriate logs array
    if (source === "client") {
      logs.push(entry);
      // Notify all listeners
      notifyListeners();
    } else {
      serverLogs.push(entry);
    }
  };
}

// Initialize client-side interception (runs immediately when module is imported on client)
if (typeof window !== "undefined") {
  console.log = interceptConsole("log", originalConsole.log, "client");
  console.warn = interceptConsole("warn", originalConsole.warn, "client");
  console.error = interceptConsole("error", originalConsole.error, "client");
  console.info = interceptConsole("info", originalConsole.info, "client");
  console.debug = interceptConsole("debug", originalConsole.debug, "client");

  // Merge server logs from window if they exist
  if (typeof window !== "undefined" && (window as any).__SERVER_LOGS__) {
    const serverLogsFromWindow = (window as any).__SERVER_LOGS__ as LogEntry[];
    // Merge server logs with client logs, ensuring proper IDs
    serverLogsFromWindow.forEach((log) => {
      log.id = logIdCounter++;
      logs.push(log);
    });
    notifyListeners();
    // Clean up
    delete (window as any).__SERVER_LOGS__;
  }
}

// Initialize server-side interception (runs when module is imported on server)
if (typeof window === "undefined") {
  console.log = interceptConsole("log", originalConsole.log, "server");
  console.warn = interceptConsole("warn", originalConsole.warn, "server");
  console.error = interceptConsole("error", originalConsole.error, "server");
  console.info = interceptConsole("info", originalConsole.info, "server");
  console.debug = interceptConsole("debug", originalConsole.debug, "server");
}

// Public API for useSyncExternalStore
export const consoleInterceptor = {
  getLogs: () => [...logs],
  clearLogs: () => {
    logs.length = 0;
    logIdCounter = 0;
    notifyListeners();
  },
  subscribe: (onStoreChange: () => void) => {
    listeners.add(onStoreChange);
    return () => {
      listeners.delete(onStoreChange);
    };
  },
  getSnapshot: () => logs,
  getServerSnapshot: () => EMPTY_LOGS,
  // Server-side API
  getServerLogs: () => [...serverLogs],
  clearServerLogs: () => {
    serverLogs.length = 0;
    serverLogIdCounter = 0;
  },
};

