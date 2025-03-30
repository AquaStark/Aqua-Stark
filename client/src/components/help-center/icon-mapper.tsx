import {
  Info,
  Gamepad2,
  Droplets,
  Heart,
  Fish,
  Waves,
  Sparkles,
  Utensils,
  Leaf,
  FishIcon as Shrimp,
  Thermometer,
  Lightbulb,
  Dna,
  Palette,
  Trophy,
} from "lucide-react";
import type { IconType } from "@/types/help-types";

export function getIcon(
  iconType: IconType,
  size: "small" | "regular" = "regular"
) {
  const className = size === "small" ? "h-5 w-5" : "h-6 w-6";

  switch (iconType) {
    case "info":
      return <Info className={className} />;
    case "gamepad":
      return <Gamepad2 className={className} />;
    case "droplets":
      return <Droplets className={className} />;
    case "heart":
      return <Heart className={className} />;
    case "fish":
      return <Fish className={className} />;
    case "waves":
      return <Waves className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "utensils":
      return <Utensils className={className} />;
    case "leaf":
      return <Leaf className={className} />;
    case "shrimp":
      return <Shrimp className={className} />;
    case "thermometer":
      return <Thermometer className={className} />;
    case "lightbulb":
      return <Lightbulb className={className} />;
    case "dna":
      return <Dna className={className} />;
    case "palette":
      return <Palette className={className} />;
    case "trophy":
      return <Trophy className={className} />;
    default:
      return <Info className={className} />;
  }
}
