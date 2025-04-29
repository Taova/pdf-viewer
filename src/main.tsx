import { StrictMode } from "react"; // in dev mode react executes useffect twice
//  все эффекты (useEffect, useLayoutEffect) выполняются дважды в режиме разработки. Это сделано для отладки "небезопасных" побочных эффектов.
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
