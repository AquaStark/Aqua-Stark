"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Users, Image, MessageSquare, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; 
// ^ Asumiendo que tienes un sistema de Tabs como en trading-market.tsx

import { BubblesBackground } from "@/components/bubble-background";
import { useBubbles } from "@/hooks/useBubbles";

import CommunityGallery from "@/components/community/community-gallery";
import CommunityFriends from "@/components/community/community-friends";
import CommunityForum from "@/components/community/community-forum";
import CommunityEvents from "@/components/community/community-events";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("gallery");

  // Burbujas
  const bubbles = useBubbles({
    initialCount: 30,
    maxBubbles: 50,
    minSize: 10,
    maxSize: 40,
    minDuration: 15,
    maxDuration: 30,
    interval: 500,
  });

  return (
    <div className="relative min-h-screen bg-blue-600 overflow-hidden">
      {/* Fondo de burbujas */}
      <BubblesBackground
        bubbles={bubbles}
        className="opacity-50"
        customStyles={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* HEADER */}
      <header className="bg-blue-700 relative z-10">
        {/* Contenedor interno para alinear con la barra de tabs */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Izquierda: Back to Game + Título */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-blue-600 flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Game</span>
            </Button>
            <h1 className="text-2xl font-bold text-white">Aqua Stark Community</h1>
          </div>

          {/* Derecha: Buscador, My Friends */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search community..."
                className="pl-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-300"
              />
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            <Users className="w-4 h-4 mr-2" />
              My Friends
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-4 relative z-10">
        <Tabs
          defaultValue="gallery"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="w-full bg-blue-800 p-1 flex">
            <TabsTrigger
              value="gallery"
              className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
            >
              <Image className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
            >
              <Users className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger
              value="forum"
              className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Forum
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
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
      </div>
    </div>
  );
}