import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function PageButton({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={cn(
        "w-8 h-8 rounded-full font-bold",
        active
          ? "bg-blue-400 text-white"
          : "bg-blue-700 text-white hover:bg-blue-600"
      )}
    >
      {children}
    </button>
  );
}

export function PaginationControls() {
  return (
    <div className="flex justify-between mt-6">
      <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg shadow-lg border-2 border-orange-400">
        <ChevronLeft size={24} />
      </button>
      <div className="flex items-center gap-2">
        <PageButton active>1</PageButton>
        <PageButton>2</PageButton>
        <PageButton>3</PageButton>
      </div>
      <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg shadow-lg border-2 border-orange-400">
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
