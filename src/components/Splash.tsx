import { useEffect, useState } from "react";

interface SplashProps {
  children: React.ReactNode;
}

const MIN_DISPLAY_MS = 1200; // floor so it never just flickers
const FADE_MS = 300; // must match the duration-300 class below

const Splash = ({ children }: SplashProps) => {
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const fontsReady = document.fonts
      ? document.fonts.ready
      : Promise.resolve();

    fontsReady.then(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);
      window.setTimeout(() => setReady(true), remaining);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timeout = window.setTimeout(() => setMounted(false), FADE_MS);
    return () => window.clearTimeout(timeout);
  }, [ready]);

  return (
    <>
      {children}

      {mounted && (
        <div
          aria-hidden
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-plum transition-opacity duration-300 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <span className="burst-badge font-script text-5xl text-white">
            Elf &apos;n Tales
          </span>
          <span className="burst-line text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
            The little elf&apos;s magic touch
          </span>
        </div>
      )}
    </>
  );
};

export default Splash;
