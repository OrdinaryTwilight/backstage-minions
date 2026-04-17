import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
  fontFamily: "system" | "serif" | "monospace";
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
  if (settings.theme === "light") {
    root.classList.add("light-mode");
  } else {
    root.classList.remove("light-mode");
  }

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
  if (settings.contrastMode === "high") {
    root.classList.add("high-contrast-mode");
  } else {
    root.classList.remove("high-contrast-mode");
  }

  // Color blind simulation filter
  const filterMap: Record<VisualSettings["colorBlindMode"], string> = {
    none: "none",
    protanopia:
      "url('#protanopia-filter') url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='protanopia'><feColorMatrix type='matrix' values='0.567 0.433 0 0.567 0.433 0 0.433 0.567 0 0.433 0.567'/></filter></svg>#protanopia-filter)",
    deuteranopia:
      "url('#deuteranopia-filter') url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='deuteranopia'><feColorMatrix type='matrix' values='0.625 0.375 0 0.625 0.375 0 0.375 0.625 0 0.375 0.625'/></filter></svg>#deuteranopia-filter)",
    tritanopia:
      "url('#tritanopia-filter') url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='tritanopia'><feColorMatrix type='matrix' values='0.95 0.05 0 0.95 0.05 0 0.05 0.95 0 0.05 0.95'/></filter></svg>#tritanopia-filter)",
  };
  root.style.filter = filterMap[settings.colorBlindMode];

  // Motion preference
  if (settings.motionPreference === "reduced") {
    root.classList.add("prefers-reduced-motion");
  } else {
    root.classList.remove("prefers-reduced-motion");
  }

  // Font family
  const fontMap: Record<VisualSettings["fontFamily"], string> = {
    system:
      "var(--font-sketch), system-ui, -apple-system, sans-serif, monospace",
    serif: "Georgia, 'Times New Roman', serif",
    monospace: "Courier New, monospace",
  };
  root.style.setProperty("--user-font-family", fontMap[settings.fontFamily]);
}

export function VisualSettingsProvider({ children }: { children: ReactNode }) {
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
    }
    setIsLoaded(true);
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

  return (
    <VisualSettingsContext.Provider
      value={{ settings, updateSetting, resetToDefaults }}
    >
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
