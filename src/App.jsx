import { BrowserRouter as Router, Routes, Route, Suspense, lazy } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { Spinner } from "./components/ui/Spinner";
// Eager load critical routes
import HomePage from "./pages/HomePage";
import StoriesPage from "./pages/StoriesPage";
// Lazy load less critical routes for better initial load time
const ProductionsPage = lazy(() => import("./pages/ProductionsPage"));
const SelectLevelPage = lazy(() => import("./pages/SelectLevelPage"));
const SelectCharacterPage = lazy(() => import("./pages/SelectCharacterPage"));
const GameLevelPage = lazy(() => import("./pages/GameLevelPage"));
const LevelCompletePage = lazy(() => import("./pages/LevelCompletePage"));
const LevelFailedPage = lazy(() => import("./pages/LevelFailedPage"));
import "./App.css";

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productions/:productionId" element={<Suspense fallback={<Spinner />}><ProductionsPage /></Suspense>} />
          <Route path="/productions/:productionId/difficulty/:difficulty" element={<Suspense fallback={<Spinner />}><SelectLevelPage /></Suspense>} />
          <Route path="/productions/:productionId/difficulty/:difficulty/character" element={<Suspense fallback={<Spinner />}><SelectCharacterPage /></Suspense>} />
          <Route path="/game/:productionId/:difficulty/:levelId" element={<Suspense fallback={<Spinner />}><GameLevelPage /></Suspense>} />
          <Route path="/level-complete/:productionId/:difficulty/:levelId" element={<Suspense fallback={<Spinner />}><LevelCompletePage /></Suspense>} />
          <Route path="/level-failed/:productionId/:difficulty/:levelId" element={<Suspense fallback={<Spinner />}><LevelFailedPage /></Suspense>} />
          <Route path="/stories" element={<StoriesPage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
