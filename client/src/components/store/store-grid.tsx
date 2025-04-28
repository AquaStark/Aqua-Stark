import StoreItem from "@/components/store/store-item"

interface StoreItemData {
  name: string
  image: string
  price: number
  rarity: string
  description?: string
  rating?: number
  originalPrice?: number
  isNew?: boolean
  stock?: number
  isLimited?: boolean
}

interface StoreGridProps {
  items: StoreItemData[]
}

export function StoreGrid({ items }: StoreGridProps) {
  // Asegurarse de que todos los items tengan los campos necesarios
  const processedItems = items.map((item) => ({
    ...item,
    description: item.description || "",
    rating: item.rating || 0,
  }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {processedItems.map((item, index) => (
        <StoreItem
          key={index}
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
