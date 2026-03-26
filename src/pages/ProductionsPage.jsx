import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { PRODUCTIONS } from "../data/gameData";

export default function ProductionsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = PRODUCTIONS.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <main>
        <h1>🎭 Productions</h1>
        <input
          type="text"
          placeholder="Search productions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width:"100%", padding:"0.65rem 1rem", borderRadius:"8px",
            border:"1px solid var(--border)", background:"var(--surface2)",
            color:"var(--text)", fontSize:"0.95rem", marginBottom:"1rem" }}
        />
        {filtered.map(p => (
          <div key={p.id} onClick={() => navigate(`/productions/${p.id}`)} style={{ cursor: "pointer" }}>
            {p.poster}
            <h2>{p.title}</h2>
            <p>{p.description.slice(0,90)}…</p>
          </div>
        ))}
      </main>
    </>
  );
}
