import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CategoryButtonProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryButton({ children, active, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-200 flex items-center justify-center",
        active
          ? "bg-orange-500 text-white"
          : "bg-blue-700/60 hover:bg-blue-700 text-white"
      )}
    >
      {children}
    </button>
  );
}
