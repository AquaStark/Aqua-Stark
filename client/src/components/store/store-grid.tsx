import StoreItem from "@/components/store/store-item"

interface StoreItemData {
  id?: string;
  name: string;
  image: string;
  price: number;
  rarity: string;
  description?: string;
  rating?: number;
  originalPrice?: number;
  isNew?: boolean;
  stock?: number;
  isLimited?: boolean;
  category?: string;
}

interface StoreGridProps {
  items: StoreItemData[]
}

export function StoreGrid({ items }: StoreGridProps) {
  // Ensure all items have the required fields
  const processedItems = items.map((item) => ({
    ...item,
    description: item.description || "",
    rating: item.rating || 0,
    id: item.id || `item-${item.name.toLowerCase().replace(/\s+/g, '-')}`
  }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {processedItems.map((item) => (
        <StoreItem
          key={item.id}
          id={item.id}
          name={item.name}
          image={item.image}
          price={item.price}
          rarity={item.rarity}
          description={item.description}
          rating={item.rating}
          originalPrice={item.originalPrice}
          isNew={item.isNew}
          stock={item.stock}
          isLimited={item.isLimited}
        />
      ))}
    </div>
  )
}
