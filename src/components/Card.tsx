import type { Layout } from "@/types/layouts";

interface CardProps {
  el: Layout;
  handleClick: (layout: Layout) => void;
}

const Card = ({ el, handleClick }: CardProps) => {
  return (
    <div
      className="flex flex-col hover:bg-slate-200 text-xs w-40 border rounded-xl p-2 cursor-pointer"
      onClick={() => handleClick(el)}
    >
      <div>Variant - {el.variant}</div>
      <div>{el.imageCount} Polaroids</div>
      <div>Rs. {el.price}</div>
    </div>
  );
};

export default Card;
