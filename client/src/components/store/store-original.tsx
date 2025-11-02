'use client';

import { useState, useEffect } from 'react';
import { StoreCarousel } from './store-carousel';
import { StoreTabs } from './store-tabs';
import { StoreGrid } from './store-grid';
import { StoreSearchFilters } from './store-search-filters';
import { ItemType } from '@/data/mock-game';
import { ENV_CONFIG } from '@/config/environment';

/**
 * Store Original Component
 * The original store design with mock data and original components
 *
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */
export function StoreOriginal() {
  const [selectedTab, setSelectedTab] = useState<ItemType>('fish');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<
    'all' | 'Rare' | 'Legendary' | 'Special'
  >('all');
  const [sortOption, setSortOption] = useState<
    'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
  >('price-asc');
  const [backendItems, setBackendItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${ENV_CONFIG.API_URL}/v1/store/items`);
        const data = await response.json();

        if (data.success && data.data) {
          // Transform backend data to match StoreGrid format
          const transformedItems = data.data.map((item: any) => {
            // Use the image_url from backend (Supabase Storage)
            const imageUrl = item.image_url;

            return {
              id: item.id,
              name: item.name,
              image: imageUrl,
              price: item.price,
              rarity:
                item.type === 'fish'
                  ? 'Rare'
                  : item.type === 'decoration'
                    ? 'Legendary'
                    : 'Special',
              description: item.description,
              rating: 4.5,
              stock: item.stock,
              category: item.type,
            };
          });
          setBackendItems(transformedItems);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on selected tab and search
  const filteredItems = backendItems
    .filter(item => {
      // Filter by tab
      if (selectedTab === 'fish' && item.category !== 'fish') return false;
      if (selectedTab === 'food' && item.category !== 'food') return false;
      if (selectedTab === 'decorations' && item.category !== 'decoration')
        return false;
      if (selectedTab === 'others' && item.category !== 'other') return false;

      // Filter by search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
          !item.name.toLowerCase().includes(query) &&
          !item.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Filter by rarity
      if (selectedRarity !== 'all' && item.rarity !== selectedRarity) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className='space-y-3 sm:space-y-4 md:space-y-6'>
      {/* Store Carousel */}
      <StoreCarousel />

      {/* Store Tabs */}
      <StoreTabs activeTab={selectedTab} onTabChange={setSelectedTab} />

      {/* Search and Filters */}
      <StoreSearchFilters
        rarityOptions={[
          { value: 'all', label: 'All Rarities' },
          { value: 'Rare', label: 'Rare' },
          { value: 'Legendary', label: 'Legendary' },
          { value: 'Special', label: 'Special' },
        ]}
        sortOptions={[
          { value: 'price-asc', label: 'Price: Low to High' },
          { value: 'price-desc', label: 'Price: High to Low' },
          { value: 'name-asc', label: 'Name: A to Z' },
          { value: 'name-desc', label: 'Name: Z to A' },
        ]}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRarity={selectedRarity}
        setSelectedRarity={setSelectedRarity}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Store Grid */}
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='text-white'>Loading items...</div>
        </div>
      ) : (
        <StoreGrid items={filteredItems} />
      )}
    </div>
  );
}

export default StoreOriginal;
