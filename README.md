# 🎭 Backstage Minions

**Backstage Minions** is an interactive, web-based technical theatre and stage management simulator. Step into the shoes of a theatrical crew member and navigate the high-stakes, fast-paced world of live production.

From drafting lighting plots and patching sound consoles to untangling XLR cables and managing crew conflicts over the comms channel, this game tests your technical knowledge and your ability to perform under pressure.

## ✨ Features

- **Lighting Plot Drafting:** Review Stage Manager notes and place Spotlights, Washes, and LEDs onto a rigging matrix while managing power limits and Gobo requirements.
- **Sound Design & Signal Flow:** Route audio inputs to hardware channels, and patch channels to output buses without hitting "dead" hardware.
- **Live Cue Execution:** Ride the faders and hit your cues on time using a responsive, scrolling cue timeline.
- **Interactive Minigames:** Untangle and properly coil XLR cables before the truck leaves in the _Strike & Wrap_ stage.
- **Crew Networking & Comms:** Chat with NPCs through a dynamic, simulated headset network.
- **RPG Conflict Resolution:** Manage the stress of the production by making tough calls when crew members clash or equipment fails.
- **Full WCAG Accessibility:** High-contrast modes, native screen-reader support via `aria-live` regions, and keyboard-navigable interfaces.

## 🛠️ Tech Stack

- **Core:** React 18, TypeScript
- **Build Tool:** Vite
- **Styling:** CSS3 Variables (Full Light/Dark mode support)
- **Code Quality:** ESLint, SonarQube, Prettier

## 🚀 Quick Start

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/yourusername/backstage-minions.git
   cd backstage-minions
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production:**
   \`\`\`bash
   npm run build
   \`\`\`

## 📖 How to Play

Start a new session by selecting a Production and a Difficulty Tier (School, Community, or Professional). As you progress through the stages (`Load-In` -> `Planning` -> `Sound Map` -> `Rehearsal` -> `Live Show`), you will earn points for accuracy and lose points (and gain stress) for mistakes. Complete the show and review your final Star Rating in the Post-Mortem report!
