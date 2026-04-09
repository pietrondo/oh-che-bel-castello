# Code Conventions

## TypeScript
- Use explicit types for function parameters and return values
- Use `type` for type aliases, `interface` for object shapes
- Prefer `Record<K, V>` for dictionary types
- Use union types for exhaustive option sets

## React
- Functional components with hooks
- Use `useState` for local state, custom hooks for complex logic
- Destructure props in function signature
- Type component props explicitly

## Naming Conventions
- PascalCase for components and types: `BuildingType`, `GameState`
- camelCase for variables and functions: `buildBuilding`, `assignedWorkers`
- SCREAMING_SNAKE_CASE for constants: `TICK_RATE`, `INITIAL_RESOURCES`
- kebab-case for file names: `useGameEngine.ts`, `types.ts`

## CSS
- CSS variables for colors and theming
- BEM-like class naming for components
- Single file per component (App.css for App.tsx)