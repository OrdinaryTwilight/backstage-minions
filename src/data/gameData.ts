/**
 * @file Game Data Aggregator
 * @description Central export barrel file for all game data.
 * Re-exports from all data submodules to provide single import point.
 * 
 * This approach prevents import path breakage when moving or reorganizing data files.
 * Any component can import: `import { CHARACTERS, PRODUCTIONS } from '../data/gameData'`
 * Instead of: `import { CHARACTERS } from './characters'; import { PRODUCTIONS } from './productions'`
 * 
 * Exported modules:
 * - characters: Playable characters and NPCs
 * - productions: Game levels and venues
 * - conflicts: Story dialogue encounters
 * - cues: Technical timing data
 * - dialogues: NPC conversation trees
 * - equipment: Gear packages and stage setup configs
 * - reviews: Post-show performance feedback
 * - stories: Unlockable narrative content
 * - tutorials: Game tutorial sequences
 * - quests: Side objectives and rewards
 * - chatMessages: NPC communication system
 * - zones: Overworld map locations
 * - types: Game mechanic type definitions
 */

// src/data/gameData.ts
// Aggregator file: This prevents imports from breaking across the app
export * from "./characters";
export * from "./chatMessages";
export * from "./conflicts";
export * from "./cues";
export * from "./dialogues";
export * from "./equipment";
export * from "./productions";
export * from "./reviews";
export * from "./stories";
export * from "./tutorials";
export * from "./types";
export * from "./zones";
