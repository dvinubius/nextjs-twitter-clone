import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  small?: boolean;
  variant?: "blue" | "black" | "transparent";
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button({
  small = false,
  variant = "blue",
  className = "",
  ...props
}: ButtonProps) {
  const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold";
  let colorClasses;
  switch (variant) {
    case "transparent":
      colorClasses = "bg-transparent hover:bg-gray-200 focus-visible:bg-gray-200 border border-gray-300 text-gray-800";
      break;
    case "black":
      colorClasses = "bg-black hover:bg-slate-800 focus-visible:bg-slate-800 text-white";
      break;
    case "blue":
     colorClasses = "bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400 text-white";
      break;
  } 
  return (
    <button
      className={`rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses} ${className}`}
      {...props}
    ></button>
  );
}
