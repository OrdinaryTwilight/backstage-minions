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
    <>
      <NavBar />
      <div className="game-window">
        <div className="vn-panel">
          <h1>🎭 Productions</h1>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              fontSize: "0.6rem",
            }}
          >
            Select a production to perform
          </p>

          <input
            type="text"
            placeholder="Search productions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 1rem",
              borderRadius: "0",
              border: "4px solid var(--border2)",
              background: "var(--surface2)",
              color: "var(--text)",
              fontSize: "0.6rem",
              marginBottom: "1.5rem",
              boxShadow: "4px 4px 0 var(--shadow)",
            }}
          />

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/productions/${p.id}`)}
                style={{
                  cursor: "pointer",
                  padding: "1.5rem",
                  background: "var(--surface2)",
                  border: "4px solid var(--border)",
                  boxShadow: "4px 4px 0 var(--shadow)",
                  transition: "all 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent2)";
                  e.currentTarget.style.boxShadow = "2px 2px 0 var(--shadow)";
                  e.currentTarget.style.transform = "translate(2px, 2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "4px 4px 0 var(--shadow)";
                  e.currentTarget.style.transform = "translate(0, 0)";
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  {p.poster}
                </div>
                <h2 style={{ marginBottom: "0.5rem" }}>{p.title}</h2>
                <p style={{ fontSize: "0.55rem" }}>
                  {p.description.slice(0, 120)}…
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
