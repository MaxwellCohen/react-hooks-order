"use client";

import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";

interface ParentWrapperProps {
  children: React.ReactNode;
}

export default function ParentWrapperWithCompiler({ children }: ParentWrapperProps) {
  const [count, setCount] = useState(() => {
    console.log("🟨 ParentWrapper (Compiler): useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟨 ParentWrapper (Compiler): reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟨 ParentWrapper (Compiler): useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟨 ParentWrapper (Compiler): useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟨 ParentWrapper (Compiler): useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  useEffect(() => {
    console.log("🟨 ParentWrapper (Compiler): useEffect ran");
    return () => {
      console.log("🟨 ParentWrapper (Compiler): useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟨 ParentWrapper (Compiler): useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟨 ParentWrapper (Compiler): useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟨 ParentWrapper (Compiler): useLayoutEffect ran");
    return () => {
      console.log("🟨 ParentWrapper (Compiler): useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟨 ParentWrapper (Compiler): useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟨 ParentWrapper (Compiler): useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  console.log("🟨 ParentWrapper (Compiler): render");

  return (
    <div ref={(el) => { console.log("🟨 ParentWrapper (Compiler): ref callback ran, element:", el); ref.current = el; }} className="p-4 border-2 border-yellow-500 rounded-lg bg-yellow-50 mt-4">
      <h3 className="text-lg font-bold text-yellow-700 mb-2">ParentWrapper (Compiler)</h3>
      <p className="text-sm text-yellow-600 mb-2">Count: {count}</p>
      <p className="text-sm text-yellow-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-yellow-600 mb-2">Reducer State: {reducerState}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { console.log("🟨 ParentWrapper (Compiler): onClick (Increment Count) triggered"); setCount(count + 1); }}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Increment Count
        </button>
        <button
          onClick={() => { console.log("🟨 ParentWrapper (Compiler): onClick (Increment Reducer) triggered"); dispatch({ type: "increment" }); }}
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

