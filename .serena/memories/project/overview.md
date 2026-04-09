# Project Overview

## Name
"oh che bel castello" - A medieval management RTS game for browser

## Purpose
A complex medieval kingdom management game where players start with a small keep and must expand into a thriving empire. Features include:
- Resource management (wood, stone, food, gold, iron, knowledge, piety, etc.)
- Building construction with worker assignment
- Technology research tree
- Population management with social classes (Peasants, Citizens, Nobles)
- Faction system (Merchants, Clergy, Military)
- Dynamic weather affecting gameplay
- Laws and edicts system

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Vanilla CSS with CSS variables (no CSS frameworks)
- **State Management**: React useState/useEffect hooks (custom game engine hook)
- **Persistence**: localStorage with versioning

## Project Structure
```
src/
  main.tsx          - Entry point
  App.tsx           - Main UI component
  App.css           - Main styles
  index.css         - Global styles
  game/
    useGameEngine.ts - Core game logic hook
    constants.ts     - Game constants, buildings, initial state
    types.ts         - TypeScript type definitions
  assets/           - Static assets (images)
public/              - Public assets
```

## Code Style
- TypeScript with strict mode enabled
- No unused locals/parameters allowed (tsconfig.app.json)
- Flat config ESLint with typescript-eslint
- React hooks for state management
- CSS variables for theming
- Italian language for UI text
- Emoji usage for visual elements (🏰, 👑, 🪵, etc.)