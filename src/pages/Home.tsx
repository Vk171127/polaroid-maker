import LayoutSelector from "@/components/LayoutSelector";

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Soft watercolor flourish, echoing the logo — landing only */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-lavender) 0%, var(--color-blush) 55%, transparent 75%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-2 px-6 pt-12 pb-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-plum/60">
          Elf &apos;n Tales
        </span>
        <h1 className="font-script text-5xl leading-tight text-ink">
          Turn moments into Polaroids
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-ink/60">
          Choose a layout, upload your favorite photos, and preview your
          keepsakes before they print. No account, no fuss.
        </p>
      </div>

      <div className="relative px-5 pb-16">
        <LayoutSelector />
      </div>
    </div>
  );
};

export default Home;
