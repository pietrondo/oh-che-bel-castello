# oh che bel castello - Technical Documentation

## 🏗️ Architecture & Engine
- **Core Loop**: Tick-based system (1s) using `requestAnimationFrame`.
- **Weather Engine**: Dynamic states (Clear, Rain, Storm, Snow) affecting multipliers globally.
- **Logistics**: Physical caravan entities with progress tracking and status management.
- **Infrastructure**: Proximity-based efficiency bonuses (Roads) and health thresholds (Wells).

## 💎 UI/UX Design System
- **Side Navigation**: Vertical layout for optimal screen utilization.
- **Categorized Sidebar**: Building definitions grouped by logical function to reduce cognitive load.
- **Semantic Feedback**: Red/Green color coding for affordability and resource danger states.
- **Parchment Theme**: Extensive use of CSS variables and textures for medieval immersion.

## ⚖️ Social & Political Logic
- **Social Classes**: Multi-tiered population (Peasants, Citizens, Nobles) with distinct consumption/tax profiles.
- **Faction System**: Relational favor tracking for Merchants, Clergy, and Military.
- **Legal System**: Global law modifiers with prestige costs and faction impacts.

## 💾 State Persistence
- **Serialization**: Automated `localStorage` updates per tick.
- **Versioning**: Save keys are versioned to prevent state corruption across updates.
