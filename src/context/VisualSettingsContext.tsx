import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * VisualSettings: User accessibility preferences for visual rendering
 * All settings are persisted to localStorage and applied globally via CSS custom properties
 */
export interface VisualSettings {
  fontSize: "small" | "medium" | "large" | "extra-large";
  contrastMode: "normal" | "high";
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  motionPreference: "reduced" | "full";
  fontFamily: "system" | "opendyslexic";
  theme: "dark" | "light";
}

interface VisualSettingsContextType {
  settings: VisualSettings;
  updateSetting: <K extends keyof VisualSettings>(
    key: K,
    value: VisualSettings[K],
  ) => void;
  resetToDefaults: () => void;
}

const defaultSettings: VisualSettings = {
  fontSize: "medium",
  contrastMode: "normal",
  colorBlindMode: "none",
  motionPreference: "full",
  fontFamily: "system",
  theme: "dark",
};

const VisualSettingsContext = createContext<
  VisualSettingsContextType | undefined
>(undefined);

const STORAGE_KEY = "a3_visual_settings";

/**
 * Apply settings to document root as CSS custom properties
 * Enables global theming without component refactoring
 */
function applySettingsToDOM(settings: VisualSettings) {
  const root = document.documentElement;

  // Theme toggle
  if (settings.theme === "light") root.classList.add("light-mode");
  else root.classList.remove("light-mode");

  // Font size multiplier
  const fontSizeMap: Record<VisualSettings["fontSize"], number> = {
    small: 0.875,
    medium: 1,
    large: 1.25,
    "extra-large": 1.5,
  };
  root.style.setProperty(
    "--font-size-multiplier",
    fontSizeMap[settings.fontSize].toString(),
  );

  // Contrast mode
  if (settings.contrastMode === "high")
    root.classList.add("high-contrast-mode");
  else root.classList.remove("high-contrast-mode");

  // Color blind simulation filter
  const filterMap: Record<VisualSettings["colorBlindMode"], string> = {
    none: "none",
    protanopia: "url('#protanopia')",
    deuteranopia: "url('#deuteranopia')",
    tritanopia: "url('#tritanopia')",
  };
  root.style.filter = filterMap[settings.colorBlindMode];

  // Motion preference
  if (settings.motionPreference === "reduced")
    root.classList.add("prefers-reduced-motion");
  else root.classList.remove("prefers-reduced-motion");

  // Font family - overrides ALL global font variables when OpenDyslexic is enabled
  if (settings.fontFamily === "opendyslexic") {
    root.style.setProperty("--user-font-family", "'OpenDyslexic', sans-serif");
    root.style.setProperty("--font-sketch", "'OpenDyslexic', sans-serif");
    root.style.setProperty("--font-mono", "'OpenDyslexic', sans-serif");
  } else {
    root.style.setProperty("--user-font-family", "var(--font-main)");
    root.style.setProperty("--font-sketch", "'Architects Daughter', cursive");
    root.style.setProperty("--font-mono", "'JetBrains Mono', monospace");
  }
}

export function VisualSettingsProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [settings, setSettings] = useState<VisualSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("Failed to load visual settings:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Apply settings to DOM whenever they change
  useEffect(() => {
    if (isLoaded) {
      applySettingsToDOM(settings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSetting = <K extends keyof VisualSettings>(
    key: K,
    value: VisualSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  const contextValue = useMemo(
    () => ({ settings, updateSetting, resetToDefaults }),
    [settings],
  );

  return (
    <VisualSettingsContext.Provider value={contextValue}>
      {/* INJECT SVG FILTERS INTO THE DOM */}
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="protanopia">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0 0 0  0.567 0.433 0 0 0  0 0.241 0.759 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix
              type="matrix"
              values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </VisualSettingsContext.Provider>
  );
}

export function useVisualSettings() {
  const context = useContext(VisualSettingsContext);
  if (!context) {
    throw new Error(
      "useVisualSettings must be used within VisualSettingsProvider",
    );
  }
  return context;
}
