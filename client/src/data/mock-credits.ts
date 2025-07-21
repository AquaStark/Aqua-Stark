export interface CreditSection {
  title: string;
  items: CreditItem[];
}

export interface CreditItem {
  role: string;
  name: string;
}

export const creditsData: CreditSection[] = [
  {
    title: "Aqua Stark Team",
    items: [
      { role: "Lead Developer", name: "Alex Rivera" },
      { role: "Game Designer", name: "Sofia Vargas" },
      { role: "Art Director", name: "Leo Chen" },
      { role: "Sound Engineer", name: "Mia Kim" }
    ]
  },
  {
    title: "Development",
    items: [
      { role: "Frontend", name: "Vercel AI" },
      { role: "Backend", name: "Vercel AI" },
      { role: "Game Logic", name: "Vercel AI" }
    ]
  },
  {
    title: "Art & Animation",
    items: [
      { role: "Character Design", name: "Studio Glimmer" },
      { role: "Environment Art", name: "Ocean Dreams" },
      { role: "UI/UX Design", name: "Pixel Flow" }
    ]
  },
  {
    title: "Music & Sound",
    items: [
      { role: "Original Score", name: "Melody Wave" }
    ]
  }
]; 