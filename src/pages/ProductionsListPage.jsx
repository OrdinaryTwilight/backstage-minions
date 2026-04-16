import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
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
        subtitle="Search active work orders."
      />

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search archives..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/productions/${p.id}`)}
            className="surface-panel"
            style={{ cursor: "pointer" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              {p.poster}
            </div>
            <h2 style={{ marginBottom: "0.5rem", fontSize: "1.2rem" }}>
              {p.title}
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                lineHeight: "1.4",
              }}
            >
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
