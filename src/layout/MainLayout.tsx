import Navbar from "@/components/Navbar";
import { Outlet, ScrollRestoration } from "react-router";

const MainLayout = () => {
  return (
    <div className="relative flex min-h-dvh flex-col bg-paper">
      {/* Ambient wash — sits behind every page so nothing feels blank */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-lavender) 0%, var(--color-blush) 55%, transparent 75%)",
          }}
        />
      </div>

      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
};

export default MainLayout;
