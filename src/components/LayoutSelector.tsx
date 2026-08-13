import Card from "@/components/Card";
import Modal from "@/components/Modal";
import { layouts } from "@/data/layouts";
import type { Layout } from "@/types/layouts";
import { useState } from "react";

const LayoutSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState<Layout>(layouts[0]);
  const handleClick = (el: Layout) => {
    setIsOpen(true);
    setLayout(el);
  };
  const modelClose = () => setIsOpen(false);
  return (
    <>
      <Modal
        layout={layout}
        open={isOpen}
        close={modelClose}
        requiredPhotoCount={layout.imageCount}
      />
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
