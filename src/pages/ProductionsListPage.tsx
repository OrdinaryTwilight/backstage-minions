// src/pages/ProductionsListPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HardwarePanel from "../components/ui/HardwarePanel";
import NavBar from "../components/ui/NavBar";
import SectionHeader from "../components/ui/SectionHeader";
import { PRODUCTIONS } from "../data/gameData";

export default function ProductionsListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = PRODUCTIONS.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="page-container animate-blueprint"
      style={{ paddingTop: "1rem" }}
    >
      <NavBar />
      <SectionHeader
        title="Active Productions"
        subtitle="Select a show to view the callboard and pick your role."
      />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto 2rem auto",
          padding: "0 1rem",
        }}
      >
        <input
          type="text"
          style={{
            width: "100%",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            background: "rgba(15, 23, 42, 0.8)",
            border: "2px solid var(--bui-border)",
            color: "white",
            fontFamily: "var(--font-sketch)",
            fontSize: "1.1rem",
          }}
          placeholder="Search callboards..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        {filtered.map((p, idx) => (
          <HardwarePanel
            key={p.id}
            variant="clickable"
            className="animate-pop hover-lift"
            style={{
              animationDelay: `${idx * 0.1}s`,
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
            }}
            onClick={() => navigate(`/productions/${p.id}`)}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {p.poster}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-sketch)",
                fontSize: "1.8rem",
                color: "var(--bui-fg-warning)",
                marginBottom: "0.5rem",
                textAlign: "center",
              }}
            >
              {p.title}
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--color-pencil-light)",
                lineHeight: "1.6",
                flex: 1,
                textAlign: "center",
              }}
            >
              {p.description}
            </p>
          </HardwarePanel>
        ))}
      </div>
    </div>
  );
}
