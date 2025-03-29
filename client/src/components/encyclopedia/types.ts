export type Page = "Catalog" | "Habitats" | "Collection";
export type SortOption = "name-asc" | "name-desc" | "rarity" | "newest";

export interface FilterOptions {
  habitat: string[];
  diet: string[];
  temperament: string[];
  careLevel: string[];
}

export type FilterCategory = "habitat" | "diet" | "temperament" | "careLevel";
