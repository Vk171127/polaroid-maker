export const cropImageToAspect = (
  img: string,
  aspect: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const imageAspect = image.width / image.height;

      let cropWidth = image.width;
      let cropHeight = image.height;

      if (imageAspect > aspect) {
        // Too wide → crop the sides
        cropWidth = image.height * aspect;
      } else if (imageAspect < aspect) {
        // Too tall → crop top/bottom
        cropHeight = image.width / aspect;
      }

      const cropX = (image.width - cropWidth) / 2;
      const cropY = (image.height - cropHeight) / 2;

      const canvas = document.createElement("canvas");

      canvas.width = Math.round(cropWidth);
      canvas.height = Math.round(cropHeight);

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create cropped image"));
            return;
          }

          resolve(URL.createObjectURL(blob));
        },
        "image/jpeg",
        0.98,
      );
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    image.src = img;
  });
};
