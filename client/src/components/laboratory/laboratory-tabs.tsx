'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Dna, Sparkles, FileText } from 'lucide-react';
import { BreedingTab } from '@/components/laboratory/tabs/breeding-tab';
import { GeneticsTab } from '@/components/laboratory/tabs/genetics-tab';
import { DiscoveriesTab } from '@/components/laboratory/tabs/discoveries-tab';
import { GenealogyTab } from '@/components/laboratory/tabs/genealogy-tab';
import type { Fish } from '@/types/fish';

interface LaboratoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredFish: Fish[];
}

export function LaboratoryTabs({
  activeTab,
  setActiveTab,
  filteredFish,
}: LaboratoryTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
      <TabsList className='grid grid-cols-4 mb-6 bg-blue-800/50 border border-blue-700/50'>
        <TabsTrigger
          value='breeding'
          className='data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200'
        >
          <Heart className='h-4 w-4 mr-2 md:mr-1' />
          <span className='hidden md:inline'>Breeding</span>
        </TabsTrigger>
        <TabsTrigger
          value='genetics'
          className='data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200'
        >
          <Dna className='h-4 w-4 mr-2 md:mr-1' />
          <span className='hidden md:inline'>Genetics</span>
        </TabsTrigger>
        <TabsTrigger
          value='discoveries'
          className='data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200'
        >
          <Sparkles className='h-4 w-4 mr-2 md:mr-1' />
          <span className='hidden md:inline'>Discoveries</span>
        </TabsTrigger>
        <TabsTrigger
          value='genealogy'
          className='data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200'
        >
          <FileText className='h-4 w-4 mr-2 md:mr-1' />
          <span className='hidden md:inline'>Genealogy</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value='breeding' className='space-y-6'>
        <BreedingTab filteredFish={filteredFish} />
      </TabsContent>

      <TabsContent value='genetics' className='space-y-6'>
        <GeneticsTab setActiveTab={setActiveTab} />
      </TabsContent>

      <TabsContent value='discoveries' className='space-y-6'>
        <DiscoveriesTab />
      </TabsContent>

      <TabsContent value='genealogy' className='space-y-6'>
        <GenealogyTab />
      </TabsContent>
    </Tabs>
  );
}
