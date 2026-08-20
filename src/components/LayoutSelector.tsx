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
      <div className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-ink/40">
        Choose your layout
      </div>
      <div className="mx-auto flex max-w-sm flex-col gap-3">
        {layouts.map((el) => (
          <Card key={el.variant} el={el} handleClick={handleClick} />
        ))}
      </div>
    </>
  );
};

export default LayoutSelector;
