import Button from "@/components/Button";
import CropImage from "@/components/CropImage";
import PolaroidFrame from "@/components/PolaroidFrame";
import Uploader from "@/components/Uploader";
import { composeA6Sheet } from "@/lib/composeA6Sheet";
import { createPolaroidImage } from "@/lib/createPolaroidImage";
import { cropImageToAspect } from "@/lib/cropImageToAspect";
import { derivePhotoRatio } from "@/lib/polaroidGeometry";
import { sendOrder } from "@/lib/sendOrder";
import { useEffect, useMemo, useState } from "react";
import type { Point } from "react-easy-crop";

interface CropState {
  crop: Point;
  zoom: number;
  orientation: "portrait" | "landscape";
}

type Step = "Upload" | "Preview" | "Order";

interface StepperProps {
  requiredPhotoCount: number;
  close: () => void;
}

const Stepper = ({ requiredPhotoCount, close }: StepperProps) => {
  const [step, setStep] = useState<Step>("Upload");
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [_croppedImages, setCroppedImages] = useState<(string | null)[]>([]);
  const [cropStates, setCropStates] = useState<CropState[]>([]);
  const [polaroidImages, setPolaroidImages] = useState<(string | null)[]>([]);
  const [printableSheet, setPrintableSheet] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isGeneratingPreviews, setIsGeneratingPreviews] = useState(false);
  const steps: Step[] = ["Upload", "Preview", "Order"];

  useEffect(() => {
    const file = selectedFiles[currentImgIndex];
    if (!file) {
      setImageUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFiles, currentImgIndex]);

  const thumbUrls = useMemo(
    () => selectedFiles.map((file) => URL.createObjectURL(file)),
    [selectedFiles],
  );

  useEffect(() => {
    return () => thumbUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [thumbUrls]);

  useEffect(() => {
    if (selectedFiles.length === 0) {
      return;
    }

    let cancelled = false;

    const generatePolaroids = async () => {
      setIsGeneratingPreviews(true);

      try {
        const generatedImages = await Promise.all(
          selectedFiles.map(async (file) => {
            const originalImageUrl = URL.createObjectURL(file);

            try {
              const croppedImage = await cropImageToAspect(
                originalImageUrl,
                derivePhotoRatio("portrait"),
              );

              const polaroidImage = await createPolaroidImage(croppedImage);

              return {
                croppedImage,
                polaroidImage,
              };
            } finally {
              URL.revokeObjectURL(originalImageUrl);
            }
          }),
        );

        if (cancelled) {
          generatedImages.forEach(({ croppedImage, polaroidImage }) => {
            URL.revokeObjectURL(croppedImage);
            URL.revokeObjectURL(polaroidImage);
          });
          return;
        }

        setCroppedImages(generatedImages.map((item) => item.croppedImage));
        setPolaroidImages(generatedImages.map((item) => item.polaroidImage));
      } finally {
        if (!cancelled) {
          setIsGeneratingPreviews(false);
        }
      }
    };

    generatePolaroids();

    return () => {
      cancelled = true;
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (step !== "Order") return;
    if (polaroidImages.length === 0 || polaroidImages.some((img) => !img)) {
      return;
    }

    let cancelled = false;

    const generateSheet = async () => {
      const cards = polaroidImages.map((url, index) => ({
        url: url as string,
        orientation: cropStates[index]?.orientation || "portrait",
      }));

      const sheetUrl = await composeA6Sheet(cards);

      if (cancelled) {
        URL.revokeObjectURL(sheetUrl);
        return;
      }

      setPrintableSheet((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return sheetUrl;
      });
    };

    generateSheet();

    return () => {
      cancelled = true;
    };
  }, [step, polaroidImages, cropStates]);

  const handleCropdone = async (croppedImage: string) => {
    setCroppedImages((prev) => {
      const updated = [...prev];
      updated[currentImgIndex] = croppedImage;
      return updated;
    });

    const polaroidImage = await createPolaroidImage(croppedImage);

    setPolaroidImages((prev) => {
      const updated = [...prev];
      const oldPolaroid = updated[currentImgIndex];

      if (oldPolaroid) {
        URL.revokeObjectURL(oldPolaroid);
      }
      updated[currentImgIndex] = polaroidImage;
      return updated;
    });

    setIsCropping(false);
  };

  const handlePlaceOrder = async () => {
    if (!printableSheet) return;

    if (!name.trim() || !phoneNumber.trim()) {
      setSubmitError("Please enter your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const idRes = await fetch("/api/next-order-id", { method: "POST" });
      if (!idRes.ok) throw new Error("Failed to generate order ID");
      const { orderId: newOrderId } = await idRes.json();

      await sendOrder({
        orderId: newOrderId,
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        printableSheetUrl: printableSheet,
      });

      setOrderId(newOrderId);
    } catch (err) {
      setSubmitError("Something went wrong — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = () => {
    if (step === "Upload") {
      if (selectedFiles.length !== requiredPhotoCount) {
        setError(`Please upload photos to proceed.`);
        return;
      }

      setStep("Preview");
      return;
    }

    if (step === "Preview") {
      setStep("Order");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === requiredPhotoCount) {
      const files = Array.from(e.target.files);

      setSelectedFiles(files);
      setCroppedImages(new Array(files.length).fill(null));
      setPolaroidImages(new Array(files.length).fill(null));
      setCropStates(
        new Array(files.length).fill(null).map(() => ({
          crop: { x: 0, y: 0 },
          zoom: 1,
          orientation: "portrait",
        })),
      );
      setError(null);
    } else {
      setError(`Please upload exactly ${requiredPhotoCount} photos.`);
      setSelectedFiles([]);
      setCroppedImages([]);
      setPolaroidImages([]);
      setCropStates([]);
    }
  };

  const handleCropChange = (crop: Point) => {
    setCropStates((prev) => {
      const updated = [...prev];
      updated[currentImgIndex] = {
        ...updated[currentImgIndex],
        crop,
      };
      return updated;
    });
  };

  const handleZoomChange = (zoom: number) => {
    setCropStates((prev) => {
      const updated = [...prev];
      updated[currentImgIndex] = {
        ...updated[currentImgIndex],
        zoom,
      };
      return updated;
    });
  };

  const handleOrientationChange = (orientation: "portrait" | "landscape") => {
    setCropStates((prev) => {
      const updated = [...prev];

      updated[currentImgIndex] = {
        ...updated[currentImgIndex],
        orientation,
      };

      return updated;
    });
  };

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Step indicator */}
      <div className="grid w-full grid-cols-5 items-center">
        {steps.map((item, index) => {
          const currentStepIndex = steps.indexOf(step);
          const isCompletedOrActive = index <= currentStepIndex;

          return (
            <div key={item} className="contents">
              {/* Step */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                    isCompletedOrActive
                      ? "bg-plum text-white"
                      : "bg-plum-light text-plum/40"
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`text-[11px] transition-colors duration-300 ${
                    isCompletedOrActive
                      ? "font-semibold text-plum"
                      : "text-ink/30"
                  }`}
                >
                  {item}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={`h-px transition-colors duration-300 ${
                    steps.indexOf(step) > index ? "bg-plum" : "bg-line"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {step === "Upload" && (
        <div className="flex flex-1 flex-col gap-4">
          <Uploader
            handleFileChange={handleFileChange}
            requiredPhotoCount={requiredPhotoCount}
            selectedCount={selectedFiles.length}
            isProcessing={isGeneratingPreviews}
          />
          {error && (
            <p className="text-center text-sm font-medium text-rose-600">
              {error}
            </p>
          )}
          <div className="mt-auto flex gap-2 pt-2">
            <Button onClick={close} variant="outline" name="Close" />
            <div className="flex-1">
              <Button
                onClick={handleClick}
                name={
                  isGeneratingPreviews ? "Preparing your photos..." : "Continue"
                }
                disabled={isGeneratingPreviews}
                fullWidth
              />
            </div>
          </div>
        </div>
      )}
      {step === "Preview" && (
        <div className="flex h-full flex-1 flex-col gap-4">
          {isCropping ? (
            <CropImage
              img={imageUrl || ""}
              crop={cropStates[currentImgIndex].crop}
              zoom={cropStates[currentImgIndex].zoom}
              orientation={
                cropStates[currentImgIndex].orientation || "portrait"
              }
              onCropChange={handleCropChange}
              onZoomChange={handleZoomChange}
              onOrientationChange={handleOrientationChange}
              onCropDone={handleCropdone}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center gap-4">
              <div className="flex flex-1 items-center justify-center py-2">
                <PolaroidFrame img={polaroidImages[currentImgIndex] || ""} />
              </div>

              <button
                onClick={() => {
                  setIsCropping(true);
                  setError(null);
                }}
                className="flex items-center gap-1.5 text-sm font-semibold text-plum"
              >
                <span aria-hidden>✂️</span> Crop &amp; adjust
              </button>

              {thumbUrls.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {thumbUrls.map((img, index) => (
                    <button
                      onClick={() => {
                        setCurrentImgIndex(index);
                        setError(null);
                      }}
                      key={index}
                      className={`overflow-hidden rounded-lg border-2 transition-colors ${
                        index === currentImgIndex
                          ? "border-plum"
                          : "border-transparent opacity-60"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Selected file ${index + 1}`}
                        className="size-11 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {!isCropping && (
            <div className="flex gap-2 pt-2">
              <Button onClick={close} variant="outline" name="Close" />
              <div className="flex-1">
                <Button onClick={handleClick} name="Continue" fullWidth />
              </div>
            </div>
          )}
        </div>
      )}
      {step === "Order" && (
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
          {orderId ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-sunlight-light text-2xl">
                🎉
              </div>
              <p className="text-lg font-semibold text-ink">Order placed!</p>
              <p className="text-sm text-ink/50">Show this ID at the counter</p>
              <p className="rounded-xl bg-plum-light px-4 py-2 font-mono text-xl font-bold tracking-wide text-plum">
                {orderId}
              </p>
              <div className="w-full pt-4">
                <Button onClick={close} name="Done" fullWidth />
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-center text-lg font-semibold text-ink">
                  Almost there
                </h2>
                <p className="text-center text-xs text-ink/50">
                  Review your sheet and share your details
                </p>
              </div>

              <div className="flex justify-center">
                {printableSheet ? (
                  <img
                    src={printableSheet}
                    alt="Printable sheet preview"
                    className="w-48 rounded-lg border border-line shadow-sm"
                  />
                ) : (
                  <div className="flex aspect-210/297 w-48 items-center justify-center rounded-lg bg-plum-light text-xs text-plum/50">
                    Preparing sheet...
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-plum focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-plum focus:outline-none"
                />
              </div>

              {submitError && (
                <p className="text-center text-sm font-medium text-rose-600">
                  {submitError}
                </p>
              )}

              <div className="mt-auto flex gap-2 pt-2">
                <Button
                  onClick={() => setStep("Preview")}
                  variant="outline"
                  name="Back"
                  disabled={isSubmitting}
                />
                <div className="flex-1">
                  <Button
                    onClick={handlePlaceOrder}
                    name={isSubmitting ? "Placing order..." : "Place order"}
                    disabled={isSubmitting || !printableSheet}
                    fullWidth
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Stepper;
