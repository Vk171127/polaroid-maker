interface ButtonProps { onClick: () => void; variant?: string; name: string; disabled?: boolean; }
const Button = ({ onClick, variant, name, disabled }: ButtonProps) => {
  const classProp = variant === "outline" ? "border border-violet/30 bg-paper text-plum hover:bg-lavender" : variant === "danger" ? "bg-plum text-paper hover:bg-violet" : "bg-violet text-paper hover:bg-plum";
  return <button className={`rounded-full px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${classProp}`} onClick={onClick} disabled={disabled}>{name}</button>;
};
export default Button;
