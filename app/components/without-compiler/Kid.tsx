"use client";
"use no memo";
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import Grandkid from "@/app/components/without-compiler/Grandkid";

export interface KidHandle {
  getValue: () => number;
}

const Kid = forwardRef<KidHandle>((props, ref) => {
  "use no memo";
  const [count, setCount] = useState(() => {
    console.log("🟩 Kid: useState initializer ran");
    return 0;
  });

  const internalRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    console.log("🟩 Kid: useImperativeHandle ran");
    return {
      getValue: () => count,
    };
  }, [count]);

  const reducer = (state: number, action: { type: string }) => {
    console.log("🟩 Kid: reducer ran, state:", state, "action:", action.type);
    if (action.type === "increment") {
      return state + 1;
    }
    return state;
  };
  const init = (initialArg: number) => {
    console.log("🟩 Kid: useReducer init function ran, initialArg:", initialArg);
    return initialArg;
  };
  const [reducerState, dispatch] = useReducer(reducer, 0, init);
  console.log("🟩 Kid: useReducer ran, state:", reducerState);

  const memoizedValue = useMemo(() => {
    console.log("🟩 Kid: useMemo ran, count:", count);
    return count * 2;
  }, [count]);

  useEffect(() => {
    console.log("🟩 Kid: useEffect ran");
    return () => {
      console.log("🟩 Kid: useEffect cleanup");
    };
  });

  useEffect(() => {
    console.log("🟩 Kid: useEffect (mount) ran");
  }, []);

  useEffect(() => {
    console.log("🟩 Kid: useEffect (count changed) ran, count:", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("🟩 Kid: useLayoutEffect ran");
    return () => {
      console.log("🟩 Kid: useLayoutEffect cleanup");
    };
  });

  useLayoutEffect(() => {
    console.log("🟩 Kid: useLayoutEffect (mount) ran");
  }, []);

  useLayoutEffect(() => {
    console.log("🟩 Kid: useLayoutEffect (count changed) ran, count:", count);
  }, [count]);

  console.log("🟩 Kid: render");

  return (
    <div ref={(el) => { console.log("🟩 Kid: ref callback ran, element:", el); internalRef.current = el; }} className="p-4 border-2 border-green-500 rounded-lg bg-green-50 flex-1">
      <h4 className="text-md font-bold text-green-700 mb-2">Kid</h4>
      <p className="text-sm text-green-600 mb-2">Count: {count}</p>
      <p className="text-sm text-green-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-green-600 mb-2">Reducer State: {reducerState}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { console.log("🟩 Kid: onClick (Increment Count) triggered"); setCount(count + 1); }}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Increment Count
        </button>
        <button
          onClick={() => { console.log("🟩 Kid: onClick (Increment Reducer) triggered"); dispatch({ type: "increment" }); }}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Increment Reducer
        </button>
      </div>
      <div className="mt-4">
        <Grandkid />
      </div>
    </div>
  );
});

Kid.displayName = "Kid";

export default Kid;

