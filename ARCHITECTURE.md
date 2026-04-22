# 🏛️ System Architecture: Backstage Minions

This document outlines the core architectural patterns, state management, and structural philosophy of the Backstage Minions React application.

## 1. Global State Management (`src/context/`)

The game relies on a centralized `GameContext` powered by React's `useReducer`.

- **`gameReducer.ts`**: Contains the strict, type-safe logic for mutating game state.
- **Action Payloads**: Actions are strictly typed (e.g., `ADD_SCORE`, `RESOLVE_CONFLICT`, `CLEAR_SESSION`). Components dispatch these actions rather than mutating state directly.
- **Persistence**: Critical session data (inventory, completed quests, chat logs) is mirrored to `sessionStorage` to survive accidental page reloads, and aggressively wiped on `CLEAR_SESSION`.

## 2. The Data Layer (`src/data/`)

All narrative, configuration, and statistical data is decoupled from the UI components.

- **Dynamic Text Parsing (`characters.ts`)**:
  The game uses a dynamic tag system (e.g., `{npc_stage_manager}`). The `parseDialogueTags()` utility intercepts these tags at render time and resolves them to the current character name. This allows narrative writers to freely change character names without breaking logic IDs or quest references.
- **`cues.ts`**: Defines the target timing, difficulty windows, and fader levels for the Live Show stage.
- **`conflicts.ts`**: Stores the RPG-style dialogue encounters and their point/stress deltas.

## 3. Component Structure (`src/components/`)

The application enforces a strict separation between reusable UI elements and game-specific logic.

- **`ui/` (Presentation Components)**:
  Dumb, highly reusable components like `Button`, `HardwarePanel`, and `SectionHeader`. These handle their own accessibility (ARIA tags) and adhere strictly to CSS variables for theme support.
- **`game/` (Stage Components)**:
  Smart components that interact with the `GameContext`.
  - **Extraction Pattern**: Complex stages (like `CableCoilingStage` and `CueExecutionStage`) are broken down into smaller files. State logic and timers are extracted into custom hooks (e.g., `useCableCoiling.ts`), while SVG visualizers and overlays are isolated into pure functional components to maintain a low cognitive complexity (SonarQube compliance).

## 4. Routing & Level Flow (`src/pages/`)

- **`GameLevelPage`**: The master container for active gameplay. It reads the current stage from the `GameContext` session and dynamically mounts the appropriate Stage Component (`PlanningStage`, `SoundDesignStage`, etc.).
- **Conflict Interception**: `GameLevelPage` acts as a middleware interceptor. If `session.activeConflict` is populated, it unmounts the current stage and forces the player to resolve the `ConflictMinigame` before continuing.

## 5. Event-Driven Architecture

While standard data flows down via React props and Context, the game utilizes global DOM events for cross-cutting operational commands that bypass the React tree:

- **`global_pause_request` / `global_resume_request`**: Fired by the `ShowControlNav` (e.g., when clicking "Abandon Show"). Minigame hooks (like `useCableCoiling` and `useCueEngine`) listen for these events to instantly freeze timers without needing complex prop-drilling.
- **`unread_messages_update`**: Triggers notification badges in the navigation bar when background systems push messages to the `NetworksPage` session storage.

## 6. Styling Strategy (`src/styles/`)

- **CSS Variables**: The app uses a global theme file (`index.css` / `components.css`) defining Semantic Tokens (e.g., `var(--bui-fg-warning)`, `var(--color-blueprint-bg)`).
- **Light/Dark Mode**: Dark mode is the default. Light mode is activated by appending the `.light-mode` class to the root document. All components _must_ use CSS variables rather than hardcoded hex codes to ensure WCAG contrast compliance across both themes.
