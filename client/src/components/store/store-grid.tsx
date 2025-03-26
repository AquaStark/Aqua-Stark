import StoreItem from "@/components/store-item";

interface StoreGridProps {
  items: {
    name: string;
    image: string;
    price: number;
    rarity: string;
  }[];
}

export function StoreGrid({ items }: StoreGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {items.map((item, index) => (
        <StoreItem
          key={index}
          name={item.name}
          image={item.image}
          price={item.price}
          rarity={item.rarity}
        />
      ))}
    </div>
  );
}
