import logo from "@/assets/logo.png";

interface BurstItem {
  emoji: string;
  label: string;
}

// The signature "many hands" moment — one maker, every craft.
// Trim/reorder freely; the layout adapts to however many you list.
const items: BurstItem[] = [
  { emoji: "🔗", label: "Charm bracelets" },
  { emoji: "✨", label: "Resin keychains" },
  { emoji: "🌸", label: "Preserved flowers" },
  { emoji: "💐", label: "Bouquets" },
  { emoji: "📓", label: "Journals" },
  { emoji: "💌", label: "Invitations" },
  { emoji: "🖼️", label: "Photo keychains" },
  { emoji: "🎁", label: "Mystery boxes" },
  { emoji: "🎀", label: "Scrunchies" },
];

const RADIUS = 40; // percent of container

const MakerBurst = () => {
  const points = items.map((item, i) => {
    const angle = (-90 + (360 / items.length) * i) * (Math.PI / 180);
    const x = 50 + RADIUS * Math.cos(angle);
    const y = 50 + RADIUS * Math.sin(angle);
    return { ...item, x, y };
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-85">
      {/* Connecting arms */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {points.map((p, i) => (
          <line
            key={i}
            x1={50}
            y1={50}
            x2={p.x}
            y2={p.y}
            stroke="var(--color-lavender)"
            strokeWidth={0.6}
            strokeLinecap="round"
            strokeDasharray="1 3"
            className="burst-line"
            style={{ animationDelay: `${i * 70}ms` }}
          />
        ))}
      </svg>

      {/* Craft badges */}
      {points.map((p, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <div
            className="burst-badge flex flex-col items-center gap-1"
            style={{ animationDelay: `${120 + i * 70}ms` }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg shadow-md shadow-plum/10 ring-1 ring-line">
              {p.emoji}
            </span>
            <span className="w-16 text-center text-[10px] font-medium leading-tight text-ink/60">
              {p.label}
            </span>
          </div>
        </div>
      ))}

      {/* Center: the maker */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-1 shadow-lg shadow-plum/20 ring-2 ring-plum/15">
          <img
            src={logo}
            alt="Elf 'n Tales"
            className="h-full w-full rounded-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default MakerBurst;
