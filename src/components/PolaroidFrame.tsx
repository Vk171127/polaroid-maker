interface PolaroidFrameProps {
  img: string;
}

const PolaroidFrame = ({ img }: PolaroidFrameProps) => {
  return (
    <img
      src={img}
      alt="Polaroid preview"
      className="w-40 rounded-sm shadow-lg shadow-plum/20"
    />
  );
};

export default PolaroidFrame;
