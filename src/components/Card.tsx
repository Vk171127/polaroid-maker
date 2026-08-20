import type { Layout } from "@/types/layouts";

interface CardProps { el: Layout; handleClick: (layout: Layout) => void; }

const Card = ({ el, handleClick }: CardProps) => (
  <button type="button" className="group flex min-h-44 flex-1 flex-col justify-between rounded-[1.75rem] border border-violet/20 bg-paper p-5 text-left shadow-[0_12px_30px_rgba(77,37,95,0.08)] transition-all hover:-translate-y-1 hover:border-violet hover:shadow-[0_18px_40px_rgba(77,37,95,0.16)] sm:min-w-44" onClick={() => handleClick(el)}>
    <div className="flex items-start justify-between"><span className="rounded-full bg-lavender px-3 py-1 text-xs font-bold uppercase tracking-wider text-plum">Set {el.variant}</span><span className="text-xl text-blush">✦</span></div>
    <div><p className="mt-6 text-lg font-bold text-plum">{el.imageCount} Polaroids</p><p className="mt-1 text-sm text-plum/60">Handmade memory set</p><p className="mt-4 text-xl font-black text-violet">₹ {el.price}</p></div>
  </button>
);
export default Card;
