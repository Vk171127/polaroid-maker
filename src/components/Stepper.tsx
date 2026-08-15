import Button from "@/components/Button";
import CropImage from "@/components/CropImage";
import Uploader from "@/components/Uploader";
import { useEffect, useMemo, useState } from "react";

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
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

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

  const handleCropdone = (croppedImage: string) => {
    setCroppedImage(croppedImage);
    setIsCropping(false);
  };

  const handleClick = () => {
    if (selectedFiles.length !== requiredPhotoCount) {
      setError(`Please upload photos to proceed.`);
      return;
    }
    setStep("Preview");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files && e.target.files.length === requiredPhotoCount) {
      setSelectedFiles(Array.from(e.target.files));
      setError(null);
    } else {
      setError(`Please upload exactly ${requiredPhotoCount} photos.`);
      setSelectedFiles([]);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>step 1,2,3 -- placeholder</div>
      {step === "Upload" && (
        <div>
          <Uploader
            handleFileChange={handleFileChange}
            requiredPhotoCount={requiredPhotoCount}
          />
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
            <CropImage img={imageUrl || ""} onCropDone={handleCropdone} />
          ) : (
            <>
              <img
                src={croppedImage || imageUrl || ""}
                alt="Current preview"
                className="w-20"
              />

              <Button
                name="Crop / Adjust"
                onClick={() => setIsCropping(true)}
              />

              <div className="flex gap-4 items-center w-full">
                {thumbUrls.map((img, index) => {
                  return (
                    <button
                      onClick={() => setCurrentImgIndex(index)}
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
    </div>
  );
};

export default Stepper;
