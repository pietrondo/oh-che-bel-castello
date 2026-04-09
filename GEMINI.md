# oh che bel castello - Project Standards

## 🏗️ Architecture
- **State Management**: React `useState` hooks with a custom `useGameEngine` hook for game logic loops.
- **Game Loop**: `requestAnimationFrame` based tick system (1000ms per tick).
- **Persistence**: `localStorage` automatic serialization on state change.
- **Visuals**: Vanilla CSS with CSS Variables for theme consistency and grid-based map rendering.

## 📏 Standards
- **Naming**: camelCase for variables/functions, PascalCase for components/types.
- **Typing**: Strict TypeScript. Use `import type` for type-only imports to comply with `verbatimModuleSyntax`.
- **Logic**: Decouple game logic (mechanics, production, social growth) from UI components where possible.
- **Icons**: Emoji-based placeholders for assets to maintain a lightweight footprint while ensuring visual clarity.

## 🗺️ Map Generation
- Procedural generation occurs at `INITIAL_STATE` or on `resetGame`.
- Map world size is decoupled from viewport size to support scrolling.
