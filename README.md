# Bundle Builder React

A data-driven, multi-step bundle builder prototype built with React, TypeScript, and Vite.

## What it does

- **Left column**: A 4-step accordion builder (Cameras → Plan → Sensors → Accessories).
- **Right column**: A live review panel that reflects the configured system, recalculates totals/savings, and lets the shopper save their configuration.
- **Persistence**: Clicking "Save my system for later" stores product selections in `localStorage`; they are validated and restored on the next visit.

## Run instructions

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Build for production
pnpm build

# Lint
pnpm lint

# Run unit tests once
pnpm test

# Run unit tests in watch mode
pnpm test:watch
```

The app is served from the Vite dev server (usually http://localhost:5173).

## Architecture

- **Data-driven**: All products, variants, and default selections live in `src/data/bundle.json`.
- **State management**: A React `useReducer` inside `BundleProvider` handles every state change. Actions are `SET_VARIANT`, `UPDATE_QUANTITY`, `NEXT_STEP`, `TOGGLE_STEP`, `SAVE`, and `RESTORE`.
- **Selectors**: Derived state (cart items, totals, savings, selected counts) is computed in `src/features/bundle/state/selectors.ts` and memoized with `useMemo` in components.
- **Variant quantities**: Each variant tracks its own quantity independently. Switching colors on a product card updates the active variant without resetting the previously selected variant's count, and every selected variant appears as its own line in the review panel.
- **Variant images**: Each product variant can declare its own `image`; the UI falls back to the product's default image when a variant image is absent.
- **Feature-based structure**: All bundle-related code is colocated under `src/features/bundle/`.
- **Component-scoped CSS**: Each major component owns its stylesheet; shared tokens live in `src/theme.css`.

## Why `useReducer`?

The bundle has several related state mutations (variant switching, quantity updates, accordion navigation, persistence). A reducer keeps every mutation explicit, traceable, and easy to extend. Combined with a context provider, it avoids prop drilling without adding a third-party state library.

## Why JSON-driven?

Rendering from `bundle.json` means the same code powers every step. Adding a new camera, plan, or accessory only requires editing the JSON file — no component changes.

## Tradeoffs

- **Plain CSS**: No Tailwind or CSS-in-JS. This keeps the bundle small and the styling easy to override, but it requires disciplined naming to avoid collisions. Component-scoped files mitigate this.
- **Tests**: Vitest + React Testing Library cover reducers, selectors, persistence, and component/integration flows in `src/features/bundle/state/__tests__/` and `src/features/bundle/components/__tests__/`. The integration suite exercises accordion toggling, quantity sync, variant preservation, and the save flow.
- **Product images**: Real Figma assets are copied to `public/assets/figma/` and referenced from `src/data/bundle.json`.
