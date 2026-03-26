import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import HomePage from "./pages/HomePage";
import ProductionsPage from "./pages/ProductionsPage";
import SelectLevelPage from "./pages/SelectLevelPage";
import SelectCharacterPage from "./pages/SelectCharacterPage";
import GameLevelPage from "./pages/GameLevelPage";
import LevelCompletePage from "./pages/LevelCompletePage";
import LevelFailedPage from "./pages/LevelFailedPage";
import StoriesPage from "./pages/StoriesPage";
import "./App.css";

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productions/:productionId" element={<ProductionsPage />} />
          <Route path="/productions/:productionId/difficulty/:difficulty" element={<SelectLevelPage />} />
          <Route path="/productions/:productionId/difficulty/:difficulty/character" element={<SelectCharacterPage />} />
          <Route path="/game/:productionId/:difficulty/:levelId" element={<GameLevelPage />} />
          <Route path="/level-complete/:productionId/:difficulty/:levelId" element={<LevelCompletePage />} />
          <Route path="/level-failed/:productionId/:difficulty/:levelId" element={<LevelFailedPage />} />
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
