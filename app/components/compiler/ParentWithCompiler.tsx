"use client";

import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import ParentWrapperWithCompiler from "@/app/components/compiler/ParentWrapperWithCompiler";
import KidWithCompiler from "@/app/components/compiler/KidWithCompiler";
import Kid2WithCompiler from "@/app/components/compiler/Kid2WithCompiler";
import { AppContextProviderWithCompiler, useAppContextWithCompiler } from "@/app/components/compiler/AppContextWithCompiler";

function ParentContentWithCompiler() {
  const [count, setCount] = useState(() => {
    console.log("🟦 Parent (Compiler): useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟦 Parent (Compiler): reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟦 Parent (Compiler): useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟦 Parent (Compiler): useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟦 Parent (Compiler): useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const { contextValue, setContextValue } = useAppContextWithCompiler();
  console.log("🟦 Parent (Compiler): useContext ran, contextValue:", contextValue);

  useEffect(() => {
    console.log("🟦 Parent (Compiler): useEffect ran");
    return () => {
      console.log("🟦 Parent (Compiler): useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟦 Parent (Compiler): useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟦 Parent (Compiler): useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟦 Parent (Compiler): useLayoutEffect ran");
    return () => {
      console.log("🟦 Parent (Compiler): useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟦 Parent (Compiler): useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟦 Parent (Compiler): useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("🟦 Parent (Compiler): useEffect (contextValue changed) ran, contextValue:", contextValue);
  }, [contextValue]);

  console.log("🟦 Parent (Compiler): render");

  return (
    <div ref={(el) => { console.log("🟦 Parent (Compiler): ref callback ran, element:", el); ref.current = el; }} className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
      <h2 className="text-xl font-bold text-blue-700 mb-2">Parent (Compiler)</h2>
      <p className="text-sm text-blue-600 mb-2">Count: {count}</p>
      <p className="text-sm text-blue-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-blue-600 mb-2">Reducer State: {reducerState}</p>
      <p className="text-sm text-blue-600 mb-2">Context Value: {contextValue}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { console.log("🟦 Parent (Compiler): onClick (Increment Count) triggered"); setCount(count + 1); }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment Count
        </button>
        <button
          onClick={() => { console.log("🟦 Parent (Compiler): onClick (Increment Reducer) triggered"); dispatch({ type: "increment" }); }}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Increment Reducer
        </button>
        <button
          onClick={() => { console.log("🟦 Parent (Compiler): onClick (Increment Context) triggered"); setContextValue(contextValue + 1); }}
          className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          Increment Context
        </button>
      </div>
      <div className="mt-4">
        <ParentWrapperWithCompiler>
          <KidWithCompiler />
          <Kid2WithCompiler />
        </ParentWrapperWithCompiler>
      </div>
    </div>
  );
}

export default function ParentWithCompiler() {
  return (
    <AppContextProviderWithCompiler>
      <ParentContentWithCompiler />
    </AppContextProviderWithCompiler>
  );
}

