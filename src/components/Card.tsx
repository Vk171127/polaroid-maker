import type { Layout } from "@/types/layouts";

interface CardProps {
  el: Layout;
  handleClick: (layout: Layout) => void;
}

const variantLabel: Record<Layout["variant"], string> = {
  small: "Mini Set",
  medium: "Duo Set",
  large: "Solo Print",
};

const variantBlurb: Record<Layout["variant"], string> = {
  small: "4 little Polaroids on one sheet",
  medium: "2 Polaroids, a little bigger",
  large: "1 large statement Polaroid",
};

const Card = ({ el, handleClick }: CardProps) => {
  return (
    <button
      onClick={() => handleClick(el)}
      className="flex w-full items-center gap-4 rounded-2xl border border-line bg-white p-4 text-left shadow-sm shadow-plum/5 transition-all active:scale-[0.98] active:bg-plum-light/40"
    >
      {/* Mini polaroid stack icon, count-aware */}
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
        {Array.from({ length: Math.min(el.imageCount, 3) }).map((_, i) => (
          <div
            key={i}
            className="absolute h-10 w-8 rounded-xs border border-line bg-lavender-light shadow-sm"
            style={{
              transform: `rotate(${(i - 1) * 10}deg) translateX(${(i - 1) * 3}px)`,
            }}
          />
        ))}
      </div>

      <div className="flex-1">
        <div className="font-semibold text-ink">{variantLabel[el.variant]}</div>
        <div className="text-xs text-ink/50">{variantBlurb[el.variant]}</div>
      </div>

      <div className="text-right">
        <div className="text-sm font-bold text-plum">₹{el.price}</div>
        <div className="text-[11px] text-ink/40">
          {el.imageCount} photo{el.imageCount > 1 ? "s" : ""}
        </div>
      </div>
    </button>
  );
};

export default Card;
