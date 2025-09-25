import { useState } from 'react';
import { categories } from '@/constants';

/**
 * Hook to manage state and interactions for the Help Center.
 * Provides handlers for categories, topics, search, and navigation.
 *
 * @example
 * ```tsx
 * const {
 *   activeCategory,
 *   activeTopic,
 *   searchQuery,
 *   currentCategory,
 *   currentTopic,
 *   setSearchQuery,
 *   handleCategoryClick,
 *   handleTopicClick,
 *   handleFeaturedTopicClick,
 *   handleClose,
 * } = useHelpCenter();
 *
 * // Change category
 * handleCategoryClick('faq');
 *
 * // Toggle topic
 * handleTopicClick('topic-1');
 *
 * // Search query
 * setSearchQuery('billing');
 * ```
 *
 * @returns {{
 *   activeCategory: string;
 *   activeTopic: string | null;
 *   searchQuery: string;
 *   currentCategory: typeof categories[number] | undefined;
 *   currentTopic: typeof categories[number]['topics'][number] | undefined;
 *   setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
 *   handleCategoryClick: (categoryId: string) => void;
 *   handleTopicClick: (topicId: string) => void;
 *   handleFeaturedTopicClick: (categoryId: string, topicId: string) => void;
 *   handleClose: () => void;
 * }} Hook API for managing Help Center state and actions.
 */
export function useHelpCenter() {
  /** Currently active category ID */
  const [activeCategory, setActiveCategory] = useState('getting-started');

  /** Currently active topic ID */
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  /** Current search query */
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Sets a category as active and resets the active topic.
   * @param {string} categoryId - The category ID to activate.
   */
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveTopic(null);
  };

  /**
   * Toggles a topic as active or closes it if already active.
   * @param {string} topicId - The topic ID to activate or deactivate.
   */
  const handleTopicClick = (topicId: string) => {
    setActiveTopic(topicId === activeTopic ? null : topicId);
  };

  /**
   * Activates a featured topic by category and topic ID.
   * @param {string} categoryId - The category ID to activate.
   * @param {string} topicId - The topic ID to activate.
   */
  const handleFeaturedTopicClick = (categoryId: string, topicId: string) => {
    setActiveCategory(categoryId);
    setActiveTopic(topicId);
  };

  /**
   * Closes the currently active topic.
   */
  const handleClose = () => {
    setActiveTopic(null);
  };

  /** The currently active category object */
  const currentCategory = categories.find(cat => cat.id === activeCategory);

  /** The currently active topic object */
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
