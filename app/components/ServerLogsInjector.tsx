import Script from "next/script";
import { consoleInterceptor } from "./consoleInterceptor";

export default function ServerLogsInjector() {
  // Get server logs (this runs on the server)
  const serverLogs = consoleInterceptor.getServerLogs();

  // If there are no server logs, don't inject anything
  if (serverLogs.length === 0) {
    return null;
  }

  // Serialize server logs and inject them into the page
  const serverLogsJson = JSON.stringify(serverLogs);

  return (
    <Script
      id="server-logs-injector"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `window.__SERVER_LOGS__ = ${serverLogsJson};`,
      }}
    />
  );
}

