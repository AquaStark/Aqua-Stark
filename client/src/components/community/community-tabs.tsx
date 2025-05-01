"use client";

import { CalendarDays, Image, MessageSquare, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CommunityGallery from "./community-gallery";
import CommunityFriends from "./community-friends";
import CommunityForum from "./community-forum";
import CommunityEvents from "./community-events";

interface CommunityTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function CommunityTabs({ activeTab, setActiveTab }: CommunityTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      defaultValue="gallery"
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1 bg-blue-700 rounded-lg mb-6">
        <TabsTrigger
          value="gallery"
          className="flex items-center gap-1 text-xs md:text-sm"
        >
          <Image className="w-4 h-4" />
          Gallery
        </TabsTrigger>
        <TabsTrigger
          value="friends"
          className="flex items-center gap-1 text-xs md:text-sm"
        >
          <Users className="w-4 h-4" />
          Friends
        </TabsTrigger>
        <TabsTrigger
          value="forum"
          className="flex items-center gap-1 text-xs md:text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          Forum
        </TabsTrigger>
        <TabsTrigger
          value="events"
          className="flex items-center gap-1 text-xs md:text-sm"
        >
          <CalendarDays className="w-4 h-4" />
          Events
        </TabsTrigger>
      </TabsList>

      <TabsContent value="gallery">
        <CommunityGallery />
      </TabsContent>
      <TabsContent value="friends">
        <CommunityFriends />
      </TabsContent>
      <TabsContent value="forum">
        <CommunityForum />
      </TabsContent>
      <TabsContent value="events">
        <CommunityEvents />
      </TabsContent>
    </Tabs>
  );
}
