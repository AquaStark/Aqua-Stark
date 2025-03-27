"use client"

import { ShoppingBag, Brush, Tag, Clock } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <Tabs defaultValue="browse" value={activeTab} onValueChange={onTabChange} className="mb-6">
      <TabsList className="w-full bg-blue-800 p-1">
        <TabsTrigger
          value="browse"
          className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Browse Market
        </TabsTrigger>
        <TabsTrigger
          value="auctions"
          className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
        >
          <Brush className="w-5 h-5 mr-2" />
          Auctions
        </TabsTrigger>
        <TabsTrigger
          value="listings"
          className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
        >
          <Tag className="w-5 h-5 mr-2" />
          My Listings
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
        >
          <Clock className="w-5 h-5 mr-2" />
          History
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

