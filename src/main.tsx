import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "@/router";
import Splash from "@/components/Splash";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Splash>
      <RouterProvider router={router} />
    </Splash>
  </StrictMode>,
);
