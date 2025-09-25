import { CategoryButton } from '@/components/ui/category-button';

interface StoreCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function StoreCategories({
  activeCategory,
  onCategoryChange,
}: StoreCategoriesProps) {
  return (
    <div className='flex gap-2 pb-2 mb-6 overflow-x-auto'>
      <CategoryButton
        active={activeCategory === 'all'}
        onClick={() => onCategoryChange('all')}
      >
        ALL
      </CategoryButton>
      <CategoryButton
        active={activeCategory === 'special'}
        onClick={() => onCategoryChange('special')}
      >
        SPECIAL
      </CategoryButton>
      <CategoryButton
        active={activeCategory === 'legendary'}
        onClick={() => onCategoryChange('legendary')}
      >
        LEGENDARY
      </CategoryButton>
      <CategoryButton
        active={activeCategory === 'rare'}
        onClick={() => onCategoryChange('rare')}
      >
        RARE
      </CategoryButton>
      <CategoryButton
        active={activeCategory === 'on-sale'}
        onClick={() => onCategoryChange('on-sale')}
      >
        % ON SALE
      </CategoryButton>
    </div>
  );
}
