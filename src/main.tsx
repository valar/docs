import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { loadDoc, pagePath } from "./site";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-600.css";
import "./index.css";

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Load the page's content before hydrating, so the first render matches the prerendered HTML.
await loadDoc(pagePath(window.location.pathname));
const root = document.getElementById("root")!;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
