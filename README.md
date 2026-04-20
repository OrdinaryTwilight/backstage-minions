# backstage-minions

Smol RPG where you're a backstage minion for a theatre production

# 🎭 Backstage Minions

**Welcome to the shadows.** Grab your headset, double-check your rig, and keep the show running at all costs. The cast gets the applause, but the crew holds the power (?)

Backstage Minions is an interactive web-based theater management and technical crew simulator. Players take on the role of stagehands, sound designers, and stage managers, executing cues, managing equipment, and dealing with real-time backstage crises.

## 🚀 Features

- **Comms Network:** A dynamic in-game messaging system for NPC crew chatter, objectives, and tutorial onboarding.
- **Production Roster:** Multiple levels (shows) ranging from school plays to massive professional productions.
- **Cue Execution Engine:** A real-time timeline system where players must trigger Lighting, Sound, and Fly cues with precise timing.
- **Equipment Loadouts:** Assemble the right gear for the gig. (You aren't fixing a parcan without a crescent wrench).
- **Stress & Morale Tracking:** Keep the show running smoothly to maintain crew morale and prevent the director from throwing a tantrum.

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6
- **State Management:** React Context API + Reducers (`useReducer`)
- **Styling:** CSS Modules / Custom Properties with a Blueprint/Terminal aesthetic
- **Testing:** Vitest & React Testing Library
- **Build Tool:** Vite

## 📦 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v16+) and npm installed.

### Installation

1. Clone the repository:

   ```bash
   git clone [https://github.com/yourusername/backstage-minions.git](https://github.com/yourusername/backstage-minions.git)
   cd backstage-minions

   Install dependencies:
   ```

Bash
npm install
Start the development server:

Bash
npm run dev
Open your browser and navigate to http://localhost:5173.

Running Tests
To run the Vitest test suite:

Bash
npm run test
🎮 How to Play
Start on the Home Page and check your Comms for messages from ASM Sam.

Navigate to the Productions Page and flip through the callboard posters.

Select a production (Start with Phantom of the Opera - School Difficulty).

Equip your gear, read the plot plans, and execute the show cues!
