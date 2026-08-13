import Button from "@/components/Button";
import Uploader from "@/components/Uploader";
import { useState } from "react";

type Step = "Upload" | "Preview" | "Order";

interface StepperProps {
  requiredPhotoCount: number;
  close: () => void;
}

const Stepper = ({ requiredPhotoCount, close }: StepperProps) => {
  const [step, setStep] = useState<Step>("Upload");
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    <div>
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
    </div>
  );
};

export default Stepper;
