import Card from "@/components/Card";
import Modal from "@/components/Modal";
import { layouts } from "@/data/layouts";
import type { Layout } from "@/types/layouts";
import { useState } from "react";

const LayoutSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState<Layout>(layouts[0]);
  const handleClick = (el: Layout) => { setIsOpen(true); setLayout(el); };
  return <section className="flex flex-col gap-5" aria-labelledby="layout-heading">
    <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-violet">Pick your keepsake</p><h2 id="layout-heading" className="mt-2 text-2xl font-black text-plum sm:text-3xl">Choose a layout</h2></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{layouts.map((el) => <Card key={el.variant} el={el} handleClick={handleClick} />)}</div>
    <Modal layout={layout} open={isOpen} close={() => setIsOpen(false)} requiredPhotoCount={layout.imageCount} />
  </section>;
};
export default LayoutSelector;
