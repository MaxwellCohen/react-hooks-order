"use client";
"use no memo";
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { useAppContext } from "@/app/components/without-compiler/AppContext";

export interface GrandkidHandle {
  getValue: () => number;
}

const Grandkid = forwardRef<GrandkidHandle>((props, ref) => {
  "use no memo";
  const [count, setCount] = useState(() => {
    console.log("🟪 Grandkid: useState initializer ran");
    return 0;
  });

  const internalRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    console.log("🟪 Grandkid: useImperativeHandle ran");
    return {
      getValue: () => count,
    };
  }, [count]);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟪 Grandkid: reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟪 Grandkid: useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟪 Grandkid: useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟪 Grandkid: useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  const { contextValue } = useAppContext();
  console.log("🟪 Grandkid: useContext ran, contextValue:", contextValue);

  useEffect(() => {
    console.log("🟪 Grandkid: useEffect ran");
    return () => {
      console.log("🟪 Grandkid: useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟪 Grandkid: useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟪 Grandkid: useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟪 Grandkid: useLayoutEffect ran");
    return () => {
      console.log("🟪 Grandkid: useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟪 Grandkid: useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟪 Grandkid: useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("🟪 Grandkid: useEffect (contextValue changed) ran, contextValue:", contextValue);
  }, [contextValue]);

  console.log("🟪 Grandkid: render");

  return (
    <div ref={(el) => { console.log("🟪 Grandkid: ref callback ran, element:", el); internalRef.current = el; }} className="p-4 border-2 border-purple-500 rounded-lg bg-purple-50">
      <h5 className="text-sm font-bold text-purple-700 mb-2">Grandkid</h5>
      <p className="text-xs text-purple-600 mb-2">Count: {count}</p>
      <p className="text-xs text-purple-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-xs text-purple-600 mb-2">Reducer State: {reducerState}</p>
      <p className="text-xs text-purple-600 mb-2">Context Value: {contextValue}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { console.log("🟪 Grandkid: onClick (Increment Count) triggered"); setCount(count + 1); }}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          Increment Count
        </button>
        <button
          onClick={() => { console.log("🟪 Grandkid: onClick (Increment Reducer) triggered"); dispatch({ type: "increment" }); }}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
        >
          Increment Reducer
        </button>
      </div>
    </div>
  );
});

Grandkid.displayName = "Grandkid";

export default Grandkid;

