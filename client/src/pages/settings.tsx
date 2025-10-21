'use client';

import { UnderConstruction } from '@/components/ui/under-construction';
import { PageHeader } from '@/components';
import { Volume2, Bell, Globe, Moon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <UnderConstruction 
      pageName="Settings"
      description="We're crafting the perfect underwater control center! Soon you'll be able to customize your aquarium experience and game preferences."
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        <PageHeader title="Settings" showBackButton={true} backButtonText="Back to Game" />
        
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Settings Sections */}
          <div className="space-y-4">
            {/* Audio Settings */}
            <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Volume2 className="w-5 h-5 text-blue-300" />
                <h3 className="text-lg font-semibold text-white">Audio</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Music Volume</span>
                  <div className="w-32 h-2 bg-blue-700/30 rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">SFX Volume</span>
                  <div className="w-32 h-2 bg-blue-700/30 rounded"></div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="w-5 h-5 text-blue-300" />
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Push Notifications</span>
                  <div className="w-12 h-6 bg-blue-700/30 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Email Updates</span>
                  <div className="w-12 h-6 bg-blue-700/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-blue-300" />
                <h3 className="text-lg font-semibold text-white">Language</h3>
              </div>
              <div className="h-10 bg-blue-700/30 rounded"></div>
            </div>

            {/* Display */}
            <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Moon className="w-5 h-5 text-blue-300" />
                <h3 className="text-lg font-semibold text-white">Display</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Dark Mode</span>
                <div className="w-12 h-6 bg-blue-700/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnderConstruction>
  );
}