import Stepper from "@/components/Stepper";
import type { Layout } from "@/types/layouts";
import { useEffect, useRef } from "react";

interface ModalProps {
  layout: Layout;
  open: boolean;
  close: () => void;
  requiredPhotoCount: number;
}

const variantLabel: Record<Layout["variant"], string> = {
  small: "Mini Set",
  medium: "Duo Set",
  large: "Solo Print",
};

const Modal = ({ layout, open, close, requiredPhotoCount }: ModalProps) => {
  // Tracks whether the history entry we pushed is still the current one,
  // so we don't pop twice (once from our own close(), once from popstate).
  const pushedState = useRef(false);

  useEffect(() => {
    if (!open) return;

    // Push a dummy history entry the moment the modal opens. A swipe-back
    // (or the hardware/browser back button) now lands on THIS entry first,
    // firing 'popstate' instead of leaving the site.
    window.history.pushState({ modal: true }, "");
    pushedState.current = true;

    const handlePopState = () => {
      pushedState.current = false;
      close();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // If the modal is closing because of a click (not the back gesture),
      // clean up the extra history entry we added so back/forward stays sane.
      if (pushedState.current) {
        pushedState.current = false;
        window.history.back();
      }
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div className="flex h-[92dvh] w-full flex-col rounded-t-3xl bg-paper shadow-xl sm:h-5/6 sm:max-w-md sm:rounded-3xl">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-ink/15" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div>
            <div className="text-sm font-semibold text-ink">
              {variantLabel[layout.variant]}
            </div>
            <div className="text-xs text-ink/50">
              ₹{layout.price} · {layout.imageCount} photo
              {layout.imageCount > 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-plum-light hover:text-plum"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
          <Stepper requiredPhotoCount={requiredPhotoCount} close={close} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
