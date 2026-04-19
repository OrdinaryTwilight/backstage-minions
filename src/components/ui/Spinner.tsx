/**
 * Loading Spinner Component
 * Displays while lazy-loaded routes are being fetched
 */
export function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          animation: "spin 1s linear infinite",
        }}
      >
        ⏳
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
