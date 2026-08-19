interface PolaroidFrameProps {
  img: string;
}

const PolaroidFrame = ({ img }: PolaroidFrameProps) => {
  return <img src={img} alt="Polaroid preview" className="w-30" />;
};

export default PolaroidFrame;
