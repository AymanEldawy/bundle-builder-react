# Bundle Builder React

A data-driven, multi-step bundle builder prototype built with React, TypeScript, and Vite.

## What it does

- **Left column**: A 4-step accordion builder (Cameras → Plan → Sensors → Accessories).
- **Right column**: A live review panel that reflects the configured system, recalculates totals/savings, and lets the shopper save their configuration.
- **Persistence**: Clicking "Save my system for later" stores the full configuration in `localStorage`; it is restored on the next visit.

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
```

The app is served from the Vite dev server (usually http://localhost:5173).

## Architecture

- **Data-driven**: All products, variants, and default selections live in `src/data/bundle.json`.
- **State management**: A React `useReducer` inside `BundleProvider` handles every state change. Actions are `SET_VARIANT`, `UPDATE_QUANTITY`, `NEXT_STEP`, `TOGGLE_STEP`, `SAVE`, and `RESTORE`.
- **Selectors**: Derived state (cart items, totals, savings, selected counts) is computed in `src/features/bundle/state/selectors.ts` and memoized with `useMemo` in components.
- **Feature-based structure**: All bundle-related code is colocated under `src/features/bundle/`.
- **Component-scoped CSS**: Each major component owns its stylesheet; shared tokens live in `src/theme.css`.

## Why `useReducer`?

The bundle has several related state mutations (variant switching, quantity updates, accordion navigation, persistence). A reducer keeps every mutation explicit, traceable, and easy to extend. Combined with a context provider, it avoids prop drilling without adding a third-party state library.

## Why JSON-driven?

Rendering from `bundle.json` means the same code powers every step. Adding a new camera, plan, or accessory only requires editing the JSON file — no component changes.

## Tradeoffs

- **Plain CSS**: No Tailwind or CSS-in-JS. This keeps the bundle small and the styling easy to override, but it requires disciplined naming to avoid collisions. Component-scoped files mitigate this.
- **No automated tests**: The brief requested a working prototype, so verification is manual plus `pnpm build` / `pnpm lint`. Adding Vitest + React Testing Library would be the next step.
- **Product images**: Real Figma assets are copied to `public/assets/figma/` and referenced from `src/data/bundle.json`. `placehold.co` is still used for color swatches and any products without a matching asset.
- **Design tokens are approximate**: Exact hex values from Figma were not available, so the palette is eyeballed from the screenshots and centralized in CSS variables.

## Future improvements

- Add exact Figma design tokens.
- Replace `localStorage` with a small backend/API for cross-device saves (the requirements listed this as a bonus).
- Add unit/integration tests for reducer logic and component interactions.
- Improve accessibility with focus traps, aria-live regions for totals, and keyboard navigation for the accordion.
- Animate accordion expand/collapse and card selection states.
