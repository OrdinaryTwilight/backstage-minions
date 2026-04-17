import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Suspense, lazy, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Spinner } from "./components/ui/Spinner";
import { GameProvider } from "./context/GameContext";

// Eager load critical routes
import "./App.css";
import HomePage from "./pages/HomePage";

// Lazy load less critical routes for better initial load time
const ProductionsListPage = lazy(() => import("./pages/ProductionsListPage"));
const ProductionsPage = lazy(() => import("./pages/ProductionsPage"));
const SelectLevelPage = lazy(() => import("./pages/SelectLevelPage"));
const SelectCharacterPage = lazy(() => import("./pages/SelectCharacterPage"));
const GameLevelPage = lazy(() => import("./pages/GameLevelPage"));
const LevelCompletePage = lazy(() => import("./pages/LevelCompletePage"));
const LevelFailedPage = lazy(() => import("./pages/LevelFailedPage"));
const StoriesPage = lazy(() => import("./pages/StoriesPage"));

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("App mounted");
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ color: "white", padding: "20px" }}>Loading...</div>;
  }

  try {
    return (
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/productions/:productionId"
              element={
                <Suspense fallback={<Spinner />}>
                  <ProductionsPage />
                </Suspense>
              }
            />

            <Route
              path="/productions/:productionId/:difficulty"
              element={
                <Suspense fallback={<Spinner />}>
                  <SelectLevelPage />
                </Suspense>
              }
            />

            <Route
              path="/productions/:productionId/:difficulty/character"
              element={
                <Suspense fallback={<Spinner />}>
                  <SelectCharacterPage />
                </Suspense>
              }
            />

            <Route
              path="/game/:productionId/:difficulty/:charId"
              element={
                <Suspense fallback={<Spinner />}>
                  <GameLevelPage />
                </Suspense>
              }
            />
            <Route
              path="/stories"
              element={
                <Suspense fallback={<Spinner />}>
                  <StoriesPage />
                </Suspense>
              }
            />
          </Routes>
          <Analytics />
          <SpeedInsights />
        </Router>
      </GameProvider>
    );
  } catch (error) {
    console.error("App error:", error);
    return (
      <div style={{ color: "red", padding: "20px", backgroundColor: "black" }}>
        <h1>Error rendering app</h1>
        <p>{error?.message}</p>
        <p>{JSON.stringify(error)}</p>
      </div>
    );
  }
}

export default App;
