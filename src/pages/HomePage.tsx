import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import HardwarePanel from "../components/ui/HardwarePanel";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="page-container animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <HardwarePanel
          style={{
            padding: "clamp(2rem, 8vw, 5rem) clamp(1rem, 4vw, 3rem)",
            background: "rgba(15, 23, 42, 0.9)",
            border: "2px solid var(--bui-fg-warning)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-sketch)",
              fontSize: "clamp(3rem, 10vw, 6rem)",
              color: "var(--bui-fg-warning)",
              marginBottom: "1.5rem",
              lineHeight: 1,
              textShadow: "0 0 15px rgba(251, 191, 36, 0.4)",
            }}
          >
            BACKSTAGE
            <br />
            MINIONS
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 3vw, 1.25rem)",
              color: "var(--color-pencil-light)",
              marginBottom: "3rem",
              lineHeight: "1.6",
              maxWidth: "600px",
              margin: "0 auto 3rem auto",
            }}
          >
            Welcome to the shadows. Grab your headset, double-check your rig,
            and keep the show running at all costs. The cast gets the applause,
            but we hold the power.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              className="btn-xl"
              style={{
                background: "var(--bui-fg-warning)",
                color: "#000",
                fontFamily: "var(--font-sketch)",
                fontSize: "1.5rem",
              }}
              onClick={() => navigate("/productions")}
            >
              Start Shift
            </Button>
            <Button
              className="btn-xl"
              variant="accent"
              style={{ fontFamily: "var(--font-sketch)", fontSize: "1.5rem" }}
              onClick={() => navigate("/networks")}
            >
              Check Comm Logs
            </Button>
          </div>
        </HardwarePanel>
      </div>
    </div>
  );
}
