"use client";

import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { useAppContextWithCompiler } from "@/app/components/compiler/AppContextWithCompiler";

export interface GrandkidHandleWithCompiler {
  getValue: () => number;
}

const GrandkidWithCompiler = forwardRef<GrandkidHandleWithCompiler>((props, ref) => {
  const [count, setCount] = useState(() => {
    console.log("🟪 Grandkid (Compiler): useState initializer ran");
    return 0;
  });

  const internalRef = useRef<HTMLDivElement>(null);
  console.log("🟪 Grandkid (Compiler): useRef ran");

  useImperativeHandle(ref, () => {
    console.log("🟪 Grandkid (Compiler): useImperativeHandle ran");
    return {
      getValue: () => count,
    };
  }, [count]);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟪 Grandkid (Compiler): reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟪 Grandkid (Compiler): useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟪 Grandkid (Compiler): useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟪 Grandkid (Compiler): useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const { contextValue } = useAppContextWithCompiler();
  console.log("🟪 Grandkid (Compiler): useContext ran, contextValue:", contextValue);

  useEffect(() => {
    console.log("🟪 Grandkid (Compiler): useEffect ran");
    return () => {
      console.log("🟪 Grandkid (Compiler): useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟪 Grandkid (Compiler): useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟪 Grandkid (Compiler): useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟪 Grandkid (Compiler): useLayoutEffect ran");
    return () => {
      console.log("🟪 Grandkid (Compiler): useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟪 Grandkid (Compiler): useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟪 Grandkid (Compiler): useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("🟪 Grandkid (Compiler): useEffect (contextValue changed) ran, contextValue:", contextValue);
  }, [contextValue]);

  console.log("🟪 Grandkid (Compiler): render");

  return (
    <div ref={internalRef} className="p-4 border-2 border-purple-500 rounded-lg bg-purple-50">
      <h5 className="text-sm font-bold text-purple-700 mb-2">Grandkid (Compiler)</h5>
      <p className="text-xs text-purple-600 mb-2">Count: {count}</p>
      <p className="text-xs text-purple-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-xs text-purple-600 mb-2">Reducer State: {reducerState}</p>
      <p className="text-xs text-purple-600 mb-2">Context Value: {contextValue}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          Increment Count
        </button>
        <button
          onClick={() => dispatch({ type: "increment" })}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
        >
          Increment Reducer
        </button>
      </div>
    </div>
  );
});

GrandkidWithCompiler.displayName = "GrandkidWithCompiler";

export default GrandkidWithCompiler;

