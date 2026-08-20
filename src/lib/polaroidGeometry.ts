export type Orientation = "portrait" | "landscape";

export interface PolaroidGeometry {
  // Portrait card ratio (height / width). Same shape as A4/A6: 297/210.
  baseCardRatio: number;
  // Side + top margin, as a fraction of card width.
  sideMarginPct: number;
  // Bottom margin = sideMarginPct * bottomMultiplier.
  bottomMultiplier: number;
}

export const DEFAULT_GEOMETRY: PolaroidGeometry = {
  baseCardRatio: 297 / 210, // ISO A-series ratio (~1.4142)
  sideMarginPct: 0.08,
  bottomMultiplier: 3, // tune by eye once you see a real render
};

export function getCardRatio(
  geometry: PolaroidGeometry,
  orientation: Orientation,
): number {
  return orientation === "portrait"
    ? geometry.baseCardRatio
    : 1 / geometry.baseCardRatio;
}

// Returns width/height ratio for the PHOTO crop area — feed directly into
// react-easy-crop's `aspect` prop (which is width/height).
export function derivePhotoRatio(orientation: Orientation): number {
  const cardW = 100; // abstract unit, cancels out
  const cardH = cardW * getCardRatio(DEFAULT_GEOMETRY, orientation);

  const sideMargin = cardW * DEFAULT_GEOMETRY.sideMarginPct;
  const topMargin = sideMargin;
  const bottomMargin = sideMargin * DEFAULT_GEOMETRY.bottomMultiplier;

  const photoW = cardW - 2 * sideMargin;
  const photoH = cardH - topMargin - bottomMargin;

  return photoW / photoH;
}

// Given the actual rendered photo width in px, returns pixel margins to
// use when compositing the frame in createPolaroidImage.
export function getCardMarginsPx(
  geometry: PolaroidGeometry,
  photoWidthPx: number,
) {
  const side = Math.round(photoWidthPx * geometry.sideMarginPct);
  return {
    side,
    top: side,
    bottom: Math.round(side * geometry.bottomMultiplier),
  };
}
