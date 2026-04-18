import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Spinner } from "./components/shared/ui/Spinner";
import { GameProvider } from "./context/GameContext";
import { VisualSettingsProvider } from "./context/VisualSettingsContext";

// Eager load critical routes
import "./index.css";
import HomePage from "./pages/HomePage";
import NetworksPage from "./pages/NetworksPage";
import "./styles/animations.css";
import "./styles/components.css";
import "./styles/overworld.css";

// Lazy load
const ProductionsListPage = lazy(() => import("./pages/ProductionsListPage"));
const ProductionsPage = lazy(() => import("./pages/ProductionsPage"));
const SelectLevelPage = lazy(() => import("./pages/SelectLevelPage"));
const SelectCharacterPage = lazy(() => import("./pages/SelectCharacterPage"));
const GameLevelPage = lazy(() => import("./pages/GameLevelPage"));
const LevelFailedPage = lazy(() => import("./pages/LevelFailedPage"));
const StoriesPage = lazy(() => import("./pages/StoriesPage"));

function App() {
  return (
    <VisualSettingsProvider>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/productions"
              element={
                <Suspense fallback={<Spinner />}>
                  <ProductionsListPage />
                </Suspense>
              }
            />

            <Route
              path="/productions/:productionId"
              element={
                <Suspense fallback={<Spinner />}>
                  <ProductionsPage />
                </Suspense>
              }
            />

            {/* Matches: /productions/phantom/difficulty/school */}
            <Route
              path="/productions/:productionId/difficulty/:difficulty"
              element={
                <Suspense fallback={<Spinner />}>
                  <SelectLevelPage />
                </Suspense>
              }
            />

            {/* Matches: /productions/phantom/difficulty/school/character */}
            <Route
              path="/productions/:productionId/difficulty/:difficulty/character"
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
              path="/level-failed/:productionId/:difficulty/:charId"
              element={
                <Suspense fallback={<Spinner />}>
                  <LevelFailedPage />
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

            <Route path="/networks" element={<NetworksPage />} />
          </Routes>
          <Analytics />
          <SpeedInsights />
        </Router>
      </GameProvider>
    </VisualSettingsProvider>
  );
}

export default App;
