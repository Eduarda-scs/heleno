import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import posthog from "posthog-js";

// ✅ Inicializa UMA ÚNICA VEZ
posthog.init(
  "phc_HOVzYo5ItSgnaGqHSWNi76UcvYXfE4p9cmMVSVmiojE",
  {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only", // ideal para site institucional
    autocapture: true, // pageviews, cliques etc
    capture_pageview: true,
  }
);

// (opcional - apenas DEV)
if (import.meta.env.DEV) {
  // @ts-ignore
  window.posthog = posthog;
}

createRoot(document.getElementById("root")!).render(<App />);