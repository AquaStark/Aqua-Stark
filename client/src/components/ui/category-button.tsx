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
        "px-4 py-2 rounded-lg whitespace-nowrap shadow-md border",
        active
          ? "bg-blue-900 text-white border-blue-600"
          : "bg-blue-800 hover:bg-blue-900 text-white border-blue-700"
      )}
    >
      {children}
    </button>
  );
}
