/**
 * @file React Application Entry Point
 * @description Mounts React app into DOM and initializes React 18 root.
 * 
 * Sets up:
 * - React StrictMode for development warnings
 * - DOM root mounting
 * - Error boundaries (via App.tsx)
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
