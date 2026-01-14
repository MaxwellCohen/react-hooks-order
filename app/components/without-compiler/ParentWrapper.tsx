"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";

interface ParentWrapperProps {
  children: React.ReactNode;
}

export default function ParentWrapper({ children }: ParentWrapperProps) {
  "use no memo";
  const [count, setCount] = useState(() => {
    console.log("🟨 ParentWrapper: useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟨 ParentWrapper: reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟨 ParentWrapper: useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟨 ParentWrapper: useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟨 ParentWrapper: useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const handleIncrementCount = useCallback(() => {
    console.log("🟨 ParentWrapper: useCallback (handleIncrementCount) ran");
    console.log("🟨 ParentWrapper: onClick (Increment Count) triggered");
    setCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    console.log("🟨 ParentWrapper: useEffect ran");
    return () => {
      console.log("🟨 ParentWrapper: useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟨 ParentWrapper: useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟨 ParentWrapper: useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟨 ParentWrapper: useLayoutEffect ran");
    return () => {
      console.log("🟨 ParentWrapper: useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟨 ParentWrapper: useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟨 ParentWrapper: useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  console.log("🟨 ParentWrapper: render");

  return (
    <div ref={(el) => { console.log("🟨 ParentWrapper: ref callback ran, element:", el); ref.current = el; }} className="p-4 border-2 border-yellow-500 rounded-lg bg-yellow-50 mt-4">
      <h3 className="text-lg font-bold text-yellow-700 mb-2">ParentWrapper</h3>
      <p className="text-sm text-yellow-600 mb-2">Count: {count}</p>
      <p className="text-sm text-yellow-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-yellow-600 mb-2">Reducer State: {reducerState}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={handleIncrementCount}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Increment Count
        </button>
        <button
          onClick={() => { console.log("🟨 ParentWrapper: onClick (Increment Reducer) triggered"); dispatch({ type: "increment" }); }}
          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Increment Reducer
        </button>
      </div>
      <div className="mt-4 flex gap-4">
        {children}
      </div>
    </div>
  );
}

