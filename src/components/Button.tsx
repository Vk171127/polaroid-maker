interface ButtonProps {
  onClick: () => void;
  variant?: string;
  name: string;
  disabled?: boolean;
}

const Button = ({ onClick, variant, name, disabled }: ButtonProps) => {
  let classProp = "bg-pink-500 hover:bg-pink-700 text-white";
  if (variant == "primary") {
    classProp = "bg-pink-500 hover:bg-pink-700 text-white";
  } else if (variant == "danger") {
    classProp = "bg-red-500 hover:bg-red-700 text-white";
  } else if (variant == "outline") {
    classProp = "hover:bg-pink-500 text-pink-500 hover:text-white border";
  }
  return (
    <button
      className={`text-sm py-1 px-2 rounded hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${classProp}`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
