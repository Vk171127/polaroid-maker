interface ButtonProps {
  onClick: () => void;
  variant?: "primary" | "outline" | "danger" | "ghost";
  name: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button = ({
  onClick,
  variant = "primary",
  name,
  disabled,
  fullWidth,
}: ButtonProps) => {
  const variants: Record<string, string> = {
    primary:
      "bg-plum text-white hover:bg-plum-dark active:scale-[0.98] shadow-sm shadow-plum/20",
    outline:
      "bg-transparent text-plum border border-plum/30 hover:border-plum hover:bg-plum-light active:scale-[0.98]",
    danger: "bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98]",
    ghost: "bg-transparent text-plum hover:bg-plum-light active:scale-[0.98]",
  };

  return (
    <button
      className={`${fullWidth ? "w-full" : ""} rounded-full px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
