import Button from "@/components/Button";
import { derivePhotoRatio } from "@/lib/polaroidGeometry";
import { useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

interface CropImageProps {
  img: string;
  crop: Point;
  zoom: number;
  orientation: "portrait" | "landscape";
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onOrientationChange: (orientation: "portrait" | "landscape") => void;
  onCropDone: (croppedImage: string) => void;
}
const CropImage = ({
  img,
  crop,
  zoom,
  orientation,
  onCropChange,
  onZoomChange,
  onOrientationChange,
  onCropDone,
}: CropImageProps) => {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const aspect = derivePhotoRatio(orientation);

  function onCropComplete(_: Area, croppedPixels: Area) {
    setCroppedAreaPixels(croppedPixels);
  }

  async function showCroppedImage() {
    if (!croppedAreaPixels) {
      return;
    }
    const result = await getCroppedImg(img, croppedAreaPixels);

    if (result) {
      onCropDone(result);
    }
  }

  async function getCroppedImg(imageSrc: string, pixelCrop: Area) {
    const image = await createImage(imageSrc);

    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx) {
      return null;
    }

    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    croppedCtx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise<string | null>((resolve) => {
      croppedCanvas.toBlob(
        (file) => {
          resolve(file ? URL.createObjectURL(file) : null);
        },
        "image/jpeg",
        0.98,
      );
    });
  }

  function createImage(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", reject);
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => onOrientationChange("portrait")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            orientation === "portrait"
              ? "bg-plum text-white"
              : "bg-plum-light text-plum/60"
          }`}
        >
          Portrait
        </button>

        <button
          type="button"
          onClick={() => onOrientationChange("landscape")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            orientation === "landscape"
              ? "bg-plum text-white"
              : "bg-plum-light text-plum/60"
          }`}
        >
          Landscape
        </button>
      </div>

      <div className="cropper relative h-[52dvh] w-full overflow-hidden rounded-2xl bg-ink">
        <Cropper
          image={img}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>

      <Button name="Done" onClick={showCroppedImage} fullWidth />
    </div>
  );
};

export default CropImage;
