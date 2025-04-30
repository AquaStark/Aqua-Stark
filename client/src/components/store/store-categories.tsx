import { CategoryButton } from "@/components/ui/category-button";
import { Percent } from "lucide-react";

interface StoreCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function StoreCategories({
  activeCategory,
  onCategoryChange,
}: StoreCategoriesProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      <CategoryButton
 feat/food-tab

        active={activeCategory === "all"}
        onClick={() => onCategoryChange("all")}
      >
        ALL
      </CategoryButton>
      <CategoryButton
 feat/food-tab
 main
        active={activeCategory === "specials"}
        onClick={() => onCategoryChange("specials")}

        active={activeCategory === "special"}
        onClick={() => onCategoryChange("special")}
 main
      >
        SPECIAL
      </CategoryButton>
      <CategoryButton
        active={activeCategory === "legendary"}
        onClick={() => onCategoryChange("legendary")}
      >
        LEGENDARY
      </CategoryButton>
      <CategoryButton
        active={activeCategory === "rare"}
        onClick={() => onCategoryChange("rare")}
      >
        RARE
      </CategoryButton>
      <CategoryButton
        active={activeCategory === "on-sale"}
        onClick={() => onCategoryChange("on-sale")}
      >
        <Percent size={14} className="mr-1" /> ON SALE
      </CategoryButton>
    </div>
  );
}
