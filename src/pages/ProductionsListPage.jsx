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
      <h1 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        🎭 Productions
      </h1>
      <p
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "var(--text-muted)",
        }}
      >
        Select a production to perform
      </p>

      <input
        type="text"
        placeholder="Search productions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="surface-panel"
        style={{
          width: "100%",
          padding: "1rem",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

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
