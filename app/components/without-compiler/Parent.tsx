"use client";
"use no memo";
import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import ParentWrapper from "@/app/components/without-compiler/ParentWrapper";
import Kid from "@/app/components/without-compiler/Kid";
import Kid2 from "@/app/components/without-compiler/Kid2";
import { AppContextProvider, useAppContext } from "@/app/components/without-compiler/AppContext";

function ParentContent() {
  "use no memo";
  const [count, setCount] = useState(() => {
    console.log("🟦 Parent: useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟦 Parent: reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟦 Parent: useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟦 Parent: useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟦 Parent: useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const { contextValue, setContextValue } = useAppContext();
  console.log("🟦 Parent: useContext ran, contextValue:", contextValue);

  useEffect(() => {
    console.log("🟦 Parent: useEffect ran");
    return () => {
      console.log("🟦 Parent: useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟦 Parent: useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟦 Parent: useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟦 Parent: useLayoutEffect ran");
    return () => {
      console.log("🟦 Parent: useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟦 Parent: useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟦 Parent: useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("🟦 Parent: useEffect (contextValue changed) ran, contextValue:", contextValue);
  }, [contextValue]);

  console.log("🟦 Parent: render");

  return (
    <div ref={(el) => { console.log("🟦 Parent: ref callback ran, element:", el); ref.current = el; }} className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
      <h2 className="text-xl font-bold text-blue-700 mb-2">Parent</h2>
      <p className="text-sm text-blue-600 mb-2">Count: {count}</p>
      <p className="text-sm text-blue-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-blue-600 mb-2">Reducer State: {reducerState}</p>
      <p className="text-sm text-blue-600 mb-2">Context Value: {contextValue}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { console.log("🟦 Parent: onClick (Increment Count) triggered"); setCount(count + 1); }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment Count
        </button>
        <button
          onClick={() => { console.log("🟦 Parent: onClick (Increment Reducer) triggered"); dispatch({ type: "increment" }); }}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Increment Reducer
        </button>
        <button
          onClick={() => { console.log("🟦 Parent: onClick (Increment Context) triggered"); setContextValue(contextValue + 1); }}
          className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          Increment Context
        </button>
      </div>
      <div className="mt-4">
        <ParentWrapper>
          <Kid />
          <Kid2 />
        </ParentWrapper>
      </div>
    </div>
  );
}

export default function Parent() {
  "use no memo";
  return (
    <AppContextProvider>
      <ParentContent />
    </AppContextProvider>
  );
}

