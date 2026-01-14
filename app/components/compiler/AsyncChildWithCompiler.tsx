"use client";

import { use, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { useAppContextWithCompiler } from "@/app/components/compiler/AppContextWithCompiler";

// Cache for the promise to ensure it's reused across renders
const promiseCache = new Map<string, Promise<string>>();

function getCachedPromise(key: string): Promise<string> {
  if (!promiseCache.has(key)) {
    promiseCache.set(
      key,
      new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(`Async data loaded after 2s (key: ${key})`);
        }, 2000);
      })
    );
  }
  return promiseCache.get(key)!;
}

export default function AsyncChildWithCompiler() {
  const data = use(getCachedPromise("async-child-compiler"));
  console.log("🟨 AsyncChild (Compiler): use hook resolved, data:", data);

  const [count, setCount] = useState(() => {
    console.log("🟨 AsyncChild (Compiler): useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟨 AsyncChild (Compiler): reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟨 AsyncChild (Compiler): useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟨 AsyncChild (Compiler): useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟨 AsyncChild (Compiler): useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const handleIncrementCount = useCallback(() => {
    console.log("🟨 AsyncChild (Compiler): useCallback (handleIncrementCount) ran");
    console.log("🟨 AsyncChild (Compiler): onClick (Increment Count) triggered");
    setCount((prev) => prev + 1);
  }, []);

  const { contextValue, setContextValue } = useAppContextWithCompiler();
  console.log("🟨 AsyncChild (Compiler): useContext ran, contextValue:", contextValue);

  useEffect(() => {
    console.log("🟨 AsyncChild (Compiler): useEffect ran");
    return () => {
      console.log("🟨 AsyncChild (Compiler): useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟨 AsyncChild (Compiler): useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟨 AsyncChild (Compiler): useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟨 AsyncChild (Compiler): useLayoutEffect ran");
    return () => {
      console.log("🟨 AsyncChild (Compiler): useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟨 AsyncChild (Compiler): useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟨 AsyncChild (Compiler): useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("🟨 AsyncChild (Compiler): useEffect (contextValue changed) ran, contextValue:", contextValue);
  }, [contextValue]);

  console.log("🟨 AsyncChild (Compiler): render");
  
  return (
    <div ref={(el) => { console.log("🟨 AsyncChild (Compiler): ref callback ran, element:", el); ref.current = el; }} className="p-4 border border-blue-300 rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <h3 className="text-lg font-semibold mb-2 text-blue-950">
        AsyncChild Component (Compiler)
      </h3>
      <p className="text-blue-900 mb-2">{data}</p>
      <p className="text-sm text-blue-600 mb-2">Count: {count}</p>
      <p className="text-sm text-blue-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-blue-600 mb-2">Reducer State: {reducerState}</p>
      <p className="text-sm text-blue-600 mb-2">Context Value: {contextValue}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleIncrementCount}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Increment Count
        </button>
        <button
          onClick={() => { console.log("🟨 AsyncChild (Compiler): onClick (Increment Reducer) triggered"); dispatch({ type: "increment" }); }}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Increment Reducer
        </button>
        <button
          onClick={() => { console.log("🟨 AsyncChild (Compiler): onClick (Increment Context) triggered"); setContextValue(contextValue + 1); }}
          className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 text-sm"
        >
          Increment Context
        </button>
      </div>
    </div>
  );
}

