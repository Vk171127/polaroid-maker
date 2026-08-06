import Card from "@/components/Card";
import { layouts } from "@/data/layouts";
import type { Layout } from "@/types/layouts";

const LayoutSelector = () => {
  const handleClick = (el: Layout) => {
    console.log(`${el.variant} variant is clicked!`);
  };
  return (
    <>
      <div className="text-xl">Choose your Layout 📸</div>
      <div className="flex flex-wrap justify-center p-2 gap-2">
        {layouts.map((el) => (
          <Card el={el} handleClick={handleClick} />
        ))}
      </div>
    </>
  );
};

export default LayoutSelector;
