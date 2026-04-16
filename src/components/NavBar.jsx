import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { path: "/", icon: "🏠", label: "Home" },
  { path: "/productions", icon: "🎭", label: "Shows" },
  { path: "/stories", icon: "📖", label: "Stories" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="nav-bar">
      {TABS.map((t) => (
        <button
          key={t.path}
          onClick={() => navigate(t.path)}
          className={`nav-item ${pathname === t.path ? "active" : ""}`}
        >
          <span>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
