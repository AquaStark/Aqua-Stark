export type IconType =
  | "info"
  | "gamepad"
  | "droplets"
  | "heart"
  | "fish"
  | "waves"
  | "sparkles"
  | "utensils"
  | "leaf"
  | "shrimp"
  | "thermometer"
  | "lightbulb"
  | "dna"
  | "palette"
  | "trophy";

export interface ContentSection {
  type:
    | "paragraph"
    | "heading"
    | "list"
    | "tip"
    | "grid"
    | "image"
    | "divider"
    | "center";
  content: string;
  items?: string[];
  columns?: number;
  gridItems?: {
    title: string;
    description: string;
    icon?: IconType;
    bgColor?: string;
  }[];
  level?: number;
  bgColor?: string;
  iconType?: IconType;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  sections: ContentSection[];
}

export interface Category {
  id: string;
  name: string;
  topics: Topic[];
}

export interface FeaturedTopic {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  icon: IconType;
  bgColor: string;
}
