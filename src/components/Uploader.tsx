interface UploaderProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requiredPhotoCount: number;
}

const Uploader = ({ handleFileChange, requiredPhotoCount }: UploaderProps) => {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Uploader;
