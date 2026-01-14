"use client";

import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import GrandkidWithCompiler from "@/app/components/compiler/GrandkidWithCompiler";

export interface KidHandleWithCompiler {
  getValue: () => number;
}

const KidWithCompiler = forwardRef<KidHandleWithCompiler>((props, ref) => {
  const [count, setCount] = useState(() => {
    console.log("🟩 Kid (Compiler): useState initializer ran");
    return 0;
  });

  const internalRef = useRef<HTMLDivElement>(null);
  console.log("🟩 Kid (Compiler): useRef ran");

  useImperativeHandle(ref, () => {
    console.log("🟩 Kid (Compiler): useImperativeHandle ran");
    return {
      getValue: () => count,
    };
  }, [count]);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟩 Kid (Compiler): reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟩 Kid (Compiler): useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟩 Kid (Compiler): useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟩 Kid (Compiler): useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  useEffect(() => {
    console.log("🟩 Kid (Compiler): useEffect ran");
    return () => {
      console.log("🟩 Kid (Compiler): useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟩 Kid (Compiler): useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟩 Kid (Compiler): useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟩 Kid (Compiler): useLayoutEffect ran");
    return () => {
      console.log("🟩 Kid (Compiler): useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟩 Kid (Compiler): useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟩 Kid (Compiler): useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  console.log("🟩 Kid (Compiler): render");

  return (
    <div ref={internalRef} className="p-4 border-2 border-green-500 rounded-lg bg-green-50 flex-1">
      <h4 className="text-md font-bold text-green-700 mb-2">Kid (Compiler)</h4>
      <p className="text-sm text-green-600 mb-2">Count: {count}</p>
      <p className="text-sm text-green-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-green-600 mb-2">Reducer State: {reducerState}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Increment Count
        </button>
        <button
          onClick={() => dispatch({ type: "increment" })}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Increment Reducer
        </button>
      </div>
      <div className="mt-4">
        <GrandkidWithCompiler />
      </div>
    </div>
  );
});

KidWithCompiler.displayName = "KidWithCompiler";

export default KidWithCompiler;

