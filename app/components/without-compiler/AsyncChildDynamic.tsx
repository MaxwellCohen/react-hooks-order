"use client";
"use no memo";
import { use, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { useAppContext } from "@/app/components/without-compiler/AppContext";

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

export default function AsyncChildDynamic() {
  "use no memo";
  const data = use(getCachedPromise("async-child-dynamic"));
  console.log("🟨 AsyncChildDynamic: use hook resolved, data:", data);

  const [count, setCount] = useState(() => {
    console.log("🟨 AsyncChildDynamic: useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟨 AsyncChildDynamic: reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟨 AsyncChildDynamic: useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟨 AsyncChildDynamic: useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟨 AsyncChildDynamic: useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const handleIncrementCount = useCallback(() => {
    console.log("🟨 AsyncChildDynamic: useCallback (handleIncrementCount) ran");
    console.log("🟨 AsyncChildDynamic: onClick (Increment Count) triggered");
    setCount((prev) => prev + 1);
  }, []);

  const { contextValue, setContextValue } = useAppContext();
  console.log("🟨 AsyncChildDynamic: useContext ran, contextValue:", contextValue);

  useEffect(() => {
    console.log("🟨 AsyncChildDynamic: useEffect ran");
    return () => {
      console.log("🟨 AsyncChildDynamic: useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟨 AsyncChildDynamic: useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟨 AsyncChildDynamic: useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟨 AsyncChildDynamic: useLayoutEffect ran");
    return () => {
      console.log("🟨 AsyncChildDynamic: useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟨 AsyncChildDynamic: useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟨 AsyncChildDynamic: useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("🟨 AsyncChildDynamic: useEffect (contextValue changed) ran, contextValue:", contextValue);
  }, [contextValue]);

  console.log("🟨 AsyncChildDynamic: render");
  
  return (
    <div ref={(el) => { console.log("🟨 AsyncChildDynamic: ref callback ran, element:", el); ref.current = el; }} className="p-4 border border-purple-300 rounded-lg bg-purple-50 dark:bg-purple-900/20">
      <h3 className="text-lg font-semibold mb-2 text-purple-950">
        AsyncChild Dynamic Component (SSR: false)
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
          onClick={() => { console.log("🟨 AsyncChildDynamic: onClick (Increment Reducer) triggered"); dispatch({ type: "increment" }); }}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
        >
          Increment Reducer
        </button>
        <button
          onClick={() => { console.log("🟨 AsyncChildDynamic: onClick (Increment Context) triggered"); setContextValue(contextValue + 1); }}
          className="px-3 py-1 bg-purple-700 text-white rounded hover:bg-purple-800 text-sm"
        >
          Increment Context
        </button>
      </div>
    </div>
  );
}

