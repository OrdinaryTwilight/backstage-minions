import { useNavigate } from "react-router-dom";

export default function LevelFailedPage() {
  const navigate = useNavigate();
  return (
    <>
      <h1>💔 Show stopped</h1>
      <p>
        The show couldn't go on this time. Review the cue sheet, brush up on
        your technique, and try again.
      </p>
      <button
        onClick={() => navigate("/productions")}
        style={{
          cursor: "pointer",
          padding: "0.75rem 1.5rem",
          marginRight: "1rem",
        }}
      >
        Back to productions
      </button>
      <button
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", padding: "0.75rem 1.5rem" }}
      >
        Home
      </button>
    </>
  );
}
