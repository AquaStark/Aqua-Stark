"use client";

import { Calendar, Star, Target, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Achievements } from "./achievements";
import { Missions } from "./missions";
import { LoginRewards } from "./login-rewards";
import { Milestones } from "./milestones";
import { mockGameMilestones, mockLoginRewards } from "@/data/mock-data";

interface AchievementsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function AchievementsTabs({
  activeTab,
  setActiveTab,
}: AchievementsTabsProps) {
  const tabs = [
    { id: "achievements", name: "Achievements", icon: Trophy },
    { id: "missions", name: "Missions", icon: Target },
    { id: "login_rewards", name: "Login Rewards", icon: Calendar },
    { id: "milestones", name: "Milestones", icon: Star },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1 bg-blue-700 rounded-lg mb-6">
        {tabs.map(({ id, name, icon: Icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            className="flex items-center gap-1 text-xs md:text-sm"
          >
            <Icon size={14} />
            {name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="achievements">
        <Achievements />
      </TabsContent>
      <TabsContent value="missions">
        <Missions />
      </TabsContent>
      <TabsContent value="login_rewards">
        <LoginRewards data={mockLoginRewards} />
      </TabsContent>
      <TabsContent value="milestones">
        <Milestones data={mockGameMilestones} />
      </TabsContent>
    </Tabs>
  );
}
