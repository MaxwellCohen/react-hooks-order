"use client";
import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { useAppContextWithCompiler } from "@/app/components/compiler/AppContextWithCompiler";

export default function Kid2WithCompiler() {
  const [count, setCount] = useState(() => {
    console.log("🟧 Kid2 (Compiler): useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);
  console.log("🟧 Kid2 (Compiler): useRef ran");

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟧 Kid2 (Compiler): reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟧 Kid2 (Compiler): useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟧 Kid2 (Compiler): useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟧 Kid2 (Compiler): useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const { contextValue, setContextValue } = useAppContextWithCompiler();
  console.log("🟧 Kid2 (Compiler): useContext ran, contextValue:", contextValue);

  useEffect(() => {
    console.log("🟧 Kid2 (Compiler): useEffect ran");
    return () => {
      console.log("🟧 Kid2 (Compiler): useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟧 Kid2 (Compiler): useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟧 Kid2 (Compiler): useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟧 Kid2 (Compiler): useLayoutEffect ran");
    return () => {
      console.log("🟧 Kid2 (Compiler): useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟧 Kid2 (Compiler): useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟧 Kid2 (Compiler): useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("🟧 Kid2 (Compiler): useEffect (contextValue changed) ran, contextValue:", contextValue);
  }, [contextValue]);

  console.log("🟧 Kid2 (Compiler): render");

  return (
    <div ref={ref} className="p-4 border-2 border-orange-500 rounded-lg bg-orange-50 flex-1">
      <h4 className="text-md font-bold text-orange-700 mb-2">Kid2 (Compiler)</h4>
      <p className="text-sm text-orange-600 mb-2">Count: {count}</p>
      <p className="text-sm text-orange-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-orange-600 mb-2">Reducer State: {reducerState}</p>
      <p className="text-sm text-orange-600 mb-2">Context Value: {contextValue}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Increment Count
        </button>
        <button
          onClick={() => dispatch({ type: "increment" })}
          className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Increment Reducer
        </button>
        <button
          onClick={() => setContextValue(contextValue + 1)}
          className="px-3 py-1 bg-orange-700 text-white rounded hover:bg-orange-800"
        >
          Increment Context
        </button>
      </div>
    </div>
  );
}

