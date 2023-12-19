import type { ReactNode } from "react";

type RoundIconHoverProps = {
  children: ReactNode;
  classes?: string;
  noHover?: boolean;
} & ({
  red?: boolean;
  blue?: never;
  green?: never;
} | { 
  blue?: boolean;
  red?: never;
  green?: never;
} | { 
  green?: boolean;
  red?: never;
  blue?: never;
});

export function RoundIconHover({
  children,
  classes = "",
  red = false,
  blue = false,
  green = false,
  noHover = false,
}: RoundIconHoverProps) {
  let colorClasses = `outline-gray-400 group-focus-visible:bg-gray-200 focus-visible:bg-gray-200 ${noHover ? '': 'hover:bg-gray-200 group-hover-bg-gray-200'}`;
  if (red) {
    colorClasses = `outline-red-400 group-focus-visible:bg-red-200 focus-visible:bg-red-200 ${noHover ? '': 'hover:bg-red-200 group-hover-bg-red-200'}`;
  }
  if (blue) {
    colorClasses = `outline-blue-400 group-focus-visible:bg-blue-200 focus-visible:bg-blue-200 ${noHover ? '': 'hover:bg-blue-200 group-hover-bg-blue-200'}}`;
  }
  if (green) {
    colorClasses = `outline-green-400 group-focus-visible:bg-green-200 focus-visible:bg-green-200 ${noHover ? '': 'hover:bg-green-200 group-hover-bg-green-200'}}`;
  }

  return (
    <div
      className={`rounded-full transition-colors duration-200 ${colorClasses} ${classes}`}
    >
      {children}
    </div>
  );
}
