# React Hooks Execution Order Visualization

A Next.js application that demonstrates and visualizes the execution order of React hooks in a component tree. This app helps developers understand when hooks execute during React's render cycle, both with and without the React Compiler.

## Overview

This project showcases the precise order in which React hooks execute during:
- **Render Phase**: When components render and hooks are called
- **Layout Phase**: When `useLayoutEffect` hooks run (synchronously after DOM mutations)
- **Effect Phase**: When `useEffect` hooks run (asynchronously after paint)

The app includes two versions:
- **Without React Compiler**: Standard React behavior
- **With React Compiler**: React Compiler optimized behavior

## Server vs Client Execution

This is a Next.js App Router application, which means there's a clear distinction between what runs on the server and what runs on the client.

### Server Components (No Hooks)

The following components run on the **server** during Server-Side Rendering (SSR):

- **`app/layout.tsx`**: Root layout component (server component)
  - Sets up HTML structure, fonts, and global styles
  - Runs once per request on the server
  - Cannot use React hooks

- **`app/page.tsx`**: Home page (server component)
  - Renders the navigation links
  - Runs on the server during initial page load
  - Cannot use React hooks

- **`app/without-compiler/page.tsx`**: Without compiler page (server component)
  - Renders the page wrapper and imports the client component
  - Runs on the server during initial page load
  - Cannot use React hooks

- **`app/with-compiler/page.tsx`**: With compiler page (server component)
  - Renders the page wrapper and imports the client component
  - Runs on the server during initial page load
  - Cannot use React hooks

### Client Components ("use client" - Hooks Execute Here)

All components that use hooks are marked with `"use client"` and run in the **browser**:

- **`app/components/without-compiler/*`**: All components without compiler
  - `AppContext.tsx` - Context provider with hooks
  - `Parent.tsx` - Parent component with hooks
  - `ParentWrapper.tsx` - Wrapper component with hooks
  - `Kid.tsx` - Child component with hooks
  - `Kid2.tsx` - Sibling component with hooks
  - `Grandkid.tsx` - Grandchild component with hooks

- **`app/components/compiler/*`**: All components with compiler
  - Same structure as above, but with React Compiler optimizations

### What Runs on Server vs Client for "use client" Components

When a component is marked with `"use client"`, here's what happens:

#### On the Server (SSR):
- ✅ **Component code is bundled** and sent to the client
- ✅ **JSX structure is rendered** to generate initial HTML
- ✅ **Render-phase hooks execute** on the server (to generate initial HTML)
- ✅ **Hook initializers run** (e.g., `useState(() => ...)`, `useReducer(..., init)`)
- ✅ **Hook logic executes** (e.g., `useMemo`, `useReducer`, `useContext`, `useRef`)
- ✅ **`useCallback` returns a function** on the server (memoized function is created during render)
- ❌ **Effects DO NOT run** (`useEffect`, `useLayoutEffect` - these are client-only)

#### On the Client (Hydration):
- ✅ **All hooks execute** during hydration (the first client-side render)
- ✅ **Hook initializers run** (e.g., `useState(() => ...)`)
- ✅ **All hook logic executes** (e.g., `useMemo`, `useReducer`, `useContext`)
- ✅ **Effects run** after hydration completes (`useLayoutEffect` then `useEffect`)

#### After Hydration (Client-Side Renders):
- ✅ **All subsequent renders happen client-side**
- ✅ **Hooks execute normally** on every re-render
- ✅ **Effects run** according to their dependency arrays

### Execution Flow Diagram

```mermaid
sequenceDiagram
    participant Browser
    participant NextServer as Next.js Server
    participant Client as Client Components
    
    Browser->>NextServer: Request page
    NextServer->>NextServer: Render layout.tsx (server)
    NextServer->>NextServer: Render page.tsx (server)
    NextServer->>NextServer: Render "use client" components<br/>✅ Render-phase hooks execute<br/>(useState, useMemo, useReducer, etc.)
    NextServer->>NextServer: ❌ Effects do NOT run<br/>(useEffect, useLayoutEffect)
    NextServer->>NextServer: Serialize client component code
    NextServer->>Browser: Send HTML + JS bundle
    
    Note over Browser,Client: Client-side hydration begins
    
    Browser->>Client: Hydrate AppContextProvider
    Client->>Client: ✅ useState initializer runs
    Client->>Client: ✅ useState hook executes
    Client->>Client: ✅ All hooks execute (render phase)
    
    Browser->>Client: Hydrate Parent
    Client->>Client: ✅ All hooks execute (render phase)
    
    Browser->>Client: Hydrate ParentWrapper
    Client->>Client: ✅ All hooks execute (render phase)
    
    Browser->>Client: Hydrate Kid & Kid2
    Client->>Client: ✅ All hooks execute (render phase)
    
    Browser->>Client: Hydrate Grandkid
    Client->>Client: ✅ All hooks execute (render phase)
    
    Note over Browser,Client: Layout & Effect phases (client-side only)
    
    Client->>Client: ✅ useLayoutEffect (bottom-up)
    Browser->>Browser: Browser paint
    Client->>Client: ✅ useEffect (bottom-up)
    
    Note over Browser,Client: All subsequent renders are client-side
```

### Key Points About Hook Execution

1. **Server-Side Rendering (SSR)**:
   - Server components render HTML structure
   - Client components' JSX is rendered to HTML
   - **Render-phase hooks execute on the server** (useState, useMemo, useReducer, useRef, useContext, etc.)
   - **Hook initializers run on the server** (e.g., `useState(() => ...)`, `useReducer(..., init)`)
   - **Effects do NOT run on the server** (useEffect, useLayoutEffect are client-only)

2. **Client-Side Hydration**:
   - React "hydrates" the server-rendered HTML
   - **All render-phase hooks execute again** during hydration
   - **Hook initializers run again** (but should return the same values as server)
   - Hook execution order follows the same rules as server-side renders
   - **Hydration must match server output** - React will warn if there are mismatches

3. **Subsequent Renders**:
   - All re-renders happen **entirely client-side**
   - Hooks execute normally on every render
   - Effects run according to their dependency arrays

4. **Console Logs**:
   - Hook execution logs appear in **both server logs (during SSR) and browser console (during hydration)**
   - In development, you'll see server-side hook execution in terminal/server logs
   - In the browser console, you'll see client-side hook execution (hydration + subsequent renders)
   - The first render you see in the browser console is the hydration render (hooks execute again to match server output)

### Why This Matters

- **Initial Load**: Server components render HTML on the server for faster initial page load
- **Interactivity**: Client components enable interactivity and state management with hooks
- **Performance**: Server components reduce JavaScript bundle size sent to the client
- **Hook Execution**: All hook execution you observe happens in the browser, not on the server
- **Hydration**: The first hook execution you see in the console is during hydration, which matches the execution order of subsequent client-side renders

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Component Hierarchy

The app demonstrates hooks execution across a nested component tree:

```
AppContextProvider
└── Parent
    └── ParentWrapper
        ├── Kid
        │   └── Grandkid
        └── Kid2
```

## React Hooks Execution Order Cheatsheet

### Component Hierarchy Diagram

```mermaid
graph TD
    A[AppContextProvider] --> B[Parent]
    B --> C[ParentWrapper]
    C --> D[Kid]
    C --> E[Kid2]
    D --> F[Grandkid]
    
    style A fill:#e1f5ff
    style B fill:#dbeafe
    style C fill:#fef3c7
    style D fill:#d1fae5
    style E fill:#fed7aa
    style F fill:#e9d5ff
```

### Render Phase: Hook Execution Order

During the render phase, hooks execute in a **top-down, depth-first** order as React traverses the component tree:

```mermaid
sequenceDiagram
    participant AC as AppContextProvider
    participant P as Parent
    participant PW as ParentWrapper
    participant K as Kid
    participant G as Grandkid
    participant K2 as Kid2
    
    Note over AC,G: Render Phase - Hooks Execute Top to Bottom
    
    AC->>AC: useState initializer
    AC->>AC: useState hook
    AC->>AC: render
    
    AC->>P: render Parent
    P->>P: useState initializer
    P->>P: useRef
    P->>P: useReducer init
    P->>P: useReducer
    P->>P: useMemo
    P->>P: useContext
    P->>P: render
    
    P->>PW: render ParentWrapper
    PW->>PW: useState initializer
    PW->>PW: useRef
    PW->>PW: useReducer init
    PW->>PW: useReducer
    PW->>PW: useMemo
    PW->>PW: render
    
    PW->>K: render Kid
    K->>K: useState initializer
    K->>K: useRef
    K->>K: useImperativeHandle
    K->>K: useReducer init
    K->>K: useReducer
    K->>K: useMemo
    K->>K: render
    
    K->>G: render Grandkid
    G->>G: useState initializer
    G->>G: useRef
    G->>G: useImperativeHandle
    G->>G: useReducer init
    G->>G: useReducer
    G->>G: useMemo
    G->>G: useContext
    G->>G: render
    
    Note over K2: After Grandkid completes...
    
    PW->>K2: render Kid2
    K2->>K2: useState initializer
    K2->>K2: useRef
    K2->>K2: useReducer init
    K2->>K2: useReducer
    K2->>K2: useMemo
    K2->>K2: useContext
    K2->>K2: render
```

### Hook Execution Order Within a Component

Within each component, hooks execute in the order they are declared:

```mermaid
flowchart TD
    Start[Component Render Starts] --> H1[1. useState initializer<br/>if lazy initializer]
    H1 --> H2[2. useState hook]
    H2 --> H3[3. useRef]
    H3 --> H4[4. useImperativeHandle<br/>if forwardRef]
    H4 --> H5[5. useReducer init<br/>if lazy initializer]
    H5 --> H6[6. useReducer hook]
    H6 --> H7[7. useMemo]
    H7 --> H8[8. useContext]
    H8 --> H9[9. Component render logic]
    H9 --> End[Component Render Complete]
    
    style H1 fill:#fff3cd
    style H2 fill:#fff3cd
    style H3 fill:#d4edda
    style H4 fill:#d4edda
    style H5 fill:#fff3cd
    style H6 fill:#fff3cd
    style H7 fill:#cce5ff
    style H8 fill:#cce5ff
    style H9 fill:#f8d7da
```

### Effect Phase: useLayoutEffect and useEffect Order

After the render phase completes, effects run in a **bottom-up** order (children first, then parents):

```mermaid
sequenceDiagram
    participant G as Grandkid
    participant K as Kid
    participant K2 as Kid2
    participant PW as ParentWrapper
    participant P as Parent
    
    Note over G,P: Layout Phase - useLayoutEffect (Synchronous)
    
    G->>G: useLayoutEffect cleanup (if re-render)
    G->>G: useLayoutEffect (no deps)
    G->>G: useLayoutEffect cleanup (mount)
    G->>G: useLayoutEffect (mount)
    G->>G: useLayoutEffect cleanup (deps)
    G->>G: useLayoutEffect (deps)
    
    K->>K: useLayoutEffect cleanup (if re-render)
    K->>K: useLayoutEffect (no deps)
    K->>K: useLayoutEffect cleanup (mount)
    K->>K: useLayoutEffect (mount)
    K->>K: useLayoutEffect cleanup (deps)
    K->>K: useLayoutEffect (deps)
    
    K2->>K2: useLayoutEffect cleanup (if re-render)
    K2->>K2: useLayoutEffect (no deps)
    K2->>K2: useLayoutEffect cleanup (mount)
    K2->>K2: useLayoutEffect (mount)
    K2->>K2: useLayoutEffect cleanup (deps)
    K2->>K2: useLayoutEffect (deps)
    
    PW->>PW: useLayoutEffect cleanup (if re-render)
    PW->>PW: useLayoutEffect (no deps)
    PW->>PW: useLayoutEffect cleanup (mount)
    PW->>PW: useLayoutEffect (mount)
    PW->>PW: useLayoutEffect cleanup (deps)
    PW->>PW: useLayoutEffect (deps)
    
    P->>P: useLayoutEffect cleanup (if re-render)
    P->>P: useLayoutEffect (no deps)
    P->>P: useLayoutEffect cleanup (mount)
    P->>P: useLayoutEffect (mount)
    P->>P: useLayoutEffect cleanup (deps)
    P->>P: useLayoutEffect (deps)
    
    Note over G,P: Effect Phase - useEffect (Asynchronous, after paint)
    
    G->>G: useEffect cleanup (if re-render)
    G->>G: useEffect (no deps)
    G->>G: useEffect cleanup (mount)
    G->>G: useEffect (mount)
    G->>G: useEffect cleanup (deps)
    G->>G: useEffect (deps)
    
    K->>K: useEffect cleanup (if re-render)
    K->>K: useEffect (no deps)
    K->>K: useEffect cleanup (mount)
    K->>K: useEffect (mount)
    K->>K: useEffect cleanup (deps)
    K->>K: useEffect (deps)
    
    K2->>K2: useEffect cleanup (if re-render)
    K2->>K2: useEffect (no deps)
    K2->>K2: useEffect cleanup (mount)
    K2->>K2: useEffect (mount)
    K2->>K2: useEffect cleanup (deps)
    K2->>K2: useEffect (deps)
    
    PW->>PW: useEffect cleanup (if re-render)
    PW->>PW: useEffect (no deps)
    PW->>PW: useEffect cleanup (mount)
    PW->>PW: useEffect (mount)
    PW->>PW: useEffect cleanup (deps)
    PW->>PW: useEffect (deps)
    
    P->>P: useEffect cleanup (if re-render)
    P->>P: useEffect (no deps)
    P->>P: useEffect cleanup (mount)
    P->>P: useEffect (mount)
    P->>P: useEffect cleanup (deps)
    P->>P: useEffect (deps)
```

### Complete Render Cycle Flow

```mermaid
flowchart TD
    Start[State Change or Initial Render] --> RenderPhase[Render Phase]
    
    RenderPhase --> AC1[AppContextProvider hooks]
    AC1 --> P1[Parent hooks]
    P1 --> PW1[ParentWrapper hooks]
    PW1 --> K1[Kid hooks]
    K1 --> G1[Grandkid hooks]
    G1 --> K21[Kid2 hooks]
    
    K21 --> LayoutPhase[Layout Phase<br/>useLayoutEffect]
    
    LayoutPhase --> G2[Grandkid useLayoutEffects]
    G2 --> K2[Kid useLayoutEffects]
    K2 --> K22[Kid2 useLayoutEffects]
    K22 --> PW2[ParentWrapper useLayoutEffects]
    PW2 --> P2[Parent useLayoutEffects]
    
    P2 --> Paint[Browser Paint]
    Paint --> EffectPhase[Effect Phase<br/>useEffect]
    
    EffectPhase --> G3[Grandkid useEffects]
    G3 --> K3[Kid useEffects]
    K3 --> K23[Kid2 useEffects]
    K23 --> PW3[ParentWrapper useEffects]
    PW3 --> P3[Parent useEffects]
    
    P3 --> End[Complete]
    
    style RenderPhase fill:#dbeafe
    style LayoutPhase fill:#fef3c7
    style Paint fill:#d1fae5
    style EffectPhase fill:#fed7aa
```

## Key Concepts

### Render Phase (Top-Down)
- Hooks execute **during render**, in the order they appear in code
- Parent components' hooks run before children's hooks
- Siblings execute left-to-right (or in JSX order)

### Layout Phase (Bottom-Up)
- `useLayoutEffect` runs **synchronously** after DOM mutations
- Runs **before** the browser paints
- Executes in **bottom-up** order (children first, then parents)
- Cleanup functions run before new effects

### Effect Phase (Bottom-Up)
- `useEffect` runs **asynchronously** after the browser paints
- Executes in **bottom-up** order (children first, then parents)
- Cleanup functions run before new effects
- Multiple effects with different dependency arrays run in declaration order

### Hook Execution Rules

1. **Hooks must be called in the same order every render**
2. **Hooks cannot be called conditionally or in loops**
3. **Render phase hooks** (useState, useRef, useMemo, etc.) execute top-down
4. **Effect hooks** (useEffect, useLayoutEffect) execute bottom-up
5. **Cleanup functions** run before new effects in the same phase

## Hooks Demonstrated

This app demonstrates the following React hooks:

- **`useState`**: State management with lazy initializers
- **`useRef`**: DOM references and mutable values
- **`useReducer`**: Complex state management with lazy initialization
- **`useMemo`**: Memoized computed values
- **`useContext`**: Context consumption
- **`useEffect`**: Side effects (async, after paint)
- **`useLayoutEffect`**: Synchronous side effects (before paint)
- **`useImperativeHandle`**: Exposing imperative methods via refs (with `forwardRef`)

## Usage

1. Navigate to the home page to choose between:
   - **Without React Compiler**: Standard React behavior
   - **With React Compiler**: React Compiler optimized behavior

2. Open your browser's developer console to see the hook execution order

3. Interact with the buttons to trigger state changes and observe:
   - Hook execution order during re-renders
   - Cleanup function execution
   - Effect dependency tracking

## Project Structure

```
app/
├── components/
│   ├── compiler/          # Components with React Compiler
│   │   ├── AppContextWithCompiler.tsx
│   │   ├── ParentWithCompiler.tsx
│   │   ├── ParentWrapperWithCompiler.tsx
│   │   ├── KidWithCompiler.tsx
│   │   ├── Kid2WithCompiler.tsx
│   │   └── GrandkidWithCompiler.tsx
│   └── without-compiler/  # Components without React Compiler
│       ├── AppContext.tsx
│       ├── Parent.tsx
│       ├── ParentWrapper.tsx
│       ├── Kid.tsx
│       ├── Kid2.tsx
│       └── Grandkid.tsx
├── with-compiler/
│   └── page.tsx
├── without-compiler/
│   └── page.tsx
└── page.tsx               # Home page
```

## Technologies

- **Next.js 16.1.1**: React framework
- **React 19.2.3**: UI library
- **React Compiler**: Automatic memoization and optimization
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

## Learn More

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Next.js Documentation](https://nextjs.org/docs)

## License

This project is open source and available for educational purposes.
