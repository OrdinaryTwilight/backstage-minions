import { useLocation, useNavigate } from "react-router-dom";

// Navigation tabs available throughout the game
const TABS = [
  { path: "/",            icon: "🏠", label: "Home"       },      // Main menu & progress overview
  { path: "/productions", icon: "🎭", label: "Shows"      },      // Browse available productions
  { path: "/stories",     icon: "📖", label: "Stories"    },      // Unlocked narrative content
];

/**
 * NavBar: Global navigation component
 * Renders at top of all pages except during active gameplay
 * Highlights current page with 'active' class for CSS styling
 */
export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  return (
    <nav>
      {TABS.map(t => (
        <button
          key={t.path}
          onClick={() => navigate(t.path)}
          // Add 'active' class if current page matches this tab's path
          className={pathname === t.path ? "active" : ""}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </nav>
  );
}
