import { useRef } from "react";

interface UploaderProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requiredPhotoCount: number;
  selectedCount: number;
  isProcessing?: boolean;
}

const Uploader = ({
  handleFileChange,
  requiredPhotoCount,
  selectedCount,
  isProcessing,
}: UploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isProcessing}
        className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-plum/25 bg-plum-light/40 px-6 py-10 text-center transition-colors active:bg-plum-light disabled:opacity-70"
      >
        <span
          className={`flex size-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm ${
            isProcessing ? "animate-pulse" : ""
          }`}
        >
          {isProcessing ? "✨" : "📷"}
        </span>
        <span className="text-sm font-semibold text-ink">
          {isProcessing
            ? "Getting your photos ready..."
            : selectedCount > 0
              ? `${selectedCount} of ${requiredPhotoCount} photo${requiredPhotoCount > 1 ? "s" : ""} selected`
              : `Tap to choose ${requiredPhotoCount} photo${requiredPhotoCount > 1 ? "s" : ""}`}
        </span>
        <span className="text-xs text-ink/40">
          {isProcessing
            ? "This takes a couple of seconds"
            : "From your camera roll"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default Uploader;
