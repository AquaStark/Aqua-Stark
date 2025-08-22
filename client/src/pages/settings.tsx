'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Volume2, Eye, Bell, Globe, Palette, Zap } from 'lucide-react';

import { BubblesBackground } from '@/components/bubble-background';
import { PageHeader } from '@/components/layout/page-header';

import { Footer } from '@/components/layout/footer';

import useSettings, { SettingsState } from '@/hooks/use-settings';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  description,
  children,
}) => (
  <div className='flex items-center justify-between p-4 bg-blue-700/30 rounded-lg border border-blue-600/50 hover:bg-blue-700/40 transition-all duration-300'>
    <div className='flex items-center space-x-4'>
      <div className='w-12 h-12 bg-blue-600/50 rounded-full flex items-center justify-center'>
        {icon}
      </div>
      <div>
        <div className='text-white font-semibold text-lg'>{title}</div>
        <p className='text-blue-200 text-sm'>{description}</p>
      </div>
    </div>
    <div className='w-48'>{children}</div>
  </div>
);

const SettingsPage = () => {
  const { settings, updateSetting, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<SettingsState>(settings);

  const handleToggleChange = (key: keyof SettingsState, checked: boolean) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev, [key]: checked };
      updateSetting(key, checked);
      return newSettings;
    });
  };

  const handleSelectChange = (key: keyof SettingsState, value: string) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      updateSetting(key, value);
      return newSettings;
    });
  };

  return (
    <div className='min-h-screen overflow-hidden relative bg-gradient-to-b from-blue-500 to-blue-900 animated-background flex flex-col'>
      <BubblesBackground bubbles={[]} />
      <PageHeader title='Settings' backTo='/game' />

      <main className='relative z-20 flex flex-col items-center px-4 py-8 mx-auto max-w-7xl flex-grow w-full'>
        <div className='w-full max-w-4xl mx-auto space-y-8'>
          <Card className='bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-600/50'>
            {/* Replaced CardHeader and CardTitle */}
            <div className='p-0 mb-4 border-b border-blue-600/30 pb-2'>
              <h2 className='text-lg font-bold text-white'>Audio Settings</h2>
            </div>
            {/* Replaced CardContent */}
            <div className='p-0 space-y-4'>
              <SettingsItem
                icon={<Volume2 className='h-6 w-6 text-white' />}
                title='Sound Effects'
                description='Enable or disable in-game sound effects.'
              >
                <Switch
                  checked={localSettings.sound_enabled}
                  onCheckedChange={checked =>
                    handleToggleChange('sound_enabled', checked)
                  }
                  disabled={isLoading}
                />
              </SettingsItem>
            </div>
          </Card>

          <Card className='bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-600/50'>
            {/* Replaced CardHeader and CardTitle */}
            <div className='p-0 mb-4 border-b border-blue-600/30 pb-2'>
              <h2 className='text-lg font-bold text-white'>Visual Settings</h2>
            </div>
            {/* Replaced CardContent */}
            <div className='p-0 space-y-4'>
              <SettingsItem
                icon={<Eye className='h-6 w-6 text-white' />}
                title='Animations'
                description='Enable or disable UI animations.'
              >
                <Switch
                  checked={localSettings.animations_enabled}
                  onCheckedChange={checked =>
                    handleToggleChange('animations_enabled', checked)
                  }
                  disabled={isLoading}
                />
              </SettingsItem>
              <SettingsItem
                icon={<Palette className='h-6 w-6 text-white' />}
                title='UI Theme'
                description='Choose a visual theme for the game interface.'
              >
                <Select
                  value={localSettings.ui_theme}
                  onValueChange={(value: string) =>
                    handleSelectChange('ui_theme', value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select theme' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light Theme</SelectItem>
                    <SelectItem value='dark'>Dark Theme</SelectItem>
                    <SelectItem value='auto'>Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>
            </div>
          </Card>

          <Card className='bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-600/50'>
            {/* Replaced CardHeader and CardTitle */}
            <div className='p-0 mb-4 border-b border-blue-600/30 pb-2'>
              <h2 className='text-lg font-bold text-white'>
                Notification Settings
              </h2>
            </div>
            {/* Replaced CardContent */}
            <div className='p-0 space-y-4'>
              <SettingsItem
                icon={<Bell className='h-6 w-6 text-white' />}
                title='Notifications'
                description='Receive notifications for important in-game events.'
              >
                <Switch
                  checked={localSettings.notifications_enabled}
                  onCheckedChange={checked =>
                    handleToggleChange('notifications_enabled', checked)
                  }
                  disabled={isLoading}
                />
              </SettingsItem>
            </div>
          </Card>

          <Card className='bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-600/50'>
            {/* Replaced CardHeader and CardTitle */}
            <div className='p-0 mb-4 border-b border-blue-600/30 pb-2'>
              <h2 className='text-lg font-bold text-white'>
                Language Settings
              </h2>
            </div>
            {/* Replaced CardContent */}
            <div className='p-0 space-y-4'>
              <SettingsItem
                icon={<Globe className='h-6 w-6 text-white' />}
                title='Language'
                description='Select your preferred language for the game.'
              >
                <Select
                  value={localSettings.preferred_language}
                  onValueChange={(value: string) =>
                    handleSelectChange('preferred_language', value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select language' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='english'>English</SelectItem>
                    <SelectItem value='espanol'>Español</SelectItem>
                    <SelectItem value='francais'>Français</SelectItem>
                    <SelectItem value='deutsch'>Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>
            </div>
          </Card>

          <Card className='bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-600/50'>
            {/* Replaced CardHeader and CardTitle */}
            <div className='p-0 mb-4 border-b border-blue-600/30 pb-2'>
              <h2 className='text-lg font-bold text-white'>
                Gameplay Settings
              </h2>
            </div>
            {/* Replaced CardContent */}
            <div className='p-0 space-y-4'>
              <SettingsItem
                icon={<Zap className='h-6 w-6 text-white' />}
                title='Auto Feed'
                description='Automatically feed your pets when their hunger is low.'
              >
                <Switch
                  checked={localSettings.auto_feed_enabled}
                  onCheckedChange={checked =>
                    handleToggleChange('auto_feed_enabled', checked)
                  }
                  disabled={isLoading}
                />
              </SettingsItem>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage;
