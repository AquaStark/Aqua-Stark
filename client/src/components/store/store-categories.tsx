import { CategoryButton } from "@/components/ui/category-button";

interface StoreCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function StoreCategories({ activeCategory, onCategoryChange }: StoreCategoriesProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      <CategoryButton active={activeCategory === "specials"} onClick={() => onCategoryChange("specials")}>
        SPECIAL
      </CategoryButton>
      <CategoryButton active={activeCategory === "legendary"} onClick={() => onCategoryChange("legendary")}>
        LEGENDARY
      </CategoryButton>
      <CategoryButton active={activeCategory === "rare"} onClick={() => onCategoryChange("rare")}>
        RARE
      </CategoryButton>
      <CategoryButton active={activeCategory === "carnivory"} onClick={() => onCategoryChange("carnivory")}>
        CARNIVOROUS
      </CategoryButton>
    </div>
  );
}
