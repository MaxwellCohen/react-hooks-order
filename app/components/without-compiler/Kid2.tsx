"use client";
"use no memo";

import { useCallback, useEffect, useLayoutEffect, useMemo, useOptimistic, useReducer, useRef, useState, useTransition } from "react";
import { useAppContext } from "@/app/components/without-compiler/AppContext";

export default function Kid2() {
  "use no memo";
  const [count, setCount] = useState(() => {
    console.log("🟧 Kid2: useState initializer ran");
    return 0;
  });

  const ref = useRef<HTMLDivElement>(null);

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

  const [isPending, startTransition] = useTransition();
  console.log("🟧 Kid2: useTransition ran, isPending:", isPending);

  const [optimisticCount, addOptimisticCount] = useOptimistic(
    count,
    (state: number, newValue: number) => {
      console.log("🟧 Kid2: useOptimistic (count) reducer ran, state:", state, "newValue:", newValue);
      return newValue;
    }
  );
  console.log("🟧 Kid2: useOptimistic (count) ran, count:", count, "optimisticCount:", optimisticCount);

  const handleIncrementCount = useCallback(() => {
    console.log("🟧 Kid2: useCallback (handleIncrementCount) ran");
    console.log("🟧 Kid2: onClick (Increment Count) triggered");
    const newCount = count + 1;
    startTransition(async () => {
      console.log("🟧 Kid2: startTransition async callback ran");
      addOptimisticCount(newCount);
      console.log("🟧 Kid2: addOptimisticCount called with:", newCount);
      const delayPromise = new Promise<void>((resolve) => {
        console.log("🟧 Kid2: Promise created inside startTransition, setTimeout scheduled");
        setTimeout(() => {
          console.log("🟧 Kid2: Promise resolved after 1 second");
          resolve();
        }, 1000);
      });
      await delayPromise;
      console.log("🟧 Kid2: Promise awaited, setting count to:", newCount);
      setCount(newCount);
    });
  }, [count, addOptimisticCount, startTransition]);

  const { contextValue, setContextValue } = useAppContext();
  console.log("🟧 Kid2: useContext ran, contextValue:", contextValue);

  const [optimisticValue, addOptimistic] = useOptimistic(
    reducerState,
    (state: number, newValue: number) => {
      console.log("🟧 Kid2: useOptimistic reducer ran, state:", state, "newValue:", newValue);
      return newValue;
    }
  );
  console.log("🟧 Kid2: useOptimistic ran, reducerState:", reducerState, "optimisticValue:", optimisticValue);

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

  useEffect(() => {
    console.log("🟧 Kid2: useEffect (isPending changed) ran, isPending:", isPending);
  }, [isPending]);

  useEffect(() => {
    console.log("🟧 Kid2: useEffect (optimisticValue changed) ran, optimisticValue:", optimisticValue);
  }, [optimisticValue]);

  useEffect(() => {
    console.log("🟧 Kid2: useEffect (optimisticCount changed) ran, optimisticCount:", optimisticCount);
  }, [optimisticCount]);

  console.log("🟧 Kid2: render");

  return (
    <div ref={(el) => { console.log("🟧 Kid2: ref callback ran, element:", el); ref.current = el; }} className="p-4 border-2 border-orange-500 rounded-lg bg-orange-50 flex-1">
      <h4 className="text-md font-bold text-orange-700 mb-2">Kid2</h4>
      <p className="text-sm text-orange-600 mb-2">Count: {count}</p>
      <p className="text-sm text-orange-600 mb-2">Optimistic Count: {optimisticCount}</p>
      <p className="text-sm text-orange-600 mb-2">Memoized: {memoizedValue}</p>
      <p className="text-sm text-orange-600 mb-2">Reducer State: {reducerState}</p>
      <p className="text-sm text-orange-600 mb-2">Optimistic Value: {optimisticValue}</p>
      <p className="text-sm text-orange-600 mb-2">Context Value: {contextValue}</p>
      <p className="text-sm text-orange-600 mb-2">Transition Pending: {isPending ? "Yes" : "No"}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleIncrementCount}
          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Increment Count
        </button>
        <button
          onClick={() => { 
            console.log("🟧 Kid2: onClick (Increment Reducer) triggered"); 
            const newValue = reducerState + 1;
            startTransition(async () => {
              console.log("🟧 Kid2: startTransition async callback ran");
              addOptimistic(newValue);
              console.log("🟧 Kid2: addOptimistic called with:", newValue);
              const delayPromise = new Promise<void>((resolve) => {
                console.log("🟧 Kid2: Promise created inside startTransition, setTimeout scheduled");
                setTimeout(() => {
                  console.log("🟧 Kid2: Promise resolved after 1 second");
                  resolve();
                }, 1000);
              });
              await delayPromise;
              addOptimistic(newValue);
              console.log("🟧 Kid2: addOptimistic called with:", newValue);
              dispatch({ type: "increment" }); 
            });
          }}
          className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Increment Reducer
        </button>
        <button
          onClick={() => { console.log("🟧 Kid2: onClick (Increment Context) triggered"); setContextValue(contextValue + 1); }}
          className="px-3 py-1 bg-orange-700 text-white rounded hover:bg-orange-800"
        >
          Increment Context
        </button>
      </div>
    </div>
  );
}

