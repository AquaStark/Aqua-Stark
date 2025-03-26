import { TabButton } from "@/components/ui/tab-button";

interface StoreTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function StoreTabs({ activeTab, onTabChange }: StoreTabsProps) {
  return (
    <div className="flex">
      <TabButton active={activeTab === "fish"} onClick={() => onTabChange("fish")}>
        FISH
      </TabButton>
      <TabButton active={activeTab === "food"} onClick={() => onTabChange("food")}>
        FOOD
      </TabButton>
      <TabButton active={activeTab === "decorations"} onClick={() => onTabChange("decorations")}>
        DECORATIONS
      </TabButton>
      <TabButton active={activeTab === "others"} onClick={() => onTabChange("others")}>
        OTHERS
      </TabButton>
    </div>
  );
}
