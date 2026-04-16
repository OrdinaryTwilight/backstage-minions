// src/pages/ProductionsListPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import HardwarePanel from "../components/ui/HardwarePanel"; // Fix: Import HardwarePanel
import SectionHeader from "../components/ui/SectionHeader"; // Fix: Import SectionHeader
import { PRODUCTIONS } from "../data/gameData";

export default function ProductionsListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = PRODUCTIONS.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="page-container">
      <NavBar />
      <SectionHeader
        title="Production Archives"
        subtitle="Search active work orders and archival records."
      />

      {/* Styled Blueprint Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search archives..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Fix: Use setQuery
        />
      </div>

      <div className="bento-container">
        {filtered.map((p) => (
          <HardwarePanel
            key={p.id}
            variant="clickable"
            onClick={() => navigate(`/productions/${p.id}`)}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
              {p.poster}
            </div>
            <h2
              className="annotation-text"
              style={{ marginBottom: "0.5rem", fontSize: "1.4rem" }}
            >
              {p.title}
            </h2>
            <p style={{ fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5" }}>
              {p.description}
            </p>
            <div
              className="problem-highlight"
              style={{ marginTop: "1.5rem", fontSize: "0.75rem" }}
            >
              View Briefing ›
            </div>
          </HardwarePanel>
        ))}
      </div>
    </div>
  );
}
