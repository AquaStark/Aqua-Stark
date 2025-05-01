import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface SortOption {
  label: string;
  field: string;
  direction: string;
}

interface SortState {
  field: string;
  direction: string;
}

interface SortDropdownProps {
  sort: SortState;
  updateSort: (field: string, direction: string) => void;
  onClose: () => void;
}

export function SortDropdown({ sort, updateSort, onClose }: SortDropdownProps) {
  const sortOptions: SortOption[] = [
    { label: "Price: Low to High", field: "price", direction: "asc" },
    { label: "Price: High to Low", field: "price", direction: "desc" },
    { label: "Popularity", field: "popularity", direction: "desc" },
    { label: "Newest", field: "newest", direction: "desc" },
  ];

  const handleSort = (field: string, direction: string) => {
    updateSort(field, direction);
    onClose();
  };

  const isActive = (option: SortOption) => {
    return sort.field === option.field && sort.direction === option.direction;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute z-20 right-0 mt-2 w-56 bg-blue-600 rounded-lg shadow-lg overflow-hidden"
      style={{ top: "100%" }}
    >
      <div className="py-2">
        {sortOptions.map((option) => (
          <button
            key={`${option.field}-${option.direction}`}
            className="flex items-center w-full text-left px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => handleSort(option.field, option.direction)}
          >
            <span>{option.label}</span>
            {isActive(option) && <CheckCircle size={16} className="ml-auto text-white" />}
          </button>
        ))}
      </div>
    </motion.div>
  );
}