export const createPolaroidImage = (img: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      // The cropper already determines the photo's aspect ratio:
      // portrait  → 3:4
      // landscape → 4:3
      //
      // This function only adds the Polaroid frame around that photo.

      // Top and side margins are equal.
      const margin = Math.round(image.width * 0.08);

      // The bottom margin is intentionally larger than the top margin.
      const bottomMargin = Math.round(image.width * 0.16);

      const canvas = document.createElement("canvas");

      canvas.width = image.width + margin * 2;
      canvas.height = image.height + margin + bottomMargin;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Create the white Polaroid surface.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Place the cropped photo inside the Polaroid frame.
      // The photo keeps its original pixel dimensions.
      ctx.drawImage(image, margin, margin);

      // Convert the completed Polaroid into a Blob URL.
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
