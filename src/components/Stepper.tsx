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
      const generatedImages = await Promise.all(
        selectedFiles.map(async (file) => {
          const originalImageUrl = URL.createObjectURL(file);

          try {
            // Create the default crop first.
            const croppedImage = await cropImageToAspect(
              originalImageUrl,
              derivePhotoRatio("portrait"),
            );

            // The Polaroid generator now receives the already-cropped image.
            const polaroidImage = await createPolaroidImage(croppedImage);

            // Store the default crop as well, because this is now
            // the actual image used inside the Polaroid.
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
    console.log(e.target.files);
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
    <div className="flex flex-col gap-4 h-full">
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
                  className={`flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors duration-500 ${
                    isCompletedOrActive
                      ? "bg-black text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`text-xs transition-colors duration-300 ${
                    isCompletedOrActive
                      ? "font-semibold text-black"
                      : "text-slate-400"
                  }`}
                >
                  {item}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={`h-px ${
                    steps.indexOf(step) > index ? "bg-black" : "bg-slate-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {step === "Upload" && (
        <div>
          <Uploader handleFileChange={handleFileChange} />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex gap-2 justify-center">
            <Button onClick={close} variant="outline" name="Close" />
            <Button onClick={handleClick} name="Proceed" />
          </div>
        </div>
      )}
      {step === "Preview" && (
        <div className="flex flex-col gap-4 h-full">
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
            <>
              <PolaroidFrame img={polaroidImages[currentImgIndex] || ""} />

              <Button
                name="Crop / Adjust"
                onClick={() => {
                  setIsCropping(true);
                  setError(null);
                }}
              />

              <div className="flex gap-4 items-center w-full">
                {thumbUrls.map((img, index) => {
                  return (
                    <button
                      onClick={() => {
                        setCurrentImgIndex(index);
                        setError(null);
                      }}
                      className="cursor-pointer"
                      key={index}
                    >
                      <img
                        src={img}
                        alt={`Selected file ${index + 1}`}
                        className="size-10"
                      />
                    </button>
                  );
                })}
              </div>
            </>
          )}
          <div className="flex gap-2 justify-center">
            <Button onClick={close} variant="outline" name="Close" />
            <Button onClick={handleClick} name="Proceed" />
          </div>
        </div>
      )}
      {step === "Order" && (
        <div className="flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-lg font-semibold">Your Order</h2>
          {printableSheet ? (
            <img
              src={printableSheet}
              alt="Printable sheet preview"
              className="w-60 border"
            />
          ) : (
            <div className="flex aspect-210/297 items-center justify-center rounded-md bg-slate-100 text-sm text-slate-400">
              Preparing sheet...
            </div>
          )}
          {orderId ? (
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-lg font-semibold">Order placed! 🎉</p>
              <p className="text-sm text-slate-500">Your order ID:</p>
              <p className="text-xl font-mono font-bold">{orderId}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-md border px-3 py-2 text-sm"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="rounded-md border px-3 py-2 text-sm"
              />
            </div>
          )}

          {submitError && (
            <p className="text-center text-sm text-red-500">{submitError}</p>
          )}

          <div className="flex justify-center gap-2">
            {orderId ? (
              <Button onClick={close} name="Finish" />
            ) : (
              <>
                <Button
                  onClick={() => setStep("Preview")}
                  variant="outline"
                  name="Back"
                  disabled={isSubmitting}
                />
                <Button
                  onClick={handlePlaceOrder}
                  name={isSubmitting ? "Placing order..." : "Place Order"}
                  disabled={isSubmitting || !printableSheet}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stepper;
