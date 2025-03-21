import type { ReactNode } from "react";

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
    icon?: ReactNode;
    bgColor?: string;
  }[];
  level?: number;
  bgColor?: string;
  iconType?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
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
  icon: ReactNode;
  bgColor: string;
}
