"use client";
"use no memo";

import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { useAppContext } from "@/app/components/without-compiler/AppContext";

export default function Kid2() {
  "use no memo";
  const [count, setCount] = useState(() => {
    console.log("🟧 Kid2: useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);
  console.log("🟧 Kid2: useRef ran");

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟧 Kid2: reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟧 Kid2: useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟧 Kid2: useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟧 Kid2: useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const { contextValue, setContextValue } = useAppContext();
  console.log("🟧 Kid2: useContext ran, contextValue:", contextValue);

  useEffect(() => {
    console.log("🟧 Kid2: useEffect ran");
    return () => {
      console.log("🟧 Kid2: useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟧 Kid2: useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟧 Kid2: useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟧 Kid2: useLayoutEffect ran");
    return () => {
      console.log("🟧 Kid2: useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟧 Kid2: useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟧 Kid2: useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("🟧 Kid2: useEffect (contextValue changed) ran, contextValue:", contextValue);
  }, [contextValue]);

  console.log("🟧 Kid2: render");

  return (
    <div ref={ref} className="p-4 border-2 border-orange-500 rounded-lg bg-orange-50 flex-1">
      <h4 className="text-md font-bold text-orange-700 mb-2">Kid2</h4>
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

