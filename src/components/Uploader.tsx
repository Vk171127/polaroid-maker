interface UploaderProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Uploader = ({ handleFileChange }: UploaderProps) => {
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
