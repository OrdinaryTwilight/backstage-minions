# A3! Backstage - Game Improvements & Code Comments

## ✅ Deployment Fixed

Your Vercel deployment is now configured correctly:

- Updated `vite.config.js` to explicitly set `outDir: 'dist'`
- Updated `vercel.json` to specify `outputDirectory: "dist"`
- Cleaned up build script in `package.json`

Your app should now deploy successfully to Vercel!

---

## 🎮 Game Feature Improvements

### 1. **Difficulty Progression**

**Current State:** Each production has 3 independent difficulty levels.
**Improvement:**

- Lock higher difficulties until player completes the lower difficulty
- Award bonus points for completing all 3 difficulties in sequence
- Add difficulty-specific achievements/badges

```javascript
// Example: Add to gameData.js
const ACHIEVEMENTS = {
  first_clear: { name: "First Show", points: 100 },
  all_difficulties: { name: "Complete Professional", points: 500 },
  perfect_run: { name: "Perfect Cues", points: 250 },
};
```

### 2. **Conflict System Enhancement**

**Current State:** Conflicts appear randomly during gameplay.
**Improvements:**

- Add conflict chains (first choice determines future conflicts)
- Track conflict outcomes to show consequences in later scenes
- Add "branching narrative" that affects final score

```javascript
// Example structure:
const CONFLICT_CHAINS = {
  "backstage_argument": {
    id: "backstage_argument",
    choices: [...],
    consequenceStage: "liveshow", // Affects later stages
    outcomes: {
      reconcile: { storyEntry: "learned_collaboration" },
      ignore: { penalty: -20 }
    }
  }
};
```

### 3. **Character Development**

**Current State:** Character choice is just cosmetic.
**Improvements:**

- Add character-specific skill bonuses
- Character relationship tracking (networking)
- Callback dialogues based on previous choices

```javascript
// Example:
const CHARACTER_SKILLS = {
  ben: { lighting: +15, cueAccuracy: +10 }, // Lighting designer bonuses
  priya: { sound: +15, timing: +10 },
  sam: { general: +10, lifeBonus: 1 }, // Gets extra life
};
```

### 4. **Progressive Difficulty Curve**

**Current State:** Cue timings are fixed per production.
**Improvements:**

- Shorter windows on harder difficulties
- More cues as difficulty increases
- Variable cue speeds in live show stage

```javascript
// Update CUE_SHEETS to include difficulty multipliers:
const CUE_SHEETS = {
  phantom: {
    lighting: [
      {
        id: "LX1",
        label: "...",
        targetMs: 3000,
        windowMs: { school: 800, community: 600, professional: 400 },
      },
    ],
  },
};
```

### 5. **Story Significance**

**Current State:** Stories are just unlocked content.
**Improvements:**

- Stories affect gameplay (e.g., "Gaffing 101" improves focus damage)
- Add story reading rewards (bonus points, temporary boosts)
- Reference story content in conflict dialogues
- Create "story arcs" that span multiple productions

### 6. **Scoring & Feedback System**

**Current State:** Score is somewhat abstract.
**Improvements:**

- Show score breakdown per stage
- Real-time feedback during rehearsal/live stages
- Partial credit for near-miss cues (e.g., "Off by 200ms: +10 pts")
- Final score report card with narrative commentary

```javascript
// Example feedback messages:
const FEEDBACK = {
  perfect: '"Flawless execution!"',
  close: '"Close one!"',
  missed: '"Missed cue!"',
  early: '"Too early!"',
  late: '"Too late!"',
};
```

### 7. **New Stage Ideas**

**Add a "Tech Check" pre-show stage where:**

- Player reviews their setup decisions
- Makes last-minute adjustments
- Fixes critical mistakes before going live

**Add "Post-Show Debrief":**

- Accept feedback from stage manager
- Learn lessons that affect future runs
- Option to retry with improvements

### 8. **Accessibility & Help System**

**Improvements:**

- Tutorial stage before first production
- Glossary of theatre terms (modal/tooltip)
- Adjustable cue window difficulty slider
- Color-blind mode for status indicators

### 9. **Persistence & Long-term Goals**

**Current State:** Players unlock stories but no long-term progression.
**Improvements:**

- Add "Theatre Career" progression (apprentice → technician → master)
- Unlock new productions based on career level
- Reputation system (affects available choices)
- Timeline: "It's now 2025, you've been in theatre for 5 years..."

### 10. **Visual/UX Polish**

**Current Gaps:**

- Add stage-specific backgrounds/theming
- Animated transitions between stages
- Sound effects for cue hits/misses
- Character portraits in DialogueBox
- Visual feedback during timeline (pulsing at upcoming cues)

---

## 📝 Code Quality Improvements

### Already Done ✅

- Added comprehensive comments to GameContext.jsx
- Fixed Vercel deployment configuration
- Fixed all JSX syntax errors across components
- Proper key props on all mapped lists
- NavBar integrated on all pages

### Recommended Next Steps

**1. Extract Helper Functions (componentization)**

```javascript
// Create src/hooks/useStageLogic.js
export function useStageLogic(productionId, difficulty) {
  // Extract common stage logic
  const { dispatch, state } = useGame();
  const handleConflictResolved = (outcome) => {
    /* ... */
  };
  return { handleConflictResolved /* ... */ };
}
```

**2. Add Input Validation**

- Validate all user selections before dispatch
- Add guards in game state transitions
- Error boundary component for crash recovery

**3. Create Utility Functions**

```javascript
// src/utils/gameCalcs.js
export const calculateStars = (hitRate) => {
  if (hitRate >= 0.9) return 3;
  if (hitRate >= 0.65) return 2;
  return 1;
};

export const isLevelUnlocked = (production, difficulty, progress) => {
  if (difficulty === "school") return true;
  const prevDiff = difficulty === "professional" ? "community" : "school";
  return progress[`${production}_${prevDiff}`]?.completed;
};
```

**4. Add Test Cases** (optional but recommended)

- Unit tests for reducer logic
- Component tests for Star display, DialogueBox
- E2E test for complete game flow

**5. Performance Optimization**

- Memoize expensive calculations (e.g., unlocked stories filter)
- useMemo for DialogueBox props
- Lazy load story content

---

## 🎯 Priority Roadmap

**Phase 1 (MVP - Current)**

- ✅ Core gameplay loop
- ✅ Progression system
- ✅ Conflict integration

**Phase 2 (Polish)**

- [ ] Character skill bonuses
- [ ] Story reading rewards
- [ ] Visual feedback polish
- [ ] Sound effects

**Phase 3 (Expand)**

- [ ] New productions
- [ ] Career progression
- [ ] Branching narratives
- [ ] Leaderboard/stats

**Phase 4 (Advanced)**

- [ ] Multiplayer coop
- [ ] Custom productions
- [ ] Modding support

---

## 🐛 Known Issues to Monitor

1. **localStorage Persistence**: Verify save works reliably on different browsers/mobile
2. **Cue Accuracy**: Test hit detection timing on slow devices
3. **Mobile Responsiveness**: Test DialogueBox/cue sheet on touch devices
4. **Performance**: Monitor React re-renders with many cues (50+ per stage)

---

## 📚 File Comments Added

- ✅ `src/context/GameContext.jsx` - Game state management
- ✅ All component files - JSX structure now clear

### Recommended Comments to Add

- `src/data/gameData.js` - Data structure explanations
- `src/components/game/LiveShowStage.jsx` - Timing logic
- `src/pages/GameLevelPage.jsx` - Stage flow orchestration
- Game hooks utilities

---

## 🚀 Quick Wins (Low effort, High impact)

1. **Add visual difficulty indicators** - Show star requirement for each level
2. **Score breakdown toast** - Show "+30 pts: Cue Hit!" on success
3. **Character stat display** - Show why character has bonuses
4. **Production leaderboard** - "Best times" for each difficulty
5. **Story preview** - Show story tags/themes before unlocking
