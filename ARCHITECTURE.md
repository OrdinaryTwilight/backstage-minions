# 🏛️ Architecture & Data Flow

This document outlines the core architecture of **Backstage Minions**.

## 1. Global State Management

The game avoids excessive prop-drilling by utilizing a centralized Context Provider (`src/context/GameContext.tsx`) powered by a `useReducer` pattern.

### `gameReducer.ts`

All state mutations happen here. It ensures predictable state transitions.

- **State Interface (`GameState`)**: Tracks `playerStats` (stress, reputation), `progress` (completed levels, star ratings), `inventory`, and `unreadContacts`.
- **Actions**: e.g., `ADD_SCORE`, `UPDATE_STRESS`, `UNLOCK_LEVEL`, `MARK_CONTACT_READ`.

## 2. Core Game Engines

Located in `src/utils/` (or `src/systems/`), these engines separate game logic from React rendering logic, making them easily testable via Vitest.

- **`levelFlowEngine.ts`**: Manages the transitions between states of a specific gig (Briefing -> Equipment -> Execution -> Wrap Up).
- **`scoringEngine.ts`**: Calculates final star ratings based on missed cues, stress levels, and completed optional objectives.
- **`objectiveEngine.ts`**: Evaluates whether real-time win/loss conditions have been met during a level.

## 3. The Comms & Dialogue System

The in-game messaging (`NetworksPage.tsx`) and NPC interactions utilize a shared interface:

- **`DialogueTree` & `DialogueNode`**: Defines the flow of conversation.
- Players select "Quick Replies" which trigger automated delays and responses from NPCs, simulating real text messaging.
- Side effects (like unlocking new productions) are dispatched to the `GameContext` based on specific dialogue node choices.

## 4. UI / UX Principles

- **CSS:** We rely on CSS custom properties (variables) defined in `src/styles/` for theme consistency (Blueprint/Dark mode).
- **Z-Index Standards:** \* `NavBar`: 1000 (Fixed Top)
  - `SettingsPanel`: 2000 (Modal Overlay)
  - `GameHUD`: 500
- All page-level components should utilize `padding-top` to accommodate the fixed NavBar and pr
