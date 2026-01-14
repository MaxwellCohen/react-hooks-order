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

export default function AsyncChildDynamicWithCompiler() {
  const data = use(getCachedPromise("async-child-dynamic-compiler"));
  console.log("🟨 AsyncChildDynamic (Compiler): use hook resolved, data:", data);

  const [count, setCount] = useState(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟨 AsyncChildDynamic (Compiler): reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟨 AsyncChildDynamic (Compiler): useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟨 AsyncChildDynamic (Compiler): useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const handleIncrementCount = useCallback(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useCallback (handleIncrementCount) ran");
    console.log("🟨 AsyncChildDynamic (Compiler): onClick (Increment Count) triggered");
    setCount((prev) => prev + 1);
  }, []);

  const { contextValue, setContextValue } = useAppContextWithCompiler();
  console.log("🟨 AsyncChildDynamic (Compiler): useContext ran, contextValue:", contextValue);

  useEffect(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useEffect ran");
    return () => {
      console.log("🟨 AsyncChildDynamic (Compiler): useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useLayoutEffect ran");
    return () => {
      console.log("🟨 AsyncChildDynamic (Compiler): useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("🟨 AsyncChildDynamic (Compiler): useEffect (contextValue changed) ran, contextValue:", contextValue);
  }, [contextValue]);

  console.log("🟨 AsyncChildDynamic (Compiler): render");
  
  return (
    <div ref={(el) => { console.log("🟨 AsyncChildDynamic (Compiler): ref callback ran, element:", el); ref.current = el; }} className="p-4 border border-purple-300 rounded-lg bg-purple-50 dark:bg-purple-900/20">
      <h3 className="text-lg font-semibold mb-2 text-purple-950">
        AsyncChild Dynamic Component (Compiler) (SSR: false)
      </h3>
      <p className="text-purple-900 mb-2">{data}</p>
      <p className="text-sm text-purple-600 mb-2">Count: {count}</p>
      <p className="text-sm text-purple-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-purple-600 mb-2">Reducer State: {reducerState}</p>
      <p className="text-sm text-purple-600 mb-2">Context Value: {contextValue}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleIncrementCount}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          Increment Count
        </button>
        <button
          onClick={() => { console.log("🟨 AsyncChildDynamic (Compiler): onClick (Increment Reducer) triggered"); dispatch({ type: "increment" }); }}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
        >
          Increment Reducer
        </button>
        <button
          onClick={() => { console.log("🟨 AsyncChildDynamic (Compiler): onClick (Increment Context) triggered"); setContextValue(contextValue + 1); }}
          className="px-3 py-1 bg-purple-700 text-white rounded hover:bg-purple-800 text-sm"
        >
          Increment Context
        </button>
      </div>
    </div>
  );
}

