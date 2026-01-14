"use client";
// This component ensures console interception happens early on the client
// Importing the module here (in a client component) ensures it only runs on the client
import "@/app/components/consoleInterceptor";

export default function ConsoleInterceptorInit() {
  // This component doesn't render anything, it just ensures the module is imported
  return null;
}

