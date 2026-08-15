import Button from "@/components/Button";
import { useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

interface CropImageProps {
  img: string;
  crop: Point;
  zoom: number;
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropDone: (croppedImage: string) => void;
}
const CropImage = ({
  img,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropDone,
}: CropImageProps) => {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (croppedImage) {
        URL.revokeObjectURL(croppedImage);
      }
    };
  }, [croppedImage]);

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
      croppedCanvas.toBlob((file) => {
        resolve(file ? URL.createObjectURL(file) : null);
      }, "image/jpeg");
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
    <>
      <div className="cropper h-[70vh] relative w-full">
        <Cropper
          image={img}
          crop={crop}
          zoom={zoom}
          aspect={3 / 4}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <Button name="Done" onClick={showCroppedImage} />
    </>
  );
};

export default CropImage;
