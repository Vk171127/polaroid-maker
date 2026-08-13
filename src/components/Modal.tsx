import Stepper from "@/components/Stepper";
import type { Layout } from "@/types/layouts";

interface ModalProps {
  layout: Layout;
  open: boolean;
  close: () => void;
  requiredPhotoCount: number;
}

const Modal = ({ layout, open, close, requiredPhotoCount }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center text-sm">
      <div className="flex flex-col bg-slate-100 w-[80vw] h-5/6 absolute justify-between rounded-lg p-6 shadow-lg">
        <button
          onClick={close}
          className="absolute p-1 right-3 top-3 hover:cursor-pointer hover:bg-slate-200 rounded-full focus:outline-none transition-colors duration-200"
        >
          {" x "}
        </button>
        <div className="text-sm">
          <div>
            ₹ {layout.price} • {layout.imageCount} photos
          </div>
        </div>
        <Stepper requiredPhotoCount={requiredPhotoCount} close={close} />
      </div>
    </div>
  );
};

export default Modal;
