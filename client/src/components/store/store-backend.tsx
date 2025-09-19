'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, RefreshCw, ShoppingCart, Star, Heart, Plus } from 'lucide-react';
import { useStoreItems, StoreItem, StoreItemType } from '@/hooks/use-store-items';
import { useCartStore } from '@/store/use-cart-store';
import { FishTank } from '@/components/fish-tank';

/**
 * Store Backend Component
 * Displays store items fetched from the backend API
 * 
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */
export function StoreBackend() {
  const {
    items,
    stats,
    loading,
    error,
    isInitialized,
    fetchStoreItems,
    getItemsByType,
    searchItems,
    filterItemsByPrice,
    getAvailableItems,
    getItemsSortedByPrice,
    getItemsSortedByName,
    refreshItems,
  } = useStoreItems();

  const { addItem } = useCartStore();

  // Local state for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<StoreItemType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // Process items based on filters
  const filteredItems = useMemo(() => {
    if (!isInitialized || !Array.isArray(items)) {
      return [];
    }
    
    let processedItems = [...items];

    // Filter by type
    if (selectedType !== 'all') {
      processedItems = getItemsByType(selectedType);
    }

    // Search filter
    if (searchQuery.trim()) {
      processedItems = searchItems(searchQuery);
    }

    // Price range filter
    processedItems = filterItemsByPrice(priceRange[0], priceRange[1]);

    // Sort items
    switch (sortBy) {
      case 'price':
        processedItems = getItemsSortedByPrice(true);
        break;
      case 'name':
        processedItems = getItemsSortedByName(true);
        break;
      case 'date':
        processedItems = [...processedItems].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return processedItems;
  }, [items, selectedType, searchQuery, priceRange, sortBy, isInitialized, getItemsByType, searchItems, filterItemsByPrice, getItemsSortedByPrice, getItemsSortedByName]);

  const handleAddToCart = (item: StoreItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      image: item.image_url,
      price: item.price,
      rarity: item.type,
      description: item.description,
    };
    addItem(cartItem);
  };

  const getRarityColor = (type: StoreItemType) => {
    switch (type) {
      case 'fish':
        return 'bg-blue-500';
      case 'decoration':
        return 'bg-green-500';
      case 'food':
        return 'bg-yellow-500';
      case 'other':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: StoreItemType) => {
    switch (type) {
      case 'fish':
        return '🐟';
      case 'decoration':
        return '🏠';
      case 'food':
        return '🍎';
      case 'other':
        return '🔧';
      default:
        return '📦';
    }
  };

  if (loading && !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-white">Loading store items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading store items: {error.message}</p>
          <Button onClick={refreshItems} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">🏪 Aqua Stark Store</h1>
        <p className="text-blue-200">Discover amazing fish, decorations, and more!</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-600/20 border-blue-400">
            <div className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.totalItems}</p>
                <p className="text-blue-200 text-sm">Total Items</p>
              </div>
            </div>
          </Card>
          <Card className="bg-green-600/20 border-green-400">
            <div className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.activeItems}</p>
                <p className="text-green-200 text-sm">Available</p>
              </div>
            </div>
          </Card>
          <Card className="bg-yellow-600/20 border-yellow-400">
            <div className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.lowStockItems}</p>
                <p className="text-yellow-200 text-sm">Low Stock</p>
              </div>
            </div>
          </Card>
          <Card className="bg-purple-600/20 border-purple-400">
            <div className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">${stats.totalValue.toFixed(2)}</p>
                <p className="text-purple-200 text-sm">Total Value</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="bg-blue-600/20 border-blue-400">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-blue-700/50 border-blue-500 text-white placeholder-blue-300"
                />
              </div>
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as StoreItemType | 'all')}>
              <SelectTrigger className="w-full md:w-48 bg-blue-700/50 border-blue-500 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fish">🐟 Fish</SelectItem>
                <SelectItem value="decoration">🏠 Decorations</SelectItem>
                <SelectItem value="food">🍎 Food</SelectItem>
                <SelectItem value="other">🔧 Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'price' | 'date')}>
              <SelectTrigger className="w-full md:w-48 bg-blue-700/50 border-blue-500 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="date">Newest</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              onClick={refreshItems}
              variant="outline"
              className="bg-blue-700/50 border-blue-500 text-white hover:bg-blue-600"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-blue-200">
          Showing {filteredItems.length} of {isInitialized ? items.length : 0} items
        </p>
        {loading && (
          <div className="flex items-center text-blue-300">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            Updating...
          </div>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-blue-300 text-lg">No items found matching your criteria</p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setPriceRange([0, 1000]);
            }}
            variant="outline"
            className="mt-4 bg-blue-700/50 border-blue-500 text-white hover:bg-blue-600"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-blue-600 rounded-3xl overflow-hidden shadow-xl border-2 border-blue-400 transform hover:scale-105 transition-all duration-200"
            >
              <div className="relative">
                {/* Type Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge className={`${getRarityColor(item.type)} text-white`}>
                    {getTypeIcon(item.type)} {item.type}
                  </Badge>
                </div>

                {/* Stock Indicator */}
                {item.stock <= 5 && item.stock > 0 && (
                  <div className="absolute top-3 right-3 z-10 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                    {item.stock} LEFT
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {item.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                      OUT OF STOCK
                    </Badge>
                  </div>
                )}

                {/* Item Image */}
                <div className="relative mx-auto w-full h-56 bg-blue-400/50 flex items-center justify-center overflow-hidden">
                  <FishTank>
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={item.image_url || '/placeholder.svg'}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="object-contain transition-all duration-500 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    />
                  </FishTank>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white uppercase mb-2">{item.name}</h3>
                <p className="text-sm text-blue-100 mb-3 min-h-[40px] line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src="/icons/coin.png" alt="Coins" className="w-5 h-5 mr-1" />
                    <span className="text-white font-bold text-xl">{item.price}</span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock === 0}
                    className={`font-bold rounded-lg px-4 py-2 border-2 transition-all ${
                      item.stock === 0
                        ? 'bg-gray-500 border-gray-400 text-white cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 border-orange-400 text-white'
                    }`}
                  >
                    {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreBackend;
