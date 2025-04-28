import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StoreTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function StoreTabs({ activeTab, onTabChange }: StoreTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 gap-2 p-1 bg-blue-700 rounded-lg">
        <TabsTrigger value="fish">Fish</TabsTrigger>
        <TabsTrigger value="food">Food</TabsTrigger>
        <TabsTrigger value="decorations">Decorations</TabsTrigger>
        <TabsTrigger value="others">Others</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
