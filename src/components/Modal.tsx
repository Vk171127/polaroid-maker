import Button from "@/components/Button";
import type { Layout } from "@/types/layouts";

interface ModalProps {
  layout: Layout;
  open: boolean;
  close: () => void;
}

const Modal = ({ layout, open, close }: ModalProps) => {
  const handleClick = () => {
    console.log("clickkkk");
  };
  if (!open) return null;

  return (
    <div className="flex flex-col text-lg top-20 h-[80vh] bg-slate-200 w-[80vw] absolute justify-around">
      <div
        onClick={close}
        className="absolute p-1 right-2 top-2 hover:cursor-pointer border rounded"
      >
        {" x "}
      </div>
      <div>
        <div>you have selected {layout.variant} variant</div>
        <div>
          select {layout.imageCount} Photo/s - Rs. {layout.price}
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        <Button onClick={close} variant="outline" name="Close" />
        <Button onClick={handleClick} name="Proceed" />
      </div>
    </div>
  );
};

export default Modal;
