import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TabButtonProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}

export function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-3 px-4 text-white font-bold transition-all duration-200",
        active
          ? "bg-blue-700 border-b-2 border-blue-300"
          : "bg-blue-600 hover:bg-blue-700/70"
      )}
    >
      {children}
    </button>
  );
}
