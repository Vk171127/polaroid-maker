import type { Orientation } from "@/lib/polaroidGeometry";

const A6_WIDTH_MM = 105;
const A6_HEIGHT_MM = 148;

const PRINT_DPI = 300;
const MM_TO_PX = PRINT_DPI / 25.4;

interface CardInput {
  url: string;
  orientation: Orientation;
}

interface CardCell {
  x: number;
  y: number;
  width: number;
  height: number;
}

function drawCutLines(
  ctx: CanvasRenderingContext2D,
  imageCount: number,
  sheetW: number,
  sheetH: number,
) {
  ctx.save();
  ctx.strokeStyle = "#999999";
  ctx.lineWidth = 2;
  ctx.setLineDash([20, 10]); // dash length, gap length — tweak to taste

  if (imageCount === 2) {
    // one horizontal line across the middle
    ctx.beginPath();
    ctx.moveTo(0, sheetH / 2);
    ctx.lineTo(sheetW, sheetH / 2);
    ctx.stroke();
  }

  if (imageCount === 4) {
    // one horizontal + one vertical line through the middle
    ctx.beginPath();
    ctx.moveTo(0, sheetH / 2);
    ctx.lineTo(sheetW, sheetH / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(sheetW / 2, 0);
    ctx.lineTo(sheetW / 2, sheetH);
    ctx.stroke();
  }

  ctx.restore();
}

function getTargetOrientation(imageCount: number): "portrait" | "landscape" {
  if (imageCount === 1) return "portrait";
  if (imageCount === 2) return "landscape";
  if (imageCount === 4) return "portrait";
  throw new Error(`Unsupported imageCount: ${imageCount}`);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

// Placement rectangles for N cards, following the same "halve along the
// long edge" logic as ISO paper sizes.
function getCellLayout(
  imageCount: number,
  sheetW: number,
  sheetH: number,
): CardCell[] {
  if (imageCount === 1) {
    return [{ x: 0, y: 0, width: sheetW, height: sheetH }];
  }

  if (imageCount === 2) {
    const cellH = sheetH / 2;
    return [
      { x: 0, y: 0, width: sheetW, height: cellH },
      { x: 0, y: cellH, width: sheetW, height: cellH },
    ];
  }

  if (imageCount === 4) {
    const cellW = sheetW / 2;
    const cellH = sheetH / 2;
    return [
      { x: 0, y: 0, width: cellW, height: cellH },
      { x: cellW, y: 0, width: cellW, height: cellH },
      { x: 0, y: cellH, width: cellW, height: cellH },
      { x: cellW, y: cellH, width: cellW, height: cellH },
    ];
  }

  throw new Error(`Unsupported imageCount: ${imageCount}`);
}

export async function composeA6Sheet(cards: CardInput[]): Promise<string> {
  const imageCount = cards.length;
  const targetOrientation = getTargetOrientation(imageCount);

  const sheetW = Math.round(A6_WIDTH_MM * MM_TO_PX);
  const sheetH = Math.round(A6_HEIGHT_MM * MM_TO_PX);

  const cells = getCellLayout(imageCount, sheetW, sheetH);

  const canvas = document.createElement("canvas");
  canvas.width = sheetW;
  canvas.height = sheetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, sheetW, sheetH);

  for (let i = 0; i < cards.length; i++) {
    const { url, orientation } = cards[i];
    const cell = cells[i];
    const image = await loadImage(url);

    const needsRotation = orientation !== targetOrientation;

    ctx.save();

    if (needsRotation) {
      // Rotate about the cell's center; draw with width/height swapped
      // so the rotated result exactly fills the (differently-shaped) cell.
      ctx.translate(cell.x + cell.width / 2, cell.y + cell.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(
        image,
        -cell.height / 2,
        -cell.width / 2,
        cell.height,
        cell.width,
      );
    } else {
      ctx.drawImage(image, cell.x, cell.y, cell.width, cell.height);
    }

    ctx.restore();
  }

  drawCutLines(ctx, imageCount, sheetW, sheetH);

  const MAX_BYTES = 4.3 * 1024 * 1024; // buffer under Vercel's 4.5MB hard limit
  const toBlob = (type: string, quality?: number) =>
    new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, quality),
    );
  const pngBlob = await toBlob("image/png");
  if (!pngBlob) {
    throw new Error("Failed to create printable sheet");
  }

  if (pngBlob.size <= MAX_BYTES) {
    return URL.createObjectURL(pngBlob);
  }
  // PNG too large — fall back to JPEG, which compresses photo content far better.
  const jpegBlob = await toBlob("image/jpeg", 0.92);
  if (!jpegBlob) {
    throw new Error("Failed to create printable sheet");
  }
  return URL.createObjectURL(jpegBlob);
}
