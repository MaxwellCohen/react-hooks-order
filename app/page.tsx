import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Choose a demo to visualize React hooks execution order, with or without React Compiler.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-16 bg-white dark:bg-black">
        <h1 className="text-4xl font-semibold mb-8 text-black dark:text-zinc-50 text-center">
          React Hooks Execution Order Visualization
        </h1>
        <p className="text-lg mb-12 text-zinc-600 dark:text-zinc-400 text-center max-w-2xl">
          Explore how React hooks execute in different scenarios. Check the browser console to see the order of hook execution.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Link
            href="/without-compiler"
            className="flex items-center justify-center h-16 px-6 rounded-lg bg-blue-500 text-white font-medium transition-colors hover:bg-blue-600 text-lg"
          >
            Without React Compiler
          </Link>
          <Link
            href="/with-compiler"
            className="flex items-center justify-center h-16 px-6 rounded-lg bg-green-500 text-white font-medium transition-colors hover:bg-green-600 text-lg"
          >
            With React Compiler
          </Link>
        </div>
      </main>
    </div>
  );
}
