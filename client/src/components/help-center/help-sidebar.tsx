import type { Category, FeaturedTopic } from '@/types/help-types';
import { HelpCategories } from '@/components';
import { FeaturedTopics } from '@/components';

interface HelpCenterSidebarProps {
  categories: Category[];
  featuredTopics: FeaturedTopic[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
  onFeaturedTopicClick: (categoryId: string, topicId: string) => void;
}

export function HelpCenterSidebar({
  categories,
  featuredTopics,
  activeCategory,
  onCategoryClick,
  onFeaturedTopicClick,
}: HelpCenterSidebarProps) {
  return (
    <div className='w-64 flex-shrink-0 space-y-6'>
      <HelpCategories
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={onCategoryClick}
      />
      <FeaturedTopics
        topics={featuredTopics}
        onTopicClick={onFeaturedTopicClick}
      />
    </div>
  );
}
