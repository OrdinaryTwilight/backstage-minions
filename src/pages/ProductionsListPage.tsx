import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/shared/layout/NavBar";
import HardwarePanel from "../components/shared/panels/HardwarePanel";
import SectionHeader from "../components/shared/ui/SectionHeader";
import { PRODUCTIONS } from "../data/gameData";

export default function ProductionsListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = PRODUCTIONS.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="page-container animate-blueprint">
      <NavBar />
      <SectionHeader
        title="Archives"
        subtitle="Archived work orders and technical data."
      />

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search archives..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // FIX: Use setQuery
        />
      </div>

      <div className="bento-container">
        {filtered.map((p, idx) => (
          <HardwarePanel
            key={p.id}
            variant="clickable"
            className="animate-pop"
            style={{ animationDelay: `${idx * 0.1}s` }}
            onClick={() => navigate(`/productions/${p.id}`)}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              {p.poster}
            </div>
            <h2 className="annotation-text" style={{ fontSize: "1.4rem" }}>
              {p.title}
            </h2>
            <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>{p.description}</p>
          </HardwarePanel>
        ))}
      </div>
    </div>
  );
}
