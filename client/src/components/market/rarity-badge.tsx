import { cn } from "@/lib/utils"

interface RarityBadgeProps {
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  className?: string
}

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full",
        rarity === "Common"
          ? "bg-gray-500/50 text-gray-100"
          : rarity === "Uncommon"
            ? "bg-green-500/50 text-green-100"
            : rarity === "Rare"
              ? "bg-blue-500/50 text-blue-100"
              : rarity === "Epic"
                ? "bg-purple-500/50 text-purple-100"
                : "bg-amber-500/50 text-amber-100",
        className,
      )}
    >
      {rarity}
    </span>
  )
}

