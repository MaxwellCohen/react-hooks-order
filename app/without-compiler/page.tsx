import type { Metadata } from "next";
import Parent from "@/app/components/without-compiler/Parent";
import ConsoleLogViewer from "@/app/components/ConsoleLogViewer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Without React Compiler",
  description:
    "Visualize React hooks execution order in a demo without React Compiler, with detailed console logging.",
};

export default function WithoutCompilerPage() {
  "use no memo";
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-start p-16 bg-white dark:bg-black">
        <div className="mb-8 w-full">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-semibold mb-2 text-black dark:text-zinc-50">
            React Hooks Execution Order (Without Compiler)
          </h1>
          <p className="text-lg mb-4 text-zinc-600 dark:text-zinc-400">
            Check the browser console to see the order of hook execution.
          </p>
        </div>
        <Parent />
      </main>
      <ConsoleLogViewer />
    </div>
  );
}
