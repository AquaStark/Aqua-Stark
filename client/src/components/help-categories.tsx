"use client"

import { cn } from "@/lib/utils"
import type { Category } from "@/types/help-types"

interface HelpCategoriesProps {
  categories: Category[]
  activeCategory: string
  onCategoryClick: (categoryId: string) => void
}

export default function HelpCategories({ categories, activeCategory, onCategoryClick }: HelpCategoriesProps) {
  return (
    <div className="bg-blue-800/40 backdrop-blur-sm rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">Help Categories</h2>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "w-full text-left px-4 py-3 rounded-md transition-colors",
              activeCategory === category.id ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-blue-700 hover:text-white",
            )}
            onClick={() => onCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

