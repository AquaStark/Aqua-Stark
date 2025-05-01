import { CategoryButton } from "@/components/ui/category-button";

interface StoreCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function StoreCategories({
  activeCategory,
  onCategoryChange,
}: StoreCategoriesProps) {
  return (
    <div className="flex gap-2 pb-2 mb-6 overflow-x-auto">
      <CategoryButton
 feat/updated-food-tab
        active={activeCategory === "specials"}
        onClick={() => onCategoryChange("specials")}

        active={activeCategory === "all"}
        onClick={() => onCategoryChange("all")}
      >
        ALL
      </CategoryButton>
      <CategoryButton
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
 feat/updated-food-tab
        active={activeCategory === "carnivory"}
        onClick={() => onCategoryChange("carnivory")}
      >
        CARNIVOROUS

        active={activeCategory === "on-sale"}
        onClick={() => onCategoryChange("on-sale")}
      >
 feat/updated-food-tab
        <Percent size={14} className="mr-1" /> ON SALE
 main

        % ON SALE
 main
      </CategoryButton>
    </div>
  );
}
