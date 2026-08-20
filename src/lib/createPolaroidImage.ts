import { DEFAULT_GEOMETRY, getCardMarginsPx } from "@/lib/polaroidGeometry";

export const createPolaroidImage = (img: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      // Margins are derived from the same geometry spec used by the
      // cropper, so card <-> photo proportions can never drift apart.
      const { top, side, bottom } = getCardMarginsPx(
        DEFAULT_GEOMETRY,
        image.width,
      );

      const canvas = document.createElement("canvas");

      canvas.width = image.width + side * 2;
      canvas.height = image.height + top + bottom;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(image, side, top);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create Polaroid image"));
          return;
        }

        const polaroidUrl = URL.createObjectURL(blob);
        resolve(polaroidUrl);
      }, "image/png");
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    image.src = img;
  });
};
