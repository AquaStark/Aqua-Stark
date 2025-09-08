import { useState } from 'react';
import { categories } from '@/data/help-center-data';

export function useHelpCenter() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveTopic(null);
  };

  const handleTopicClick = (topicId: string) => {
    setActiveTopic(topicId === activeTopic ? null : topicId);
  };

  const handleFeaturedTopicClick = (categoryId: string, topicId: string) => {
    setActiveCategory(categoryId);
    setActiveTopic(topicId);
  };

  const handleClose = () => {
    setActiveTopic(null);
  };

  const currentCategory = categories.find(cat => cat.id === activeCategory);
  const currentTopic = currentCategory?.topics.find(
    topic => topic.id === activeTopic
  );

  return {
    activeCategory,
    activeTopic,
    searchQuery,
    currentCategory,
    currentTopic,
    setSearchQuery,
    handleCategoryClick,
    handleTopicClick,
    handleFeaturedTopicClick,
    handleClose,
  };
}
