// --- PLANNING STAGE CONSTANTS ---
export const PLOT_GRID_COLS = 5;
export const PLOT_GRID_ROWS = 3;

export const LIGHT_TYPES = [
  { id: "spot", label: "Spotlight", color: "#fef08a", icon: "🔦" },
  { id: "wash", label: "Wash", color: "#38bdf8", icon: "💡" },
  { id: "led", label: "LED Par", color: "#f472b6", icon: "🚥" },
];

export const AUDIO_TYPES = [
  { id: "mic", label: "Wireless Mic", color: "#f87171", icon: "🎙️" },
  { id: "speaker", label: "Foldback", color: "#60a5fa", icon: "🔊" },
  { id: "di", label: "DI Box", color: "#a78bfa", icon: "📥" },
];

export const GEAR_PACKAGES = [
  { 
    id: "budget", 
    label: "Community Surplus", 
    description: "Old analog gear. Faders are sticky and comms are crackly.",
    multiplier: 0.8, // Harder: smaller hit windows
    bonus: 50 
  },
  { 
    id: "standard", 
    label: "Rental House Pro", 
    description: "Solid, reliable digital equipment. Standard industry windows.",
    multiplier: 1.0, 
    bonus: 0 
  },
  { 
    id: "premium", 
    label: "State-of-the-Art", 
    description: "Brand new grandMA3/CL5. Silky smooth response.",
    multiplier: 1.2, // Easier: wider hit windows
    bonus: -50 // Cost of luxury
  }
];