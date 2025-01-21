import * as React from "react";
import { cn } from "@/lib/utils";

const SquareOption = React.forwardRef(
  ({ label, selected, onClick, className }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "cursor-pointer flex items-center justify-center  px-2 py-2 rounded-md text-sm font-medium transition-colors",
        selected ? "bg-primary text-white " : "bg-white text-primary ",
        "hover:bg-[#F0EBF1] ",
        className
      )}
    >
      {label}
    </div>
  )
);
SquareOption.displayName = "SquareOption";

export { SquareOption };
